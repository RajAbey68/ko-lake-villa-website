"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Download, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Campaign {
  id: string
  tribe: string
  originalContent: string
  optimizedContent: string
  keywords: string[]
  tone: string
  platform: string
  generatedAt: string
}

export default function CampaignGenerator() {
  const [inputContent, setInputContent] = useState("")
  const [selectedTribe, setSelectedTribe] = useState("")
  const [selectedTone, setSelectedTone] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)

  const targetTribes = [
    {
      name: "Family Groups",
      keywords: [
        "family-friendly villa Sri Lanka",
        "private villa for families",
        "villa with pool for children",
        "group holiday villa South Coast",
      ],
      description: "Multi-room flexibility, safe pool, tranquil setting, short walk to beach",
    },
    {
      name: "Wellness & Yoga Retreats",
      keywords: [
        "yoga retreat Sri Lanka",
        "wellness villa Ahangama",
        "private villa for meditation",
        "retreat venue South Sri Lanka",
      ],
      description: "Rooftop garden for yoga, quiet lakeside energy, healthy food options",
    },
    {
      name: "Surf Travellers & Beach Lovers",
      keywords: [
        "surf stay Ahangama",
        "villa near Weligama surf",
        "Dickwella surf accommodation",
        "surf and stay Sri Lanka",
      ],
      description: "300 yards from 3 sand/surf beaches, easy access to surf breaks",
    },
    {
      name: "Digital Nomads & Remote Workers",
      keywords: ["Sri Lanka remote work villa", "digital nomad villa Sri Lanka", "fast WiFi villa South Coast"],
      description: "Fast 300Mbps WiFi, peaceful work environment, AC ensuite rooms",
    },
    {
      name: "Creative & Soulful Travellers",
      keywords: ["artistic retreat Sri Lanka", "writer's retreat South Sri Lanka", "nature retreat with lake view"],
      description: "Scenic inspiration by the lake, rooftop garden, flexible stays",
    },
    {
      name: "Small Celebration Groups",
      keywords: ["villa for birthdays Sri Lanka", "small event venue near Galle", "private group stays South Coast"],
      description: "Two large suites, 60-ft pool, chef service, ideal for celebrations",
    },
    {
      name: "Eco-Conscious & Nature-Loving Guests",
      keywords: ["eco villa Sri Lanka", "nature villa Ahangama", "mangrove villa with pool"],
      description: "Nestled among mangroves, low-impact living, wildlife access",
    },
  ]

  const tones = [
    "Professional & Informative",
    "Warm & Welcoming",
    "Adventurous & Exciting",
    "Peaceful & Serene",
    "Luxury & Sophisticated",
    "Fun & Playful",
  ]

  const platforms = [
    "Website Landing Page",
    "Email Marketing",
    "Social Media (Instagram)",
    "Social Media (Facebook)",
    "Google Ads",
    "Booking Platforms",
  ]

  const generateCampaign = async () => {
    if (!inputContent || !selectedTribe || !selectedTone || !selectedPlatform) {
      alert("Please fill in all fields")
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const tribe = targetTribes.find((t) => t.name === selectedTribe)
      const optimizedContent = generateOptimizedContent(inputContent, tribe!, selectedTone, selectedPlatform)

      const newCampaign: Campaign = {
        id: Date.now().toString(),
        tribe: selectedTribe,
        originalContent: inputContent,
        optimizedContent,
        keywords: tribe?.keywords || [],
        tone: selectedTone,
        platform: selectedPlatform,
        generatedAt: new Date().toISOString(),
      }

      setCampaigns((prev) => [newCampaign, ...prev])
      setActiveCampaign(newCampaign)
      setIsGenerating(false)
    }, 3000)
  }

  const generateOptimizedContent = (content: string, tribe: any, tone: string, platform: string) => {
    // This would be replaced with actual AI generation
    const tribeKeywords = tribe.keywords.slice(0, 3).join(", ")

    return `🌟 **Optimized for ${tribe.name}**

**${platform} Campaign Content:**

Discover your perfect escape at Ko Lake Villa - a luxury ${tribe.name.toLowerCase()} haven in Ahangama, Sri Lanka. 

${content.substring(0, 200)}... 

✨ **Perfect for ${tribe.name}:**
${tribe.description}

🏖️ **Why Choose Ko Lake Villa:**
• Just 300 yards from pristine beaches
• 60-foot infinity pool with lake views  
• Fast 300Mbps WiFi for remote work
• Chef service and local experiences
• Book direct and save 10%

**SEO Keywords:** ${tribeKeywords}

**Call to Action:** Book your ${tribe.name.toLowerCase()} getaway today and experience the magic of Ko Lake Villa!

#KoLakeVilla #SriLankaVilla #${tribe.name.replace(/\s+/g, "")} #AhangamaStay`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            AI Campaign Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Original Content (500 words max)</label>
            <Textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Paste your original content here (up to 500 words). The AI will optimize it for your selected target tribe..."
              rows={6}
              maxLength={3000}
            />
            <p className="text-xs text-gray-500 mt-1">{inputContent.length}/3000 characters</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Tribe</label>
              <Select value={selectedTribe} onValueChange={setSelectedTribe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target tribe" />
                </SelectTrigger>
                <SelectContent>
                  {targetTribes.map((tribe) => (
                    <SelectItem key={tribe.name} value={tribe.name}>
                      {tribe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tone</label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Platform</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateCampaign}
            disabled={isGenerating || !inputContent || !selectedTribe}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating Optimized Campaign..." : "Generate AI Campaign"}
          </Button>

          {isGenerating && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                AI is analyzing your content and optimizing it for <strong>{selectedTribe}</strong> with a{" "}
                <strong>{selectedTone.toLowerCase()}</strong> tone for <strong>{selectedPlatform}</strong>...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {activeCampaign && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Campaign</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={generateCampaign}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Badge className="bg-amber-100 text-amber-800">{activeCampaign.tribe}</Badge>
                <Badge variant="outline">{activeCampaign.tone}</Badge>
                <Badge variant="outline">{activeCampaign.platform}</Badge>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{activeCampaign.optimizedContent}</pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">SEO Keywords:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeCampaign.keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => setActiveCampaign(campaign)}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-amber-100 text-amber-800 text-xs">{campaign.tribe}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {campaign.platform}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Generated {new Date(campaign.generatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
