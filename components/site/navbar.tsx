"use client"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import ThemeToggle from "@/components/site/theme-toggle"

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard/detect", label: "Disease Detection" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <nav
        aria-label="Primary"
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <Link href="/" className="flex items-center gap-2" aria-label="SkinSight+ Home">
          <Image src="/logo.jpg" alt="SkinSight+ logo" width={28} height={28} />
          <span className="font-semibold tracking-tight">SkinSight+</span>
        </Link>
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md border"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <ul className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === l.href ? "text-primary font-medium" : "text-foreground",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
          {/* Theme toggle on desktop */}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
      {open && (
        <div className="md:hidden border-t">
          <ul className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 grid gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block w-full rounded-md px-3 py-2 hover:bg-accent",
                    pathname === l.href ? "text-primary font-medium" : "text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {/* Theme toggle in mobile menu */}
            <li className="pt-2">
              <ThemeToggle />
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
