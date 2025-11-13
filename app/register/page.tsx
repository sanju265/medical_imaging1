import RegisterForm from "@/components/forms/register-form"

export const metadata = {
  title: "Register — SkinSight+",
  description: "Create your SkinSight+ account.",
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <p className="text-sm text-muted-foreground mt-1">Sign up to start analyzing dermoscopic images.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <RegisterForm />
      </div>
    </div>
  )
}
