"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [age, setAge] = useState<number | "">("")
  const [gender, setGender] = useState("prefer_not_to_say")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (password !== confirm) {
      setMsg({ type: "error", text: "Passwords do not match" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, age, gender }),
      }).then((r) => r.json())
      if (res?.ok) {
        setMsg({ type: "success", text: "Registration successful! Redirecting…" })
        localStorage.setItem("ss_user", JSON.stringify({ email, username }))
        setTimeout(() => router.push("/dashboard"), 600)
      } else {
        setMsg({ type: "error", text: res?.error || "Registration failed" })
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" aria-label="Register form">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input id="confirm" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min={0}
          value={age}
          onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="gender">Gender</Label>
        <select
          id="gender"
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          aria-label="Gender"
        >
          <option value="prefer_not_to_say">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="nonbinary">Non-binary</option>
          <option value="other">Other</option>
        </select>
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
        {loading ? "Creating account…" : "Create account"}
      </Button>
    </form>
  )
}
