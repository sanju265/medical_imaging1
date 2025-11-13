"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const fetcher = async (url: string, body: any) => {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  let data: any = null
  try {
    data = await r.json()
  } catch {
    // no body
  }
  return { ok: r.ok, ...(data && typeof data === "object" ? data : {}) }
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("demoskin123@gmail.com")
  const [password, setPassword] = useState("Demo@123")
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    try {
      const res = await fetcher("/api/auth/login", { email, password })
      if (res?.ok) {
        setMsg({ type: "success", text: "Login successful! Redirecting…" })
        const user = { email }
        if (remember) localStorage.setItem("ss_user", JSON.stringify(user))
        sessionStorage.setItem("ss_user", JSON.stringify(user))
        setTimeout(() => router.push("/dashboard"), 600)
      } else {
        setMsg({ type: "error", text: res?.error || "Invalid credentials" })
      }
    } catch (err) {
      setMsg({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-label="Login form">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-required="true"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-required="true"
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            aria-checked={remember}
          />
          Remember me
        </label>
        <a className="text-sm hover:underline text-muted-foreground" href="#" aria-label="Forgot password">
          Forgot password?
        </a>
      </div>
      {msg && (
        <div
          role="status"
          className={cn(
            "rounded-md px-3 py-2 text-sm",
            msg.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {msg.text}
        </div>
      )}
      <Button type="submit" disabled={loading} aria-busy={loading} className="justify-center">
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
