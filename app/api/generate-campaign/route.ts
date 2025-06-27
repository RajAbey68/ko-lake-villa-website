import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { content, tribe, tone, platform } = await request.json()

    const tribeData = {
      "Family Groups": {
        keywords: ["family-friendly villa Sri Lanka", "private villa for families", "villa with pool for children"],
        focus: "Multi-room flexibility, safe pool, tranquil setting, short walk to beach",
      },
      "Wellness & Yoga Retreats": {
        keywords: ["yoga retreat Sri Lanka", "wellness villa Ahangama", "private villa for meditation"],
        focus: "Rooftop garden for yoga, quiet lakeside energy, healthy food options",
      },
      "Surf Travellers & Beach Lovers": {
        keywords: ["surf stay Ahangama", "villa near Weligama surf", "Dickwella surf accommodation"],
        focus: "300 yards from 3 sand/surf beaches, easy access to surf breaks",
      },
      "Digital Nomads & Remote Workers": {
        keywords: ["Sri Lanka remote work villa", "digital nomad villa Sri Lanka", "fast WiFi villa South Coast"],
        focus: "Fast 300Mbps WiFi, peaceful work environment, AC ensuite rooms",
      },
    }

    const selectedTribe = tribeData[tribe as keyof typeof tribeData] || tribeData["Family Groups"]

    const prompt = `You are a marketing expert for Ko Lake Villa, a luxury villa in Ahangama, Sri Lanka.

Transform this content for ${platform} targeting ${tribe} with a ${tone} tone:

Original Content: ${content}

Target Tribe Details:
- Focus: ${selectedTribe.focus}
- Keywords: ${selectedTribe.keywords.join(", ")}

Villa Key Features:
- 4-bedroom luxury villa with 60-foot infinity pool
- Located 300 yards from pristine beaches
- Fast 300Mbps WiFi perfect for remote work
- Chef service and local experiences available
- Rooftop yoga deck with lake views

Requirements:
1. Optimize for ${platform} format and best practices
2. Use ${tone} tone throughout
3. Include relevant keywords naturally
4. Add compelling call-to-action
5. Highlight features most relevant to ${tribe}
6. Keep it engaging and conversion-focused

Generate optimized campaign content:`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return Response.json({
      optimizedContent: text,
      keywords: selectedTribe.keywords,
      tribe,
      tone,
      platform,
    })
  } catch (error) {
    console.error("Campaign generation error:", error)
    return Response.json({ error: "Failed to generate campaign" }, { status: 500 })
  }
}
