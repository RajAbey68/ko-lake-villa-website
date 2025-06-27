"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  ImageIcon,
  Video,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Share2,
  Download,
  Heart,
} from "lucide-react"

interface MediaItem {
  id: string
  type: "image" | "video"
  url: string
  title: string
  description: string
  category: string
  tags: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  altText: string
  uploadDate: string
  tribe?: string
  featured?: boolean
  duration?: string // for videos
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const mediaItems: MediaItem[] = [
    {
      id: "1",
      type: "image",
      url: "/images/hero-pool.jpg",
      title: "Infinity Pool at Golden Hour",
      description:
        "Our stunning 60-foot infinity pool overlooking the tranquil lake, captured during the magical golden hour when the water reflects the warm Sri Lankan sunset.",
      category: "Pool & Water Features",
      tags: ["infinity pool", "sunset", "luxury", "relaxation", "lake view", "golden hour"],
      seoTitle: "Luxury Infinity Pool Villa Sri Lanka | Ko Lake Villa Ahangama",
      seoDescription:
        "Experience our stunning 60-foot infinity pool with lake views at Ko Lake Villa. Perfect for families, wellness retreats, and luxury stays in Ahangama, Sri Lanka.",
      seoKeywords: [
        "infinity pool villa Sri Lanka",
        "luxury pool Ahangama",
        "lake view pool",
        "villa with pool Sri Lanka",
        "sunset pool photography",
      ],
      altText:
        "Infinity pool at Ko Lake Villa with golden sunset reflection and tranquil lake view in Ahangama Sri Lanka",
      uploadDate: "2024-01-15",
      tribe: "Family Groups",
      featured: true,
    },
    {
      id: "2",
      type: "video",
      url: "/placeholder.svg?height=400&width=600&text=Villa+Tour+Video",
      title: "Complete Villa Walkthrough Tour",
      description:
        "Take a comprehensive virtual tour of Ko Lake Villa's luxurious spaces, from the open-air living areas to the rooftop yoga deck, showcasing every detail of our 4-bedroom sanctuary.",
      category: "Villa Tour",
      tags: ["villa tour", "rooms", "facilities", "overview", "walkthrough", "luxury accommodation"],
      seoTitle: "Ko Lake Villa Tour | Luxury Villa Rental Ahangama Sri Lanka",
      seoDescription:
        "Virtual tour of Ko Lake Villa - luxury 4-bedroom villa with pool, lake views, and modern amenities. Perfect for surf trips, family holidays, and wellness retreats.",
      seoKeywords: [
        "villa tour Sri Lanka",
        "luxury accommodation Ahangama",
        "4 bedroom villa tour",
        "Sri Lanka villa rental",
        "Ahangama luxury stay",
      ],
      altText: "Complete video tour of Ko Lake Villa showing all rooms and luxury facilities in Ahangama Sri Lanka",
      uploadDate: "2024-01-10",
      tribe: "Digital Nomads",
      featured: true,
      duration: "3:45",
    },
    {
      id: "3",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Master+Bedroom+Suite",
      title: "Master Bedroom with Lake Views",
      description:
        "Spacious master bedroom suite featuring panoramic lake views, king-size bed, and ensuite bathroom with natural stone finishes and tropical garden access.",
      category: "Bedrooms & Suites",
      tags: ["master bedroom", "lake view", "ensuite", "luxury", "king bed", "natural stone"],
      seoTitle: "Master Bedroom Suite Lake View | Ko Lake Villa Luxury Accommodation",
      seoDescription:
        "Luxurious master bedroom with stunning lake views, king bed, and ensuite bathroom. Experience premium comfort at Ko Lake Villa, Ahangama.",
      seoKeywords: [
        "master bedroom lake view",
        "luxury bedroom Sri Lanka",
        "ensuite bathroom villa",
        "king bed accommodation",
        "lake view suite",
      ],
      altText: "Spacious master bedroom with panoramic lake views and luxury furnishings at Ko Lake Villa",
      uploadDate: "2024-01-12",
      tribe: "Wellness & Yoga Retreats",
    },
    {
      id: "4",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Rooftop+Yoga+Deck",
      title: "Rooftop Yoga & Meditation Deck",
      description:
        "Elevated rooftop space perfect for sunrise yoga sessions and evening meditation, surrounded by coconut palms with panoramic views of the lake and surrounding nature.",
      category: "Outdoor Spaces",
      tags: ["rooftop", "yoga deck", "meditation", "sunrise", "coconut palms", "panoramic views"],
      seoTitle: "Rooftop Yoga Deck Sri Lanka | Wellness Retreat Ko Lake Villa",
      seoDescription:
        "Private rooftop yoga deck with panoramic lake views. Perfect for wellness retreats, meditation, and sunrise yoga sessions at Ko Lake Villa.",
      seoKeywords: [
        "rooftop yoga Sri Lanka",
        "meditation deck villa",
        "wellness retreat space",
        "sunrise yoga Ahangama",
        "private yoga deck",
      ],
      altText: "Rooftop yoga and meditation deck with panoramic lake views surrounded by coconut palms",
      uploadDate: "2024-01-08",
      tribe: "Wellness & Yoga Retreats",
      featured: true,
    },
    {
      id: "5",
      type: "video",
      url: "/placeholder.svg?height=400&width=600&text=Sunset+Timelapse",
      title: "Lake Sunset Timelapse",
      description:
        "Mesmerizing timelapse of the sunset over our tranquil lake, showcasing the changing colors of the sky reflected in the still waters as day transitions to night.",
      category: "Nature & Surroundings",
      tags: ["sunset", "timelapse", "lake", "nature", "golden hour", "reflection"],
      seoTitle: "Sunset Lake Views Sri Lanka | Ko Lake Villa Natural Beauty",
      seoDescription:
        "Experience breathtaking sunset views over the tranquil lake at Ko Lake Villa. Natural beauty and serenity in Ahangama, Sri Lanka.",
      seoKeywords: [
        "sunset lake Sri Lanka",
        "lake view villa",
        "natural beauty Ahangama",
        "sunset photography",
        "tranquil lake setting",
      ],
      altText: "Timelapse video of stunning sunset over the tranquil lake at Ko Lake Villa",
      uploadDate: "2024-01-05",
      tribe: "Creative & Soulful Travellers",
      duration: "1:30",
    },
    {
      id: "6",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Open+Living+Area",
      title: "Open-Air Living & Dining Space",
      description:
        "Spacious open-air living and dining area with high ceilings, natural ventilation, and seamless indoor-outdoor flow, perfect for remote work and family gatherings.",
      category: "Living Areas",
      tags: ["open air", "living room", "dining", "high ceilings", "indoor outdoor", "remote work"],
      seoTitle: "Open Air Living Space | Ko Lake Villa Modern Design Sri Lanka",
      seoDescription:
        "Spacious open-air living and dining areas with modern design and natural ventilation. Perfect for remote work and family time at Ko Lake Villa.",
      seoKeywords: [
        "open air living Sri Lanka",
        "modern villa design",
        "indoor outdoor living",
        "remote work space",
        "family living area",
      ],
      altText: "Spacious open-air living and dining area with high ceilings and modern furnishings",
      uploadDate: "2024-01-14",
      tribe: "Digital Nomads & Remote Workers",
    },
    {
      id: "7",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Beach+Access",
      title: "Private Beach Access Path",
      description:
        "Scenic walkway through tropical vegetation leading to our private beach access, just 300 yards from the villa through mangroves and coconut groves.",
      category: "Beach & Location",
      tags: ["beach access", "private path", "tropical", "mangroves", "coconut trees", "300 yards"],
      seoTitle: "Private Beach Access | Ko Lake Villa Beachfront Location Sri Lanka",
      seoDescription:
        "Just 300 yards to pristine beaches through scenic tropical paths. Ko Lake Villa offers exclusive beach access in Ahangama, Sri Lanka.",
      seoKeywords: [
        "private beach access Sri Lanka",
        "beachfront villa Ahangama",
        "beach walk villa",
        "tropical path beach",
        "300 yards beach",
      ],
      altText: "Scenic tropical path leading to private beach access through mangroves and coconut palms",
      uploadDate: "2024-01-11",
      tribe: "Surf Travellers & Beach Lovers",
    },
    {
      id: "8",
      type: "video",
      url: "/placeholder.svg?height=400&width=600&text=Chef+Cooking",
      title: "Chef Preparing Sri Lankan Feast",
      description:
        "Watch our talented local chef prepare an authentic Sri Lankan feast using fresh local ingredients, traditional spices, and time-honored cooking techniques.",
      category: "Dining & Cuisine",
      tags: ["chef", "Sri Lankan cuisine", "cooking", "local ingredients", "traditional", "feast"],
      seoTitle: "Sri Lankan Chef Service | Authentic Cuisine Ko Lake Villa",
      seoDescription:
        "Experience authentic Sri Lankan cuisine prepared by our local chef using traditional recipes and fresh ingredients at Ko Lake Villa.",
      seoKeywords: [
        "Sri Lankan chef service",
        "authentic cuisine villa",
        "local cooking Sri Lanka",
        "traditional recipes",
        "chef prepared meals",
      ],
      altText: "Local chef preparing authentic Sri Lankan feast with traditional spices and fresh ingredients",
      uploadDate: "2024-01-09",
      tribe: "Small Celebration Groups",
      duration: "2:15",
    },
    {
      id: "9",
      type: "image",
      url: "/placeholder.svg?height=400&width=600&text=Mangrove+Wildlife",
      title: "Mangrove Wildlife & Birdwatching",
      description:
        "Rich biodiversity in the surrounding mangrove ecosystem, home to exotic birds, monitor lizards, and other wildlife that can be observed from the villa grounds.",
      category: "Nature & Surroundings",
      tags: ["mangroves", "wildlife", "birdwatching", "biodiversity", "nature", "ecosystem"],
      seoTitle: "Mangrove Wildlife Sri Lanka | Eco Villa Ko Lake Villa Ahangama",
      seoDescription:
        "Experience rich mangrove wildlife and birdwatching opportunities at Ko Lake Villa. Eco-conscious accommodation in natural Sri Lankan setting.",
      seoKeywords: [
        "mangrove wildlife Sri Lanka",
        "birdwatching villa",
        "eco accommodation",
        "nature villa Ahangama",
        "wildlife photography",
      ],
      altText: "Rich mangrove ecosystem with exotic birds and wildlife surrounding Ko Lake Villa",
      uploadDate: "2024-01-07",
      tribe: "Eco-Conscious & Nature-Loving Guests",
    },
  ]

