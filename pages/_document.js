import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Global CSS will be automatically injected by Next.js */}
        <meta name="description" content="Ko Lake Villa - Luxury Accommodation in Koggala" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body suppressHydrationWarning>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 