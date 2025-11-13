"use client"

import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import { useRouter } from "next/navigation"

type RecordItem = {
  reportId?: string
  prediction: string
  probabilities: Record<string, number>
  severity: number
  heatmap?: string
  description?: string
  details?: {
    name?: string
    age?: number
    gender?: string
    location?: string
    duration?: string
    priorDiagnosis?: string
  }
  createdAt: string
}

function severityLabel(sev: number) {
  if (sev >= 70) return "Severe"
  if (sev >= 40) return "Moderate"
  return "Mild"
}

export default function HistoryPage() {
  const [items, setItems] = useState<RecordItem[]>([])
  const router = useRouter()

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("ss_history") || "[]")
    setItems((history as RecordItem[]).slice().reverse())
  }, [])

  function download(rec: RecordItem) {
    const blob = new Blob([JSON.stringify(rec, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skinsight-history-${new Date(rec.createdAt).toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadPDF(rec: RecordItem) {
    const doc = new jsPDF()
    const d = rec.details || {}
    doc.setFontSize(16)
    doc.text("SkinSight+ Report", 14, 20)
    doc.setFontSize(11)
    doc.text(`Report ID: ${rec.reportId || "-"}`, 14, 30)
    doc.text(`Date: ${new Date(rec.createdAt).toLocaleString()}`, 14, 36)

    doc.setFontSize(13)
    doc.text("Patient", 14, 48)
    doc.setFontSize(11)
    doc.text(`Name: ${d.name || "-"}`, 14, 56)
    doc.text(`Age: ${d.age ?? "-"}`, 14, 62)
    doc.text(`Gender: ${d.gender || "-"}`, 14, 68)

    doc.setFontSize(13)
    doc.text("Analysis", 14, 84)
    doc.setFontSize(11)
    doc.text(`Prediction: ${rec.prediction}`, 14, 92)
    doc.text(`Severity: ${rec.severity}/100 (${severityLabel(rec.severity)})`, 14, 98)
    doc.save(`skinsight-report-${rec.reportId || Date.now()}.pdf`)
  }

  function view(rec: RecordItem) {
    sessionStorage.setItem("ss_last_result", JSON.stringify(rec))
    router.push("/dashboard/results")
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No history yet.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {items.map((rec) => (
        <div key={(rec.reportId || rec.createdAt) + rec.prediction} className="rounded-xl border bg-card p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="font-medium">{rec.prediction}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(rec.createdAt).toLocaleString()} • Severity {rec.severity}/100 ({severityLabel(rec.severity)})
              </p>
              <p className="text-xs text-muted-foreground">{rec.details?.name ? `Patient: ${rec.details.name}` : ""}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => view(rec)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
                View
              </button>
              <button onClick={() => download(rec)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent">
                Download JSON
              </button>
              <button
                onClick={() => downloadPDF(rec)}
                className="rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:opacity-90"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
