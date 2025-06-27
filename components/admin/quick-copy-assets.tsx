"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"

interface QuickAsset {
  type: string
  content: string
  tribe: string
  length?: number
}

export default function QuickCopyAssets() {
  const [copiedId, setCopiedId] = useState<string>("")

  const quickAssets: QuickAsset[] = [
    {
      type: "Meta Description",
      content:
        "Family-friendly Ko Lake Villa in Ahangama, Sri Lanka. 4-bedroom luxury villa with safe pool, beach access & chef service. Perfect for multi-generational holidays.",
      tribe: "Family Groups",
      length: 159,
    },
    {
      type: "Tagline",
      content: "Where Family Memories Are Made",
      tribe: "Family Groups",
    },
    {
      type: "Meta Description",
      content:
        "Wellness retreat at Ko Lake Villa, Ahangama. Rooftop yoga deck, tranquil lake views, healthy cuisine. Perfect private villa for meditation & mindfulness retreats.",
      tribe: "Wellness & Yoga Retreats",
      length: 158,
    },
    {
      type: "Tagline",
      content: "Reconnect. Restore. Revitalize.",
      tribe: "Wellness & Yoga Retreats",
    },
    {
      type: "Meta Description",
      content:
        "Surf stay Ko Lake Villa, Ahangama - 300 yards from 3 surf breaks. Luxury villa near Weligama & Dickwella waves. Chef meals, WiFi, perfect surf base.",
      tribe: "Surf Travellers & Beach Lovers",
      length: 152,
    },
    {
      type: "Tagline",
      content: "Surf by Day, Luxury by Night",
      tribe: "Surf Travellers & Beach Lovers",
    },
    {
      type: "Meta Description",
      content:
        "Digital nomad villa Sri Lanka | Ko Lake Villa Ahangama. Fast 300Mbps WiFi, AC rooms, peaceful work environment. Perfect remote work base near beaches.",
      tribe: "Digital Nomads & Remote Workers",
      length: 156,
    },
    {
      type: "Tagline",
      content: "Work from Paradise",
      tribe: "Digital Nomads & Remote Workers",
    },
  ]

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(""), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const getTribeColor = (tribe: string) => {
    const colors: Record<string, string> = {
      "Family Groups": "bg-blue-100 text-blue-800",
      "Wellness & Yoga Retreats": "bg-green-100 text-green-800",
      "Surf Travellers & Beach Lovers": "bg-cyan-100 text-cyan-800",
      "Digital Nomads & Remote Workers": "bg-purple-100 text-purple-800",
    }
    return colors[tribe] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Copy Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {quickAssets.map((asset, index) => {
            const assetId = `asset-${index}`
            const isCopied = copiedId === assetId

            return (
              <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {asset.type}
                    </Badge>
                    <Badge className={`text-xs ${getTribeColor(asset.tribe)}`}>{asset.tribe}</Badge>
                    {asset.length && (
                      <Badge
                        variant="secondary"
                        className={`text-xs ${asset.length > 160 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {asset.length}/160
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(asset.content, assetId)}
                    className={isCopied ? "bg-green-50 border-green-200" : ""}
                  >
                    {isCopied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-700">{asset.content}</p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
