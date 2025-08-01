import type { Metadata } from 'next'
import './globals.css'
import GlobalHeader from '@/components/navigation/global-header'

export const metadata: Metadata = {
  title: 'Ko Lake Ambalama - Luxury Accommodation in Koggala',
  description: 'Experience luxury at Ko Lake Ambalama, Koggala. Beautiful accommodations with stunning lake views.',
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
