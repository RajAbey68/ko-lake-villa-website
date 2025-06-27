import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Villa Gallery | Ko Lake Villa - Luxury Accommodation Sri Lanka",
  description:
    "Explore our stunning villa gallery featuring luxury accommodations, infinity pool, lake views, and beautiful surroundings at Ko Lake Villa in Ahangama, Sri Lanka.",
  keywords: [
    "Ko Lake Villa gallery",
    "luxury villa Sri Lanka photos",
    "Ahangama accommodation images",
    "infinity pool villa",
    "lake view villa gallery",
    "Sri Lanka villa tour",
    "luxury accommodation photos",
  ],
  openGraph: {
    title: "Villa Gallery | Ko Lake Villa",
    description:
      "Discover the beauty of Ko Lake Villa through our comprehensive gallery showcasing luxury spaces, stunning lake views, and premium amenities.",
    images: [
      {
        url: "/images/hero-pool.jpg",
        width: 1200,
        height: 630,
        alt: "Ko Lake Villa infinity pool with lake views",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Villa Gallery | Ko Lake Villa",
    description:
      "Explore our luxury villa gallery featuring stunning accommodations and beautiful Sri Lankan surroundings.",
    images: ["/images/hero-pool.jpg"],
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
