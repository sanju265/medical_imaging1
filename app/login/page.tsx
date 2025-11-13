import LoginForm from "@/components/forms/login-form"

export const metadata = {
  title: "Login — SkinSight+",
  description: "Log in to access your dashboard.",
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="text-sm text-muted-foreground mt-1">Log in to continue to your dashboard.</p>

      <div className="mt-4 rounded-lg border bg-muted p-4 text-sm" role="note" aria-label="Demo credentials">
        <p className="font-medium">Demo account</p>
        <ul className="mt-2 grid gap-1">
          <li>
            <span className="text-muted-foreground">Email:</span> demoskin123@gmail.com
          </li>
          <li>
            <span className="text-muted-foreground">Password:</span> Demo@123
          </li>
        </ul>
        <p className="mt-2 text-muted-foreground">Use these credentials to sign in quickly.</p>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-6">
        <LoginForm />
      </div>
    </div>
  )
}
