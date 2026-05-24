import { SignIn } from '@clerk/nextjs'
import { Logo } from '@/components/mealsaver/logo'

export default function LoginCatchAll() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Logo above the Clerk widget */}
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Logo size="lg" />
        <p className="text-sm text-muted-foreground">
          Save Food. Feed People.
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            card:              'shadow-sm border border-border rounded-2xl',
            headerTitle:       'text-foreground font-bold',
            headerSubtitle:    'text-muted-foreground',
            formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg',
            footerActionLink:  'text-primary hover:underline font-medium',
          },
        }}
        fallbackRedirectUrl="/donor/dashboard"
        signUpUrl="/register"
      />
    </div>
  )
}
