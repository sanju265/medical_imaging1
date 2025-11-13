"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = (theme ?? resolvedTheme) === "dark"
  const next = isDark ? "light" : "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent transition-colors"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="mr-2">{isDark ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </button>
  )
}
