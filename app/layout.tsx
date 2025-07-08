import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ko Lake Villa - Luxury Accommodation in Koggala',
  description: 'Experience luxury at Ko Lake Villa, Koggala. Beautiful accommodations with stunning lake views.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
