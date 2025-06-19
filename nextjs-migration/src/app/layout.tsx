import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ko Lake Villa - Luxury Accommodation in Sri Lanka',
  description: 'Experience luxury accommodation at Ko Lake Villa, nestled by the serene Koggala Lake in southern Sri Lanka. Perfect for families and groups.',
  keywords: 'Ko Lake Villa, Sri Lanka accommodation, Koggala Lake, luxury villa, vacation rental',
  openGraph: {
    title: 'Ko Lake Villa - Luxury Accommodation in Sri Lanka',
    description: 'Experience luxury accommodation at Ko Lake Villa, nestled by the serene Koggala Lake in southern Sri Lanka.',
    url: 'https://kolakevilla.com',
    siteName: 'Ko Lake Villa',
    images: [
      {
        url: 'https://kolakevilla.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ko Lake Villa - Luxury Accommodation in Sri Lanka',
    description: 'Experience luxury accommodation at Ko Lake Villa, nestled by the serene Koggala Lake in southern Sri Lanka.',
    images: ['https://kolakevilla.com/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}