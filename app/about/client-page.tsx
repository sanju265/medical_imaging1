"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const slides = [
  "/OIP.webp",
  "/OIP (1).webp",
  "/AI-in-Healthcare-1200x628-1.webp",
]

export default function AboutClientPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-semibold text-pretty mb-6">About SkinSight+</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          SkinSight+ is an innovative AI-powered platform designed to revolutionize dermatological diagnostics. Our
          mission is to enhance early skin health insights using responsible, ethical, and clinically-validated
          artificial intelligence.
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We combine cutting-edge machine learning with an intuitive user interface to create a seamless workflow for
          healthcare professionals and individuals seeking accurate skin disease analysis and severity assessment.
        </p>
      </motion.div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Journey</h2>
        <div className="overflow-hidden rounded-xl border shadow-lg">
          <motion.div
            className="flex"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-100%", "-200%", "0%"] }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            {slides.concat(slides).map((src, i) => (
              <div className="min-w-full" key={i}>
                <Image
                  src={src || "/placeholder.svg"}
                  alt="Skin illustration"
                  width={1280}
                  height={720}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            To provide accessible, accurate, and responsible AI-assisted diagnostics that empower healthcare
            professionals and individuals to make informed decisions about skin health. We believe technology should
            enhance human expertise, not replace it.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-primary font-bold text-xl">→</span>
              <div>
                <p className="font-semibold">Evidence-Based Accuracy</p>
                <p className="text-sm text-muted-foreground">Validated with clinical research</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold text-xl">→</span>
              <div>
                <p className="font-semibold">User Privacy First</p>
                <p className="text-sm text-muted-foreground">Your data remains secure and confidential</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-primary font-bold text-xl">→</span>
              <div>
                <p className="font-semibold">Continuous Improvement</p>
                <p className="text-sm text-muted-foreground">Regular updates and enhancements</p>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="rounded-lg border bg-card p-6"
        >
          <Image
            src="/dermatology-research-lab-modern-technology.jpg"
            alt="SkinSight+ team working with AI"
            width={500}
            height={400}
            className="rounded-lg w-full mb-4"
          />
          <p className="text-sm text-muted-foreground">
            Our team of dermatologists, AI researchers, and UX designers work together to build tools that matter.
          </p>
        </motion.div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-8 text-center">Our Core Values</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Responsible Design",
              desc: "Accessibility and privacy are front-and-center in everything we build. We comply with HIPAA and data protection regulations.",
            },
            {
              title: "Smooth UX",
              desc: "Every interaction is thoughtfully designed with motion, feedback, and clarity to make analysis intuitive.",
            },
            {
              title: "Modern Stack",
              desc: "Built with Next.js, Tailwind, React, and advanced charting for a responsive, fast platform.",
            },
            {
              title: "Clinical Rigor",
              desc: "Validated algorithms and evidence-based predictions to support confident clinical decision-making.",
            },
            {
              title: "Transparent Reporting",
              desc: "Clear, detailed reports that explain predictions, probabilities, and severity assessments.",
            },
            {
              title: "Support & Education",
              desc: "Comprehensive guides, tutorials, and responsive support to help users get the most from SkinSight+.",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
