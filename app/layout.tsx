import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Ko Lake Villa - Relax. Revive. Reconnect by the Lake in Ahangama, Sri Lanka",
  description: "Experience luxury accommodation at Ko Lake Villa in Ahangama, Sri Lanka. Book direct and save 10%.",
  keywords: "Ko Lake Villa, Ahangama, Sri Lanka, luxury accommodation, lake villa, booking",
  authors: [{ name: "Ko Lake Villa" }],
  creator: "Ko Lake Villa",
  publisher: "Ko Lake Villa",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ko-lake-villa-website.vercel.app",
    title: "Ko Lake Villa - Relax. Revive. Reconnect by the Lake in Ahangama, Sri Lanka",
    description: "Experience luxury accommodation at Ko Lake Villa in Ahangama, Sri Lanka. Book direct and save 10%.",
    siteName: "Ko Lake Villa",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ko Lake Villa - Relax. Revive. Reconnect by the Lake in Ahangama, Sri Lanka",
    description: "Experience luxury accommodation at Ko Lake Villa in Ahangama, Sri Lanka. Book direct and save 10%.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
