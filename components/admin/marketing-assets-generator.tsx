"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, Users, Heart, Waves, Laptop, Palette, PartyPopper, Leaf } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TribeAssets {
  name: string
  icon: React.ComponentType<any>
  color: string
  metaDescriptions: string[]
  taglines: string[]
  landingHeaders: string[]
  cmsBlocks: {
    heroTitle: string
    heroSubtitle: string
    benefitsTitle: string
    benefits: string[]
    cta: string
  }
  keywords: string[]
}

export default function MarketingAssetsGenerator() {
  const [selectedTribe, setSelectedTribe] = useState<string>("Family Groups")
  const [copiedText, setCopiedText] = useState<string>("")

  const tribeAssets: Record<string, TribeAssets> = {
    "Family Groups": {
      name: "Family Groups",
      icon: Users,
      color: "bg-blue-100 text-blue-800",
      metaDescriptions: [
        "Family-friendly Ko Lake Villa in Ahangama, Sri Lanka. 4-bedroom luxury villa with safe pool, beach access & chef service. Perfect for multi-generational holidays.",
        "Luxury family villa Sri Lanka | Ko Lake Villa Ahangama. Private pool, 300m to beach, cribs available. Book direct & save 10% on your family getaway.",
        "Ko Lake Villa: Premium family accommodation in Ahangama. Spacious rooms, kid-safe pool, tranquil lake setting. Ideal for families seeking luxury & comfort.",
      ],
      taglines: [
        "Relax, Revive, Connect as a Family",
        "Your Family's Sri Lankan Paradise",
        "Luxury That Brings Families Together",
        "Safe, Spacious, Simply Perfect for Families",
        "Creating Generations of Happy Memories",
      ],
      landingHeaders: [
        "The Perfect Family Escape in Sri Lanka",
        "Where Every Family Member Feels at Home",
        "Luxury Villa Living for the Whole Family",
        "Your Family's Private Paradise Awaits",
        "Multi-Generational Memories Start Here",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Where Families Create Lasting Memories",
        heroSubtitle:
          "Spacious 4-bedroom luxury villa with safe pool, beach access, and everything your family needs for the perfect Sri Lankan getaway. Relax, Revive, Connect.",
        benefitsTitle: "Why Families Choose Ko Lake Villa",
        benefits: [
          "Multi-room flexibility with extra beds and cribs available",
          "Safe 60-foot pool perfect for children of all ages",
          "Just 300 yards from family-friendly beaches",
          "Chef service for stress-free family meals",
          "Tranquil setting away from busy tourist areas",
        ],
        cta: "Book Your Family Adventure Today",
      },
      keywords: [
        "family-friendly villa Sri Lanka",
        "private villa for families",
        "villa with pool for children",
        "group holiday villa South Coast",
        "family accommodation Ahangama",
      ],
    },

    "Wellness & Yoga Retreats": {
      name: "Wellness & Yoga Retreats",
      icon: Heart,
      color: "bg-green-100 text-green-800",
      metaDescriptions: [
        "Wellness retreat at Ko Lake Villa, Ahangama. Rooftop yoga deck, tranquil lake views, healthy cuisine. Perfect private villa for meditation & mindfulness retreats.",
        "Yoga retreat Sri Lanka | Ko Lake Villa wellness sanctuary. Private villa with meditation spaces, lake energy, organic meals. Book your transformative getaway.",
        "Ko Lake Villa: Premier wellness retreat venue in Ahangama. Rooftop garden, peaceful lakeside setting, holistic experiences. Reconnect with your inner self.",
      ],
      taglines: [
        "Relax, Revive, Connect with Your Inner Self",
        "Your Wellness Sanctuary by the Lake",
        "Where Inner Peace Meets Outer Beauty",
        "Mindful Luxury in Sri Lanka",
        "Breathe. Be. Become.",
      ],
      landingHeaders: [
        "Your Private Wellness Sanctuary Awaits",
        "Transform Your Mind, Body & Spirit",
        "Lakeside Serenity for Soul Renewal",
        "Where Wellness Meets Luxury",
        "Your Journey to Inner Peace Starts Here",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Your Wellness Retreat Sanctuary",
        heroSubtitle:
          "Discover inner peace in our tranquil lakeside villa with dedicated yoga spaces, healthy cuisine, and mindful surroundings. Relax, Revive, Connect.",
        benefitsTitle: "Why Wellness Seekers Choose Ko Lake Villa",
        benefits: [
          "Rooftop garden perfect for yoga and meditation",
          "Quiet lakeside energy for deep relaxation",
          "Healthy, organic meal options with chef service",
          "Open-air living spaces for mindful connection",
          "Private setting away from distractions",
        ],
        cta: "Begin Your Wellness Journey",
      },
      keywords: [
        "yoga retreat Sri Lanka",
        "wellness villa Ahangama",
        "private villa for meditation",
        "retreat venue South Sri Lanka",
        "mindfulness retreat lakeside",
      ],
    },

    "Surf Travellers & Beach Lovers": {
      name: "Surf Travellers & Beach Lovers",
      icon: Waves,
      color: "bg-cyan-100 text-cyan-800",
      metaDescriptions: [
        "Surf stay Ko Lake Villa, Ahangama - 300 yards from 3 surf breaks. Luxury villa near Weligama & Dickwella waves. Chef meals, WiFi, perfect surf base.",
        "Ko Lake Villa: Premier surf accommodation Ahangama. Walking distance to sand beaches & surf spots. Luxury villa with pool for post-surf relaxation.",
        "Surf & stay at Ko Lake Villa, Sri Lanka. Prime location near Ahangama, Weligama surf breaks. 4-bedroom luxury villa with chef service & beach access.",
      ],
      taglines: [
        "Relax, Revive, Connect with the Ocean",
        "Your Perfect Wave Basecamp",
        "Where Surf Dreams Come True",
        "Ride Waves, Live Luxury",
        "Sri Lanka's Premier Surf Villa",
      ],
      landingHeaders: [
        "Your Ultimate Surf Base in Sri Lanka",
        "300 Yards from Perfect Waves",
        "Surf Paradise Meets Villa Luxury",
        "Wake Up to World-Class Surf",
        "The Surfer's Dream Villa Experience",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: The Ultimate Surf Base",
        heroSubtitle:
          "Just 300 yards from three pristine surf breaks. Luxury villa accommodation with easy access to Ahangama, Weligama, and Dickwella waves. Relax, Revive, Connect.",
        benefitsTitle: "Why Surfers Choose Ko Lake Villa",
        benefits: [
          "300 yards from 3 different sand and surf beaches",
          "Easy access to Ahangama, Weligama & Dickwella breaks",
          "Chef-prepared meals for post-surf recovery",
          "Fast WiFi to share your epic sessions",
          "60-foot pool for relaxation between surf sessions",
        ],
        cta: "Book Your Surf Adventure",
      },
      keywords: [
        "surf stay Ahangama",
        "villa near Weligama surf",
        "Dickwella surf accommodation",
        "surf and stay Sri Lanka",
        "surf villa South Coast",
      ],
    },

    "Digital Nomads & Remote Workers": {
      name: "Digital Nomads & Remote Workers",
      icon: Laptop,
      color: "bg-purple-100 text-purple-800",
      metaDescriptions: [
        "Digital nomad villa Sri Lanka | Ko Lake Villa Ahangama. Fast 300Mbps WiFi, AC rooms, peaceful work environment. Perfect remote work base near beaches.",
        "Ko Lake Villa: Premium remote work villa in Ahangama. High-speed internet, dedicated workspaces, lake views. Ideal for digital nomads seeking luxury.",
        "Work remotely from paradise at Ko Lake Villa. 300Mbps WiFi, quiet setting, modern amenities. The perfect blend of productivity and tropical living.",
      ],
      taglines: [
        "Relax, Revive, Connect from Paradise",
        "Your Productive Paradise",
        "Where WiFi Meets Wanderlust",
        "Remote Work, Luxury Living",
        "Your Office with a View",
      ],
      landingHeaders: [
        "Your Remote Work Paradise in Sri Lanka",
        "High-Speed Internet Meets Tropical Luxury",
        "Work Productively, Live Beautifully",
        "The Digital Nomad's Dream Villa",
        "Where Great WiFi Meets Greater Views",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Your Remote Work Paradise",
        heroSubtitle:
          "Fast 300Mbps WiFi, peaceful work environment, and luxury amenities. The perfect base for digital nomads and remote workers in Sri Lanka. Relax, Revive, Connect.",
        benefitsTitle: "Why Digital Nomads Choose Ko Lake Villa",
        benefits: [
          "Lightning-fast 300Mbps WiFi throughout the villa",
          "Peaceful, distraction-free work environment",
          "AC ensuite rooms for comfortable working",
          "Large work-friendly spaces with lake views",
          "Close to cafes and coworking options in Ahangama",
        ],
        cta: "Book Your Work-From-Paradise Experience",
      },
      keywords: [
        "Sri Lanka remote work villa",
        "digital nomad villa Sri Lanka",
        "fast WiFi villa South Coast",
        "remote work Ahangama",
        "nomad accommodation Sri Lanka",
      ],
    },

    "Creative & Soulful Travellers": {
      name: "Creative & Soulful Travellers",
      icon: Palette,
      color: "bg-pink-100 text-pink-800",
      metaDescriptions: [
        "Creative retreat Ko Lake Villa, Ahangama. Inspiring lake views, artistic spaces, flexible stays. Perfect writer's retreat & artist sanctuary in Sri Lanka.",
        "Ko Lake Villa: Where creativity flows. Scenic inspiration, rooftop garden, tranquil setting. Ideal for artists, writers & creative souls seeking inspiration.",
        "Artistic retreat villa Sri Lanka | Ko Lake Villa Ahangama. Beautiful lake setting, inspiring spaces, peaceful environment for creative minds.",
      ],
      taglines: [
        "Relax, Revive, Connect with Your Creativity",
        "Inspire Your Inner Artist",
        "Create. Dream. Inspire.",
        "Your Creative Sanctuary",
        "Art Meets Paradise",
      ],
      landingHeaders: [
        "Where Inspiration Meets Luxury",
        "Your Creative Sanctuary by the Lake",
        "Unleash Your Artistic Soul",
        "Create Your Masterpiece in Paradise",
        "Where Great Art Begins",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Your Creative Sanctuary",
        heroSubtitle:
          "Find inspiration in our scenic lakeside setting. Perfect for artists, writers, and creative souls seeking a peaceful retreat to unleash their creativity. Relax, Revive, Connect.",
        benefitsTitle: "Why Creatives Choose Ko Lake Villa",
        benefits: [
          "Scenic lake views for endless inspiration",
          "Rooftop garden perfect for creative contemplation",
          "Tranquil, open-air design that sparks creativity",
          "Flexible short or long stays for creative projects",
          "Peaceful environment free from distractions",
        ],
        cta: "Book Your Creative Escape",
      },
      keywords: [
        "artistic retreat Sri Lanka",
        "writer's retreat South Sri Lanka",
        "nature retreat with lake view",
        "creative villa Ahangama",
        "inspiration retreat Sri Lanka",
      ],
    },

    "Small Celebration Groups": {
      name: "Small Celebration Groups",
      icon: PartyPopper,
      color: "bg-orange-100 text-orange-800",
      metaDescriptions: [
        "Celebrate at Ko Lake Villa, Ahangama. Perfect for birthdays, reunions & small events. 4-bedroom luxury villa with pool, chef service & stunning lake views.",
        "Ko Lake Villa: Premier celebration venue near Galle. Private villa for birthdays, anniversaries & group events. Luxury amenities & personalized service.",
        "Small event venue Sri Lanka | Ko Lake Villa Ahangama. Intimate celebrations, luxury accommodation, chef service. Perfect for milestone birthdays & reunions.",
      ],
      taglines: [
        "Relax, Revive, Connect in Celebration",
        "Where Celebrations Become Memories",
        "Your Private Party Paradise",
        "Luxury Celebrations, Intimate Style",
        "Make Every Moment Memorable",
      ],
      landingHeaders: [
        "Celebrate Life's Special Moments in Style",
        "Your Private Celebration Paradise",
        "Where Intimate Gatherings Become Unforgettable",
        "Luxury Villa Celebrations Done Right",
        "Create Milestone Memories at Ko Lake Villa",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Your Private Celebration Venue",
        heroSubtitle:
          "Perfect for birthdays, reunions, and intimate celebrations. Luxury villa with pool, chef service, and stunning lake views for unforgettable moments. Relax, Revive, Connect.",
        benefitsTitle: "Why Celebration Groups Choose Ko Lake Villa",
        benefits: [
          "Two large suites perfect for 6 guests each",
          "Stunning 60-foot pool for memorable gatherings",
          "Professional chef service for special meals",
          "Transport options for group convenience",
          "Intimate setting perfect for meaningful celebrations",
        ],
        cta: "Plan Your Perfect Celebration",
      },
      keywords: [
        "villa for birthdays Sri Lanka",
        "small event venue near Galle",
        "private group stays South Coast",
        "celebration villa Ahangama",
        "reunion accommodation Sri Lanka",
      ],
    },

    "Eco-Conscious & Nature-Loving Guests": {
      name: "Eco-Conscious & Nature-Loving Guests",
      icon: Leaf,
      color: "bg-emerald-100 text-emerald-800",
      metaDescriptions: [
        "Eco villa Ko Lake Villa, Ahangama. Sustainable luxury among mangroves & coconut palms. Nature retreat with wildlife, birdwatching & Yala safari access.",
        "Ko Lake Villa: Eco-conscious luxury in Sri Lanka. Nestled in mangroves, low-impact living, local staff. Perfect nature retreat for environmentally aware travelers.",
        "Nature villa Ahangama | Ko Lake Villa eco retreat. Mangrove setting, sustainable practices, wildlife access. Luxury accommodation for eco-conscious guests.",
      ],
      taglines: [
        "Relax, Revive, Connect with Nature",
        "Where Eco Meets Elegance",
        "Sustainable Paradise",
        "Nature's Luxury Retreat",
        "Green Living, Golden Memories",
      ],
      landingHeaders: [
        "Sustainable Luxury in Natural Paradise",
        "Where Eco-Consciousness Meets Comfort",
        "Your Green Getaway in Sri Lanka",
        "Nature-Immersed Luxury Living",
        "Eco-Friendly Paradise by the Lake",
      ],
      cmsBlocks: {
        heroTitle: "Ko Lake Villa: Sustainable Luxury in Nature",
        heroSubtitle:
          "Eco-conscious villa nestled among mangroves and coconut palms. Experience luxury that respects and celebrates the natural environment. Relax, Revive, Connect.",
        benefitsTitle: "Why Eco-Conscious Guests Choose Ko Lake Villa",
        benefits: [
          "Nestled among pristine mangroves and coconut palms",
          "Low-impact living with sustainable practices",
          "Local staff supporting the community",
          "Nearby wildlife and birdwatching opportunities",
          "Easy access to Yala National Park safaris",
        ],
        cta: "Book Your Eco-Luxury Experience",
      },
      keywords: [
        "eco villa Sri Lanka",
        "nature villa Ahangama",
        "mangrove villa with pool",
        "sustainable accommodation Sri Lanka",
        "eco-conscious retreat",
      ],
    },
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(`${type}: ${text.substring(0, 50)}...`)
      setTimeout(() => setCopiedText(""), 3000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const exportAllAssets = () => {
    const tribe = tribeAssets[selectedTribe]
    const exportData = {
      tribe: tribe.name,
      metaDescriptions: tribe.metaDescriptions,
      taglines: tribe.taglines,
      landingHeaders: tribe.landingHeaders,
      cmsBlocks: tribe.cmsBlocks,
      keywords: tribe.keywords,
      generatedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ko-lake-villa-${tribe.name.toLowerCase().replace(/\s+/g, "-")}-assets.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const currentTribe = tribeAssets[selectedTribe]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-800">Marketing Assets Generator</h1>
        <Button onClick={exportAllAssets} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Assets
        </Button>
      </div>

      {copiedText && (
        <Alert className="bg-green-50 border-green-200">
          <Copy className="h-4 w-4" />
          <AlertDescription className="text-green-800">Copied: {copiedText}</AlertDescription>
        </Alert>
      )}

      {/* Tribe Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Object.entries(tribeAssets).map(([key, tribe]) => {
          const IconComponent = tribe.icon
          return (
            <Button
              key={key}
              variant={selectedTribe === key ? "default" : "outline"}
              onClick={() => setSelectedTribe(key)}
              className={`p-4 h-auto flex-col gap-2 ${selectedTribe === key ? "bg-amber-600 hover:bg-amber-700" : ""}`}
            >
              <IconComponent className="w-6 h-6" />
              <span className="text-xs text-center leading-tight">{tribe.name}</span>
            </Button>
          )
        })}
      </div>

      <Tabs defaultValue="meta" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta">Meta Descriptions</TabsTrigger>
          <TabsTrigger value="taglines">Taglines</TabsTrigger>
          <TabsTrigger value="headers">Landing Headers</TabsTrigger>
          <TabsTrigger value="cms">CMS Blocks</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentTribe.icon className="w-5 h-5" />
                Meta Descriptions for {currentTribe.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTribe.metaDescriptions.map((desc, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">Option {index + 1}</Badge>
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={desc.length > 160 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                      >
                        {desc.length}/160
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(desc, "Meta Description")}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm">{desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taglines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentTribe.icon className="w-5 h-5" />
                Taglines for {currentTribe.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentTribe.taglines.map((tagline, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium text-amber-800">{tagline}</span>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(tagline, "Tagline")}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="headers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentTribe.icon className="w-5 h-5" />
                Landing Page Headers for {currentTribe.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentTribe.landingHeaders.map((header, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">H1 Option {index + 1}</Badge>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(header, "Landing Header")}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold text-blue-800">{header}</h2>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <currentTribe.icon className="w-5 h-5" />
                CMS Blocks for {currentTribe.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Section */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-amber-800">Hero Section</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${currentTribe.cmsBlocks.heroTitle}\n${currentTribe.cmsBlocks.heroSubtitle}`,
                        "Hero Section",
                      )
                    }
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <h1 className="text-2xl font-bold mb-2">{currentTribe.cmsBlocks.heroTitle}</h1>
                <p className="text-gray-600">{currentTribe.cmsBlocks.heroSubtitle}</p>
              </div>

              {/* Benefits Section */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-green-800">Benefits Section</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        `${currentTribe.cmsBlocks.benefitsTitle}\n${currentTribe.cmsBlocks.benefits.join("\n")}`,
                        "Benefits Section",
                      )
                    }
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold mb-3">{currentTribe.cmsBlocks.benefitsTitle}</h2>
                <ul className="space-y-2">
                  {currentTribe.cmsBlocks.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-purple-800 mb-1">Call to Action</h3>
                    <span className="text-lg font-bold text-purple-900">{currentTribe.cmsBlocks.cta}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentTribe.cmsBlocks.cta, "CTA")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Keywords */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">SEO Keywords</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentTribe.keywords.join(", "), "Keywords")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentTribe.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
