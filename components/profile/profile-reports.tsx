"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateReportPDF } from "@/lib/report-pdf"

type Probability = { label: string; probability: number }
type AnalysisResult = {
  id: string
  name: string
  age: number
  gender: string
  extras: Record<string, string>
  symptomsText: string
  imageDataUrl?: string
  summary: {
    topDiagnosis: string
    description: string
    severityScore: number
    severityGrade: "Mild" | "Moderate" | "Severe"
    probabilities: Probability[]
  }
  createdAt: string
}

export default function ProfileReports() {
  const [reports, setReports] = useState<AnalysisResult[]>([])

  useEffect(() => {
    const key = "skinsight_reports"
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as AnalysisResult[]
    setReports(existing)
  }, [])

  if (!reports.length) {
    return <p className="text-sm text-muted-foreground">No reports yet. Generate one in Disease Detection.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reports.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">
                  {r.name} — {r.age} — {r.gender}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</p>
                <p className="mt-1 text-sm">
                  <span className="font-medium">{r.summary.topDiagnosis}</span> · {r.summary.severityGrade} (
                  {r.summary.severityScore}%)
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => generateReportPDF(r)}>
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
