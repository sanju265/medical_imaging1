"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/detect", label: "Disease Detection" },
  { href: "/dashboard/results", label: "View Results" },
  { href: "/dashboard/history", label: "History" },
  { href: "/dashboard/profile", label: "Profile" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Simple client-side "protection"
  useEffect(() => {
    const session = sessionStorage.getItem("ss_user") || localStorage.getItem("ss_user")
    if (!session) router.replace("/login")
  }, [router])

  function logout() {
    sessionStorage.removeItem("ss_user")
    localStorage.removeItem("ss_user")
    router.replace("/login")
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 grid md:grid-cols-[240px_1fr] gap-6">
      <aside className="rounded-xl border bg-card">
        <nav aria-label="Dashboard" className="p-4 grid gap-1">
          {nav.map((n) => {
            const active = pathname === n.href
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn("rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors", active && "bg-accent")}
              >
                {n.label}
              </Link>
            )
          })}
          <button
            className="mt-2 rounded-md px-3 py-2 text-left text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity font-medium"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
          >
            Logout
          </button>
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  )
}
