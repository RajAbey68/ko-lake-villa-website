"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Download, RefreshCw, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function GuestyIntegration() {
  const [selectedTribe, setSelectedTribe] = useState("")
  const [guestyContent, setGuestyContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const guestyTemplates = {
    "Family Groups": {
      title: "Ko Lake Villa - Perfect Family Getaway in Ahangama",
      description: `🏖️ FAMILY-FRIENDLY LUXURY VILLA IN AHANGAMA, SRI LANKA

✨ Perfect for Multi-Generational Holidays
• 4 spacious bedrooms with flexible sleeping arrangements
• Cribs and extra beds available for children
• Safe 60-foot infinity pool perfect for kids
• Just 300 yards from family-friendly beaches
• Professional chef service for stress-free meals

🏡 Villa Features:
• Private lakeside setting away from crowds
• Open-air living spaces with stunning views
• Fast WiFi for staying connected
• Air-conditioned ensuite bedrooms
• Rooftop garden and outdoor dining areas

🌊 Location Benefits:
• Walking distance to 3 beautiful beaches
• Easy access to Ahangama village
• Close to family attractions and restaurants
• Safe, tranquil neighborhood

👨‍👩‍👧‍👦 Why Families Love Ko Lake Villa:
"The perfect blend of luxury and safety for our family vacation. The kids loved the pool, and we loved the peace of mind!" - Recent Guest

📞 Book Direct & Save 10%
Contact us for family-friendly rates and special arrangements.`,
      tags: ["family-friendly", "safe-pool", "beach-access", "chef-service", "multi-generational"],
    },
    "Wellness & Yoga Retreats": {
      title: "Ko Lake Villa - Wellness Sanctuary & Yoga Retreat Venue",
      description: `🧘‍♀️ WELLNESS RETREAT SANCTUARY IN AHANGAMA

✨ Your Private Yoga & Meditation Haven
• Dedicated rooftop yoga deck with lake views
• Tranquil lakeside setting for deep relaxation
• Healthy, organic meal options with chef service
• Open-air spaces perfect for mindful living
• Peaceful environment away from distractions

🌿 Wellness Features:
• Morning meditation spots by the lake
• Sunset yoga sessions on the rooftop
• Healthy cuisine with local organic ingredients
• Spa-like bathrooms for rejuvenation
• Natural ventilation and tropical breezes

🏞️ Natural Setting:
• Surrounded by mangroves and coconut palms
• Birdwatching and nature connection opportunities
• Serene lake views from every room
• Private, secluded location

🧘‍♂️ Perfect for:
• Individual wellness retreats
• Small group yoga sessions
• Meditation intensives
• Digital detox experiences
• Mindfulness workshops

"The most peaceful place I've ever stayed. Perfect for reconnecting with myself." - Wellness Guest

📞 Book Your Transformation
Special rates for wellness retreats and extended stays.`,
      tags: ["yoga-retreat", "wellness", "meditation", "organic-food", "peaceful"],
    },
  }

  const generateGuestyContent = () => {
    if (!selectedTribe) return

    setIsGenerating(true)

    setTimeout(() => {
      const template = guestyTemplates[selectedTribe as keyof typeof guestyTemplates]
      if (template) {
        setGuestyContent(template.description)
      }
      setIsGenerating(false)
    }, 1500)
  }

  const exportForGuesty = () => {
    const template = guestyTemplates[selectedTribe as keyof typeof guestyTemplates]
    if (!template) return

    const exportData = {
      listingTitle: template.title,
      description: guestyContent || template.description,
      tags: template.tags,
      tribe: selectedTribe,
      generatedAt: new Date().toISOString(),
      instructions: {
        title: "Copy the listing title to your Guesty property title field",
        description: "Copy the description to your Guesty property description field",
        tags: "Add these tags to your Guesty property tags/amenities",
        seo: "Use the title and first paragraph for SEO meta description",
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `guesty-listing-${selectedTribe.toLowerCase().replace(/\s+/g, "-")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Guesty Listing Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Tribe</label>
              <Select value={selectedTribe} onValueChange={setSelectedTribe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target tribe for Guesty listing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Family Groups">Family Groups</SelectItem>
                  <SelectItem value="Wellness & Yoga Retreats">Wellness & Yoga Retreats</SelectItem>
                  <SelectItem value="Surf Travellers & Beach Lovers">Surf Travellers & Beach Lovers</SelectItem>
                  <SelectItem value="Digital Nomads & Remote Workers">Digital Nomads & Remote Workers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateGuestyContent}
                disabled={!selectedTribe || isGenerating}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Generating..." : "Generate Listing"}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Generating optimized Guesty listing content for <strong>{selectedTribe}</strong>...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {guestyContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Guesty Listing</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(guestyContent)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Copy Description
                </Button>
                <Button variant="outline" size="sm" onClick={exportForGuesty}>
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Listing Title</label>
              <div className="p-3 bg-gray-50 rounded border">
                <p className="font-medium">
                  {selectedTribe && guestyTemplates[selectedTribe as keyof typeof guestyTemplates]?.title}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={guestyContent}
                onChange={(e) => setGuestyContent(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">{guestyContent.length} characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Recommended Tags</label>
              <div className="flex flex-wrap gap-2">
                {selectedTribe &&
                  guestyTemplates[selectedTribe as keyof typeof guestyTemplates]?.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>

            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                <strong>Guesty Integration Steps:</strong>
                <br />
                1. Copy the listing title to your Guesty property title
                <br />
                2. Copy the description to your Guesty property description
                <br />
                3. Add the recommended tags to your property amenities
                <br />
                4. Use the first paragraph as your SEO meta description
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
