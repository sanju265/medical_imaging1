"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type RecordItem = {
  reportId?: string
  prediction: string
  severity: number
  createdAt: string
  details?: { name?: string }
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [history, setHistory] = useState<RecordItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const session = sessionStorage.getItem("ss_user") || localStorage.getItem("ss_user")
    setUser(session ? JSON.parse(session) : null)
    const h = JSON.parse(localStorage.getItem("ss_history") || "[]")
    setHistory((h as RecordItem[]).slice().reverse())
  }, [])

  function view(rec: RecordItem) {
    sessionStorage.setItem("ss_last_result", JSON.stringify(rec))
    router.push("/dashboard/results")
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-card p-5">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">{user?.email ? `Signed in as ${user.email}` : "Signed in"}</p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-medium">Your Reports</h2>
        {!history.length ? (
          <p className="text-sm text-muted-foreground mt-2">No reports yet.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {history.map((rec) => (
              <li
                key={(rec.reportId || rec.createdAt) + rec.prediction}
                className="flex items-center justify-between gap-3"
              >
                <div className="text-sm">
                  <div className="font-medium">{rec.prediction}</div>
                  <div className="text-muted-foreground">
                    {new Date(rec.createdAt).toLocaleString()} • Severity {rec.severity}/100
                  </div>
                </div>
                <button onClick={() => view(rec)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
                  View report
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
