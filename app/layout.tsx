import type { Metadata } from 'next'
import './globals.css'
import GlobalHeader from '@/components/navigation/global-header'
import { ListingsProvider } from '@/components/listings-provider'

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
        <ListingsProvider>
          <GlobalHeader />
          {children}
        </ListingsProvider>
      </body>
    </html>
  )
}
