import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ko Lake Villa | Your Luxury Accommodation Catalyst',
  description: 'Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views. Your luxury accommodation catalyst for unforgettable memories.',
  keywords: 'Ko Lake Villa, Ahangama accommodation, Galle villa, Sri Lanka lakefront, Koggala Lake, boutique villa, family suite, group accommodation, infinity pool, direct booking, luxury villa Sri Lanka',
  openGraph: {
    title: 'Ko Lake Villa | Your Luxury Accommodation Catalyst',
    description: 'Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views.',
    url: 'https://skill-bridge-rajabey68.replit.app',
    siteName: 'Ko Lake Villa',
    images: [
      {
        url: '/preview-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ko Lake Villa | Your Luxury Accommodation Catalyst',
    description: 'Experience boutique lakeside luxury in Ahangama, Sri Lanka with personalized service and stunning lake views.',
    images: ['/preview-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}