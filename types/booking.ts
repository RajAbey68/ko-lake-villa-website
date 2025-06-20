// Example of what I can create once I understand your requirements
export interface Booking {
  id: string
  guestName: string
  email: string
  phone: string
  checkIn: Date
  checkOut: Date
  guests: number
  roomType: string
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  specialRequests?: string
}

export interface Room {
  id: string
  name: string
  description: string
  capacity: number
  pricePerNight: number
  amenities: string[]
  images: string[]
  available: boolean
}
