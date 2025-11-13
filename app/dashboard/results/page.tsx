"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import jsPDF from "jspdf"

type Result = {
  prediction: string
  probabilities: Record<string, number>
  severity: number
  heatmap?: string
  createdAt?: string
  description?: string
  details?: {
    name?: string
    age?: number
    gender?: string
    location?: string
    duration?: number | string
    priorDiagnosis?: string
  }
  reportId?: string
}

function severityLabel(sev: number) {
  if (sev >= 70) return "Severe"
  if (sev >= 40) return "Moderate"
  return "Mild"
}

function fmtDays(d?: number | string) {
  if (d === undefined || d === null || d === "") return "-"
  const n = typeof d === "string" ? Number(d) : d
  if (Number.isFinite(n)) return `${n} day${n === 1 ? "" : "s"}`
  return String(d)
}

export default function ResultsPage() {
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    const last = sessionStorage.getItem("ss_last_result")
    setResult(last ? JSON.parse(last) : null)
  }, [])

  const probs = useMemo(() => {
    if (!result) return []
    const entries = Object.entries(result.probabilities)
    const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1
    // Sort highest probability first and only keep the top result
    return entries.map(([k, v]) => ({ k, v: Math.round((v / total) * 100) }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 1) // Only the first/top one
  }, [result])

  function downloadJSON() {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skinsight-result-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function downloadHeatmap() {
    const url = result?.heatmap || "/grad-cam-heatmap-placeholder.jpg"
    const a = document.createElement("a")
    a.href = url
    a.download = `skinsight-heatmap-${Date.now()}.png`
    a.click()
  }

  function downloadPDF() {
    if (!result) return
    const doc = new jsPDF()
    const d = result.details || {}
    doc.setFontSize(16)
    doc.text("SkinSight+ Report", 14, 20)
    doc.setFontSize(11)
    doc.text(`Report ID: ${result.reportId || "-"}`, 14, 30)
    doc.text(
      `Date: ${result.createdAt ? new Date(result.createdAt).toLocaleString() : new Date().toLocaleString()}`,
      14,
      36,
    )

    doc.setFontSize(13)
    doc.text("Patient", 14, 48)
    doc.setFontSize(11)
    doc.text(`Name: ${d.name || "-"}`, 14, 56)
    doc.text(`Age: ${d.age ?? "-"}`, 14, 62)
    doc.text(`Gender: ${d.gender || "-"}`, 14, 68)
    doc.text(`Location: ${d.location || "-"}`, 14, 74)
    doc.text(`Duration: ${fmtDays(d.duration)}`, 14, 80)
    doc.text(`Previous Dx/Treatment: ${d.priorDiagnosis || "-"}`, 14, 86)

    doc.setFontSize(13)
    doc.text("Analysis", 14, 100)
    doc.setFontSize(11)
    doc.text(`Prediction: ${result.prediction}`, 14, 108)
    doc.text(`Severity: ${result.severity}/100 (${severityLabel(result.severity)})`, 14, 114)
    doc.text("Probabilities:", 14, 122)
    let y = 128

    // Only the top result in PDF too
    probs.forEach((p) => {
      doc.text(`- ${p.k}: ${p.v}%`, 16, y)
      y += 6
    })
    const desc = (result.description || "").trim()
    if (desc) {
      y += 4
      doc.text("Description:", 14, y)
      y += 6
      const wrapped = doc.splitTextToSize(desc, 180)
      doc.text(wrapped, 14, y)
    }

    doc.save(`skinsight-report-${Date.now()}.pdf`)
  }

  if (!result) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No results yet. Try the Disease Detection page.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Prediction: {result.prediction}</h2>
        <p className="text-sm text-muted-foreground">
          Severity: {result.severity}/100 — {severityLabel(result.severity)}
        </p>
        {result.description && <p className="mt-3 text-sm text-pretty">{result.description}</p>}

        {/* Only the top result with probability bar */}
        <div className="mt-4 grid gap-2">
          {probs.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-sm">
                <span>{probs[0].k}</span>
                <span>{probs[0].v}%</span>
              </div>
              <div className="h-2 bg-muted rounded">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${probs[0].v}%` }}
                  aria-valuenow={probs[0].v}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={downloadJSON}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            Download Results (JSON)
          </button>
          <button
            onClick={downloadHeatmap}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm hover:bg-accent"
          >
            Download Heatmap
          </button>
          <button
            onClick={downloadPDF}
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm hover:opacity-90"
          >
            Download Report (PDF)
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-medium">Patient</h3>
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd>{result.details?.name || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Age</dt>
            <dd>{result.details?.age ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Gender</dt>
            <dd>{result.details?.gender || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Body area</dt>
            <dd>{result.details?.location || "-"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Duration</dt>
            <dd>{fmtDays(result.details?.duration)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Prev Dx/Treatment</dt>
            <dd>{result.details?.priorDiagnosis || "-"}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border bg-card p-6">
        
      </div>
    </div>
  )
}
