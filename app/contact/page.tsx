export const metadata = {
  title: "Contact — SkinSight+",
  description: "Get in touch with the SkinSight+ team.",
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold">Contact us</h1>
      <p className="text-sm text-muted-foreground mt-2">
        Questions, feedback, or partnerships? Send us a message below.
      </p>
      <form className="mt-6 grid gap-4 rounded-xl border bg-card p-6" aria-label="Contact form">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <input id="name" type="text" required className="h-10 rounded-md border bg-background px-3 text-sm" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input id="email" type="email" required className="h-10 rounded-md border bg-background px-3 text-sm" />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea id="message" rows={5} required className="rounded-md border bg-background px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 font-medium hover:opacity-90 transition-opacity"
        >
          Send message
        </button>
      </form>

      <div className="mt-6 text-sm text-muted-foreground">
        <p>
          Or reach us on social media:{" "}
          <a className="hover:underline" href="https://twitter.com">
            Twitter
          </a>
          ,{" "}
          <a className="hover:underline" href="https://linkedin.com">
            LinkedIn
          </a>
          .
        </p>
      </div>
    </div>
  )
}
