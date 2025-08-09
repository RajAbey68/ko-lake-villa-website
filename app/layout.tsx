import type { Metadata } from 'next'
import './globals.css'
import MainHeader from '@/components/MainHeader'

export const metadata: Metadata = {
  metadataBase: new URL('https://kolakevilla.com'),
  title: 'Ko Lake Villa - Luxury Accommodation in Koggala',
  description: 'Experience luxury at Ko Lake Villa, Koggala. Beautiful accommodations with stunning lake views.',
  openGraph: {
    type: 'website',
    url: 'https://kolakevilla.com',
    title: 'Ko Lake Villa - Luxury Lakefront Accommodation',
    description: 'Experience luxury at Ko Lake Villa, Koggala. Beautiful accommodations with stunning lake views.',
    images: ['/images/hero-pool.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ko Lake Villa - Luxury Accommodation',
    description: 'Experience luxury at Ko Lake Villa, Koggala.',
    images: ['/images/hero-pool.jpg']
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MainHeader />
        {children}
      </body>
    </html>
  )
}
