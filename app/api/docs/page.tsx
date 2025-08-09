"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Lazy-load Swagger UI on client
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false }) as any
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocsPage() {
  const [specUrl, setSpecUrl] = useState<string>('')
  useEffect(() => {
    setSpecUrl('/api/openapi')
  }, [])

  return (
    <div style={{ minHeight: '100vh' }}>
      <SwaggerUI url={specUrl} docExpansion="list" deepLinking={true} />
    </div>
  )
}


