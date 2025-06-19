const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown
): Promise<Response> {
  const url = endpoint.startsWith('/') ? `${API_BASE_URL}${endpoint}` : endpoint
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' && document.cookie ? {
        'Cookie': document.cookie
      } : {})
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${response.status}: ${errorText}`)
  }

  return response
}

export async function fetchRooms() {
  const response = await apiRequest('GET', '/api/rooms')
  return response.json()
}

export async function fetchGallery() {
  const response = await apiRequest('GET', '/api/gallery')
  return response.json()
}

export async function fetchActivities() {
  const response = await apiRequest('GET', '/api/activities')
  return response.json()
}