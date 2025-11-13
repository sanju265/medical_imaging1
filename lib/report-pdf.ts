// Inferred dependency: jspdf
import jsPDF from "jspdf"

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

export function generateReportPDF(r: AnalysisResult) {
  const doc = new jsPDF()
  let y = 14
  doc.setFontSize(16)
  doc.text("SkinSight+ Disease Detection Report", 14, y)
  y += 8
  doc.setFontSize(10)
  doc.text(`Report ID: ${r.id}`, 14, y)
  y += 6
  doc.text(`Date: ${new Date(r.createdAt).toLocaleString()}`, 14, y)
  y += 8

  doc.setFontSize(12)
  doc.text("Patient Details", 14, y)
  y += 6
  doc.setFontSize(10)
  doc.text(`Name: ${r.name}`, 14, y)
  y += 5
  doc.text(`Age: ${r.age}`, 14, y)
  y += 5
  doc.text(`Gender: ${r.gender}`, 14, y)
  y += 5
  doc.text(`Skin Type: ${r.extras?.skinType || "-"}`, 14, y)
  y += 5
  doc.text(`Duration: ${r.extras?.duration || "-"}`, 14, y)
  y += 5
  doc.text(`Affected Area: ${r.extras?.area || "-"}`, 14, y)
  y += 8

  doc.setFontSize(12)
  doc.text("Symptoms", 14, y)
  y += 6
  doc.setFontSize(10)
  const symptomsLines = doc.splitTextToSize(r.symptomsText || "-", 180)
  doc.text(symptomsLines, 14, y)
  y += symptomsLines.length * 5 + 6

  doc.setFontSize(12)
  doc.text("Analysis Summary", 14, y)
  y += 6
  doc.setFontSize(10)
  doc.text(`Top Diagnosis: ${r.summary.topDiagnosis}`, 14, y)
  y += 5
  doc.text(`Severity: ${r.summary.severityGrade} (${r.summary.severityScore}%)`, 14, y)
  y += 5
  const descLines = doc.splitTextToSize(r.summary.description, 180)
  doc.text(descLines, 14, y)
  y += descLines.length * 5 + 6

  doc.text("Probabilities:", 14, y)
  y += 5
  r.summary.probabilities.forEach((p) => {
    doc.text(`- ${p.label}: ${(p.probability * 100).toFixed(1)}%`, 18, y)
    y += 5
  })

  if (r.imageDataUrl) {
    try {
      y += 6
      doc.text("Image:", 14, y)
      y += 4
      // scale image to fit width
      const imgWidth = 120
      const imgHeight = 120
      doc.addImage(r.imageDataUrl, "JPEG", 14, y, imgWidth, imgHeight, undefined, "FAST")
      y += imgHeight + 6
    } catch (e) {
      // ignore image errors
    }
  }

  doc.save(`SkinSight_Report_${r.id}.pdf`)
}
