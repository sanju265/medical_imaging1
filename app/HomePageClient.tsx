"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

export default function HomePageClient() {
  return (
    <div className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <Image
          src={"/placeholder.svg?height=1200&width=1600&query=dermoscopy abstract background pattern"}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            <h1 className="text-pretty text-4xl md:text-5xl font-semibold">
              Your AI Dermatology Assistant for Early Insights
            </h1>
            <p className="text-muted-foreground leading-relaxed text-lg">
              SkinSight+ empowers healthcare professionals and individuals with cutting-edge AI analysis of dermoscopic
              images. Get accurate predictions, probability scores, severity grading, and visual heatmaps to support
              clinical decision-making.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Advanced AI Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Probability-Based Predictions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Severity Grading & Assessment
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Downloadable Reports
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/register"
                className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-6 py-3 font-medium shadow hover:opacity-90 transition-opacity"
                aria-label="Get Started"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-md border px-6 py-3 font-medium hover:bg-accent transition-colors"
                aria-label="Learn more"
              >
                Learn more
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="rounded-xl border bg-card p-4 md:p-6 shadow-sm"
          >
            <Image
              src="/1_CM3dajhvGmqTzvuLVbqczg.jpg"
              alt="Dermoscopic device illustration"
              width={720}
              height={480}
              className="rounded-lg"
            />

            <p className="mt-3 text-sm text-muted-foreground">
              Upload high-quality dermoscopic images to get comprehensive AI-powered analysis and clinical insights.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Accurate Probabilities",
            desc: "AI-powered probability scores for each disease classification with color-coded visual feedback for easy interpretation.",
          },
          {
            title: "Severity Indicator",
            desc: "Comprehensive severity grading system helps understand urgency and clinical priority at a glance.",
          },
          {
            title: "Accessible & Responsive",
            desc: "Optimized for all devices—desktop, tablet, and mobile. Works seamlessly across all platforms.",
          },
        ].map((c) => (
          <motion.div key={c.title} whileHover={{ y: -4 }} className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-medium text-lg">{c.title}</h3>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload",
              desc: "Submit your dermoscopic image and enter patient details",
              img: "/patient-uploading-medical-image.jpg",
            },
            {
              step: "2",
              title: "Analyze",
              desc: "Our AI processes the image and generates predictions",
              img: "/ai-analysis-processing-visualization.jpg",
            },
            {
              step: "3",
              title: "Review",
              desc: "Get detailed report with severity and recommendations",
              img: "/medical-report-dashboard-results.jpg",
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-lg overflow-hidden border shadow">
                <Image
                  src={item.img || "/placeholder.svg"}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full"
                />
              </div>
              <div className="inline-block bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3">
                {item.step}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
