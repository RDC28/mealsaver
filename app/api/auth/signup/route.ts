import { createClient } from '@/lib/supabase/server'
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

    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone ?? null,
          role: data.role,
        },
      },
    })

    if (authError) {
      if (authError.code === 'user_already_exists') {
        return err('An account with this email already exists', 409, 'EMAIL_TAKEN')
      }
      return err(authError.message, 400, authError.code ?? 'AUTH_ERROR')
    }

    if (!authData.user) return serverError('Account creation failed')

    return created({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role: data.role,
      },
      message: 'Account created successfully.',
    })
  } catch (e) {
    console.error('[POST /api/auth/signup]', e)
    return serverError()
  }
}
