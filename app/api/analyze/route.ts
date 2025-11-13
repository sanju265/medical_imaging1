import { NextResponse } from "next/server"
import { runDiseaseDetect } from "../algorithms/disease-detect"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const text = (form.get("text") as string) || ""
    const detailsRaw = (form.get("details") as string) || "{}"
    const details = JSON.parse(detailsRaw || "{}")

    let imageBase64: string | undefined
    if (file) {
      const arrayBuf = await file.arrayBuffer()
      const bytes = Buffer.from(arrayBuf)
      const mime = file.type || "image/jpeg"
      imageBase64 = `data:${mime};base64,` + bytes.toString("base64")
    }

    const modelOut = await runDiseaseDetect({ imageBase64, text, details })

    const createdAt = new Date().toISOString()
    const reportId = crypto.randomUUID()

    return NextResponse.json({
      ok: true,
      reportId,
      createdAt,
      details,
      ...modelOut,
    })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Analyze failed" }, { status: 400 })
  }
}
