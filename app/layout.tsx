import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import GlobalHeader from "@/components/navigation/global-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ko Lake Villa - Luxury Villa in Ahangama, Sri Lanka",
  description:
    "Relax. Revive. Connect by Koggala Lake in Ahangama, Sri Lanka. Experience luxury accommodation with stunning lake views.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
