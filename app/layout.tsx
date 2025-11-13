import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navbar from "@/components/site/navbar"
import Footer from "@/components/site/footer"
import PageTransition from "@/components/site/page-transition"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "SkinSight+ — AI Dermatology Assistant",
  description:
    "SkinSight+ helps analyze dermoscopic images with AI to provide predictions, probabilities, and severity insights.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.jpg",
  },
  keywords: ["dermatology", "AI", "skin analysis", "healthcare", "dermoscopy", "SkinSight+"],
  openGraph: {
    title: "SkinSight+ — AI Dermatology Assistant",
    description:
      "Analyze dermoscopic images with AI. Get predictions, probabilities, severity grading, and heatmap insights.",
    images: ["/logo.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <PageTransition>{children}</PageTransition>
            <Footer />
          </Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
