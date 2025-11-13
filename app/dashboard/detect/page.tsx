"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Details = {
  name: string
  age: number | ""
  gender: "Male" | "Female" | "Other" | ""
  location: string
  duration: number | ""
  priorDiagnosis: string
}

export default function DetectPage() {
  const router = useRouter()
  const [details, setDetails] = useState<Details>({
    name: "",
    age: "",
    gender: "",
    location: "",
    duration: "",
    priorDiagnosis: "",
  })
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
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
    if (f.size > 8 * 1024 * 1024) {
      setError("File too large (max 8MB)")
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  async function analyze() {
    setError(null)
    if (!details.name || !details.age || !details.gender) {
      setError("Please fill in name, age, and gender")
      return
    }
    if (!file) {
      setError("Please select an image")
      return
    }
    setLoading(true)
    try {
      const form = new FormData()
      form.append("file", file)
      form.append("text", notes)
      form.append("details", JSON.stringify(details))
      const res = await fetch("/api/analyze", { method: "POST", body: form }).then((r) => r.json())
      if (!res?.ok) {
        setError(res?.error || "Failed to analyze")
        return
      }
      const record = {
        ...res,
        createdAt: new Date().toISOString(),
      }
      const history = JSON.parse(localStorage.getItem("ss_history") || "[]")
      localStorage.setItem("ss_history", JSON.stringify([...history, record]))
      sessionStorage.setItem("ss_last_result", JSON.stringify(record))
      router.push("/dashboard/results")
    } catch (e) {
      setError("Something went wrong during analysis")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-2xl font-semibold text-balance">Disease Detection</h1>
            <p className="text-sm text-muted-foreground mt-2 text-pretty">
              Enter patient details, add descriptive notes, and upload a dermoscopic image. We&apos;ll analyze the
              inputs and provide probabilities, a brief description, and a severity grade.
            </p>
          </div>
          <div className="relative">
            <Image
              src="/images/dermatology-exam.jpg"
              alt="Dermatology consultation"
              width={640}
              height={420}
              className="rounded-lg border object-cover w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Patient Details Box */}
        <section className="rounded-xl border bg-card p-4 md:p-6">
          <h2 className="font-medium mb-4">Patient Details</h2>
          <div className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="rounded-md border px-3 py-2 bg-background"
                  value={details.name}
                  onChange={(e) => setDetails({ ...details, name: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min={0}
                  className="rounded-md border px-3 py-2 bg-background"
                  value={details.age}
                  onChange={(e) => setDetails({ ...details, age: Number(e.target.value) || "" })}
                  required
                  aria-required="true"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  className="rounded-md border px-3 py-2 bg-background"
                  value={details.gender}
                  onChange={(e) => setDetails({ ...details, gender: e.target.value as Details["gender"] })}
                  required
                  aria-required="true"
                >
                  <option value="">Select…</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration (days)
                </label>
                <input
                  id="duration"
                  type="number"
                  min={0}
                  className="rounded-md border px-3 py-2 bg-background"
                  value={details.duration}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      duration: e.target.value === "" ? "" : Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Body area
              </label>
              <input
                id="location"
                className="rounded-md border px-3 py-2 bg-background"
                value={details.location}
                onChange={(e) => setDetails({ ...details, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="prior" className="text-sm font-medium">
                Previous diagnosis/treatment
              </label>
              <input
                id="prior"
                className="rounded-md border px-3 py-2 bg-background"
                value={details.priorDiagnosis}
                onChange={(e) => setDetails({ ...details, priorDiagnosis: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Symptoms Box */}
        <section className="rounded-xl border bg-card p-4 md:p-6">
          <h2 className="font-medium mb-4">Symptoms & Notes</h2>
          <p className="text-xs text-muted-foreground mb-3">Describe symptoms, onset, changes, and any concerns.</p>
          <textarea
            className="w-full min-h-40 rounded-md border px-3 py-2 bg-background"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Raised lesion with irregular border and recent color change…"
          />
        </section>

        {/* Image Upload Box */}
        <section className="rounded-xl border bg-card p-4 md:p-6">
          <h2 className="font-medium mb-4">Upload Image</h2>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="rounded-lg border-2 border-dashed bg-background p-8 text-center"
            aria-label="Drag and drop area"
          >
            <p className="text-sm text-muted-foreground">Drag & drop an image here</p>
            <p className="text-sm text-muted-foreground">or</p>
            <label className="inline-flex mt-3 cursor-pointer rounded-md border px-4 py-2 text-sm hover:bg-accent transition-colors">
              <input type="file" accept="image/*" onChange={onChoose} className="sr-only" />
              Choose file
            </label>
            {preview && (
              <div className="mt-6 flex justify-center">
                <Image
                  src={preview || "/placeholder.svg?height=360&width=360&query=dermoscopy preview"}
                  alt="Preview"
                  width={360}
                  height={360}
                  className="rounded-lg border object-cover max-w-full"
                />
              </div>
            )}
          </div>
          {error && <div className="mt-4 rounded-md bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>}
          <button
            onClick={analyze}
            disabled={loading}
            className="mt-6 w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-3 font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
            aria-busy={loading}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </section>
      </div>
    </div>
  )
}