  const categories = [
    "Pool & Water Features",
    "Villa Tour",
    "Bedrooms & Suites",
    "Living Areas",
    "Kitchen & Dining",
    "Outdoor Spaces",
    "Beach & Location",
    "Dining & Cuisine",
    "Nature & Surroundings",
    "Activities & Experiences",
  ]

  const filteredItems = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const openLightbox = (item: MediaItem) => {
    setSelectedItem(item)
    setCurrentIndex(filteredItems.findIndex((i) => i.id === item.id))
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
        : (currentIndex + 1) % filteredItems.length

    setCurrentIndex(newIndex)
    setSelectedItem(filteredItems[newIndex])
  }

  const handleShare = (item: MediaItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-pool.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">Villa Gallery</h1>
            <p className="text-xl md:text-2xl mb-4 text-white/95 drop-shadow-md">
              Relax, Revive, Connect Through Visual Stories
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 drop-shadow-sm max-w-2xl mx-auto">
              Explore our stunning spaces, natural surroundings, and luxury amenities through our curated collection of
              images and videos
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Controls */}
      <section className="py-8 bg-gradient-to-br from-orange-50 to-amber-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-orange-200 focus:border-orange-400"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-amber-600 hover:bg-amber-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className={`mt-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                onClick={() => setSelectedCategory("all")}
                className={selectedCategory === "all" ? "bg-amber-600 hover:bg-amber-700" : ""}
                size="sm"
              >
                All Media ({mediaItems.length})
              </Button>
              {categories.map((category) => {
                const count = mediaItems.filter((item) => item.category === category).length
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "bg-amber-600 hover:bg-amber-700" : ""}
                    size="sm"
                  >
                    {category} ({count})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="text-sm">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"} found
            </Badge>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-gray-500 hover:text-gray-700"
              >
                Clear search
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${item.featured ? "ring-2 ring-amber-200" : ""}`}
                  onClick={() => openLightbox(item)}
                >
                  <div className="relative aspect-video bg-gray-100">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.altText}
                      className="w-full h-full object-cover"
                    />

                    {/* Media Type Indicator */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {item.type === "image" ? (
                          <ImageIcon className="w-3 h-3 mr-1" />
                        ) : (
                          <Video className="w-3 h-3 mr-1" />
                        )}
                        {item.type}
                      </Badge>
                    </div>

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-600 text-white text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}

                    {/* Play Button for Videos */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
                          <Play className="w-8 h-8 text-white fill-white" />
                        </div>
                      </div>
                    )}

                    {/* Video Duration */}
                    {item.type === "video" && item.duration && (
                      <div className="absolute bottom-3 right-3">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                          {item.duration}
                        </Badge>
                      </div>
                    )}

                    {/* Tribe Badge */}
                    {item.tribe && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-blue-600 text-white text-xs">{item.tribe}</Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-amber-800 mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShare(item)
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openLightbox(item)}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 md:h-32 bg-gray-100 flex-shrink-0">
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.altText}
                        className="w-full h-full object-cover"
                      />

                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-amber-800">{item.title}</h3>
                        <div className="flex gap-2">
                          {item.featured && <Badge className="bg-amber-600 text-white text-xs">Featured</Badge>}
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.tags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{item.tags.length - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Uploaded {new Date(item.uploadDate).toLocaleDateString()}</span>
                        {item.tribe && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Perfect for {item.tribe}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No media found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-6xl w-full p-0 bg-black">
          {selectedItem && (
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-20 bg-black/50 text-white hover:bg-black/70 rounded-full"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-4 h-4" />
              </Button>

              {/* Navigation Buttons */}
              {filteredItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={() => navigateLightbox("prev")}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 text-white hover:bg-black/70 rounded-full"
                    onClick={() => navigateLightbox("next")}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Media Content */}
              <div className="aspect-video max-h-[70vh]">
                {selectedItem.type === "image" ? (
                  <img
                    src={selectedItem.url || "/placeholder.svg"}
                    alt={selectedItem.altText}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="text-center text-white">
                      <Video className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg mb-2">{selectedItem.title}</p>
                      <p className="text-sm text-gray-300">Video Player Would Load Here</p>
                      {selectedItem.duration && (
                        <Badge className="mt-2 bg-white/20 text-white">Duration: {selectedItem.duration}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-amber-800 mb-2">{selectedItem.title}</h2>
                    <p className="text-gray-600 mb-4">{selectedItem.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{selectedItem.category}</Badge>
                      {selectedItem.featured && <Badge className="bg-amber-600 text-white">Featured</Badge>}
                      {selectedItem.tribe && (
                        <Badge className="bg-blue-100 text-blue-800">Perfect for {selectedItem.tribe}</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedItem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleShare(selectedItem)}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Download functionality would go here
                        console.log("Download", selectedItem.title)
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* SEO Information */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">SEO Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">SEO Title:</p>
                      <p className="text-gray-600">{selectedItem.seoTitle}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">SEO Description:</p>
                      <p className="text-gray-600">{selectedItem.seoDescription}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-medium text-gray-700 mb-1">SEO Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.seoKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
