"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function DashboardHome() {
  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border bg-card p-6 md:p-8"
      >
        <h1 className="text-3xl md:text-4xl font-semibold text-balance mb-4">Getting Started with Disease Detection</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Welcome to SkinSight+ Disease Detection. This guide walks you through analyzing dermoscopic images and getting
          accurate AI-powered predictions with severity assessments.
        </p>
      </motion.div>

      {/* Step-by-step instructions */}
      <div className="grid gap-6">
        {[
          {
            step: "1",
            title: "Enter Patient Details",
            desc: "Start by filling in basic patient information including name, age, gender, and location. This helps personalize the analysis and create comprehensive reports.",
            points: [
              "Name: Full name of the patient",
              "Age: Patient's current age in years",
              "Gender: Select Male, Female, or Other",
              "Location: Geographic location (optional but helpful)",
            ],
            img: "/patient-intake-form-medical-clipboard.jpg",
          },
          {
            step: "2",
            title: "Provide Medical Context",
            desc: "Enter any symptoms, medical history, or prior diagnoses relevant to the condition. This context helps the AI provide more accurate predictions.",
            points: [
              "Duration: How long the condition has been present (in days)",
              "Prior Diagnosis: Any previous skin condition diagnoses",
              "Additional Notes: Symptoms, observed changes, or concerns",
              "Medications: Relevant treatments or medications (if applicable)",
            ],
            img: "/doctor-taking-medical-notes-patient-history.jpg",
          },
          {
            step: "3",
            title: "Upload Dermoscopic Image",
            desc: "Upload a clear, high-quality dermoscopic image. The image quality directly impacts prediction accuracy.",
            points: [
              "Image Format: JPG, PNG, or WebP accepted",
              "Maximum Size: 8MB",
              "Resolution: High-resolution images (1080p or higher) recommended",
              "Lighting: Ensure adequate and even lighting with no shadows",
              "Angle: Direct overhead view of the lesion area",
            ],
            img: "/dermatoscope-close-up-skin-lesion-photography.jpg",
          },
          {
            step: "4",
            title: "Review & Analyze",
            desc: "Once all details are entered and the image is uploaded, click Analyze to process the image with our AI algorithm.",
            points: [
              "Processing time: Usually 5-30 seconds depending on image size",
              "Algorithm: Our model analyzes multiple dermatological features",
              "Validation: Predictions are cross-referenced with clinical databases",
              "Results: Detailed report generates automatically",
            ],
            img: "/ai-machine-learning-analysis-computing-processing.jpg",
          },
          {
            step: "5",
            title: "Interpret Results",
            desc: "Review the analysis results including disease probability, severity grading, and visual heatmap showing areas of concern.",
            points: [
              "Predictions: Disease classification with confidence percentages",
              "Severity Score: 0-100 scale indicating condition severity",
              "Heatmap: Visual representation of affected areas",
              "Recommendations: Clinical guidance based on findings",
            ],
            img: "/medical-dashboard-results-analysis-report-data-vis.jpg",
          },
          {
            step: "6",
            title: "Download & Save Report",
            desc: "Generate and download a comprehensive PDF report that includes patient details, analysis findings, and clinical recommendations.",
            points: [
              "PDF Report: Includes all patient data and analysis",
              "Auto-save: Reports saved to History automatically",
              "Share: Reports can be shared with other healthcare providers",
              "Archive: Access past reports anytime from History",
            ],
            img: "/document-pdf-report-medical-record-certificate.jpg",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl border bg-card p-6 md:p-8"
          >
            <div className="grid md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full font-bold text-lg">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold">{item.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                <ul className="space-y-2">
                  {item.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border overflow-hidden shadow">
                <Image
                  src={item.img || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Important notes section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-950/30 dark:border-orange-900 p-6 md:p-8"
      >
        <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">Important Disclaimer</h3>
        <ul className="space-y-3 text-sm text-orange-800 dark:text-orange-200">
          <li className="flex gap-3">
            <span className="font-bold">⚠</span>
            <span>
              SkinSight+ is a <strong>diagnostic support tool</strong>, not a replacement for professional medical
              diagnosis. Always consult with a qualified dermatologist for final clinical decisions.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold">⚠</span>
            <span>
              Results should be interpreted by healthcare professionals in the context of patient history and clinical
              examination.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold">⚠</span>
            <span>
              Accuracy depends on image quality, lighting, and angle. Poor quality images may produce unreliable
              results.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold">⚠</span>
            <span>
              Patient data is encrypted and handled in compliance with HIPAA and international privacy regulations.
            </span>
          </li>
        </ul>
      </motion.div>

      {/* CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-xl border bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8 text-center"
      >
        <h3 className="text-2xl font-semibold mb-3">Ready to Get Started?</h3>
        <p className="text-muted-foreground mb-6">
          Click below to begin your disease detection analysis. Have your dermoscopic image and patient information
          ready.
        </p>
        <Link
          href="/dashboard/detect"
          className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-8 py-3 font-medium shadow hover:opacity-90 transition-opacity"
        >
          Start Analysis
        </Link>
      </motion.div>
    </div>
  )
}
