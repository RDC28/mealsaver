import { clerkClient } from '@clerk/nextjs/server'
import { db, users } from '@/lib/db'
import { validateBody, z } from '@/lib/api/validate'
import { created, err, serverError } from '@/lib/api/response'

const signupSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Must be a valid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters'),
  full_name: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number format')
    .optional(),
  role: z.enum(['donor', 'receiver'], {
    required_error: 'Role is required',
    invalid_type_error: 'Role must be donor or receiver',
  }),
})

export async function POST(req: Request) {
  try {
    const { data, error } = await validateBody(req, signupSchema)
    if (error) return error

    const clerk = await clerkClient()

    // 1. Create user in Clerk
    let clerkUser
    try {
      clerkUser = await clerk.users.createUser({
        emailAddress: [data.email],
        password: data.password,
        firstName: data.full_name.split(' ')[0],
        lastName: data.full_name.split(' ').slice(1).join(' ') || undefined,
        publicMetadata: { role: data.role },
      })
    } catch (clerkErr: unknown) {
      const clerkError = clerkErr as { errors?: { code?: string; message?: string }[] }
      const code = clerkError?.errors?.[0]?.code ?? ''
      if (
        code === 'form_identifier_exists' ||
        code === 'user_already_exists'
      ) {
        return err('An account with this email already exists', 409, 'EMAIL_TAKEN')
      }
      const message = clerkError?.errors?.[0]?.message ?? 'Failed to create account'
      return err(message, 400, 'AUTH_ERROR')
    }

    // 2. Insert into our Neon users table
    const [newUser] = await db
      .insert(users)
      .values({
        email:     data.email,
        full_name: data.full_name,
        phone:     data.phone ?? null,
        role:      data.role,
        clerk_id:  clerkUser.id,
        is_active: true,
      })
      .returning()

    if (!newUser) {
      // Clean up Clerk user if DB insert fails
      await clerk.users.deleteUser(clerkUser.id).catch(() => null)
      return serverError('Account creation failed')
    }

    return created({
      user: {
        id:    newUser.id,
        email: newUser.email,
        role:  newUser.role,
      },
      message: 'Account created successfully.',
    })
  } catch (e) {
    console.error('[POST /api/auth/signup]', e)
    return serverError()
  }
}
