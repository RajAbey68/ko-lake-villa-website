// Database types based on your schema
export interface GalleryImage {
  id: number
  image_url: string
  title: string
  alt: string
  description?: string
  tags?: string
  category: string
  featured: boolean
  sort_order: number
  media_type: "image" | "video"
  file_size: number
  created_at: Date
  updated_at: Date
}

export interface BookingInquiry {
  id: number
  check_in_date: string
  check_out_date: string
  guests: number
  room_type: string
  name: string
  email: string
  special_requests?: string
  created_at: Date
  processed: boolean
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  created_at: Date
  read: boolean
}

export interface AdminAuditLog {
  id: number
  admin_id: string
  admin_email: string
  action: string
  resource: string
  resource_id?: string
  details?: any
  ip_address?: string
  timestamp: Date
  status: string
}

export interface RoomType {
  id: string
  name: string
  capacity: string
  rooms: string
  basePrice: number
  airbnbPrice: number
  savings: number
}

export const ROOM_TYPES: Record<string, RoomType> = {
  KLV: {
    id: "KLV",
    name: "Entire Villa",
    capacity: "Up to 18 guests",
    rooms: "7 bedrooms",
    basePrice: 388,
    airbnbPrice: 431,
    savings: 43,
  },
  KLV1: {
    id: "KLV1",
    name: "Master Family Suite",
    capacity: "6+ guests",
    rooms: "Large suite",
    basePrice: 107,
    airbnbPrice: 119,
    savings: 12,
  },
  KLV3: {
    id: "KLV3",
    name: "Triple/Twin Room",
    capacity: "3+ guests per room",
    rooms: "Individual rooms",
    basePrice: 63,
    airbnbPrice: 70,
    savings: 7,
  },
  KLV6: {
    id: "KLV6",
    name: "Group Room",
    capacity: "6+ guests",
    rooms: "Large group space",
    basePrice: 225,
    airbnbPrice: 250,
    savings: 25,
  },
}

export const GALLERY_CATEGORIES = [
  "entire-villa",
  "family-suite",
  "group-room",
  "triple-room",
  "dining-area",
  "pool-deck",
  "lake-garden",
  "roof-garden",
  "front-garden",
  "koggala-lake",
  "excursions",
] as const

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]
