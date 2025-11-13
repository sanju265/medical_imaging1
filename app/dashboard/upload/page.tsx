"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

const symptomsList = ["Itching", "Bleeding", "Growth", "Color change", "Pain"]

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    handleFile(f)
  }
  function onChoose(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    handleFile(f || null)
  }
  function handleFile(f: File | null | undefined) {
    setError(null)
    if (!f) return
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File too large (max 5MB)")
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }
  function toggleSymptom(s: string) {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  async function analyze() {
    if (!file) {
      setError("Please select an image first")
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("symptoms", JSON.stringify(symptoms))
      const res = await fetch("/api/analyze", { method: "POST", body: form }).then((r) => r.json())
      // Save to history
      const history = JSON.parse(localStorage.getItem("ss_history") || "[]")
      const record = { ...res, createdAt: new Date().toISOString() }
      localStorage.setItem("ss_history", JSON.stringify([...history, record]))
      sessionStorage.setItem("ss_last_result", JSON.stringify(record))
      router.push("/dashboard/results")
    } catch {
      setError("Failed to analyze image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-xl border bg-card p-6 text-center"
        aria-label="Drag and drop area"
      >
        <p className="text-sm text-muted-foreground">Drag & drop an image here</p>
        <p className="text-sm text-muted-foreground">or</p>
        <label className="inline-flex mt-3 cursor-pointer rounded-md border px-4 py-2 text-sm hover:bg-accent">
          <input type="file" accept="image/*" onChange={onChoose} className="sr-only" />
          Choose file
        </label>
        {preview && (
          <div className="mt-4 flex justify-center">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              width={360}
              height={360}
              className="rounded-lg border object-cover"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-medium">Symptoms</h3>
        <div className="mt-3 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          {symptomsList.map((s) => (
            <label key={s} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="size-4"
                checked={symptoms.includes(s)}
                onChange={() => toggleSymptom(s)}
                aria-checked={symptoms.includes(s)}
              />
              {s}
            </label>
          ))}
        </div>
      </div>

      {error && <div className="rounded-md bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>}

      <button
        onClick={analyze}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        aria-busy={loading}
      >
        {loading ? "Analyzing…" : "Analyze"}
      </button>
    </div>
  )
}
