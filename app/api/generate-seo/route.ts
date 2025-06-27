import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: Request) {
  try {
    const { content, tribe, mediaType, title } = await request.json()

    const prompt = `You are an SEO expert for Ko Lake Villa, a luxury villa rental in Ahangama, Sri Lanka. 

Generate optimized SEO metadata for this ${mediaType}:
Title: ${title}
Content: ${content}
Target Tribe: ${tribe}

Villa Context:
- 4-bedroom luxury villa with 60-foot infinity pool
- Located in Ahangama, Sri Lanka, 300 yards from beaches
- Perfect for families, wellness retreats, surf travelers, digital nomads
- Features: fast WiFi, chef service, rooftop yoga deck, lake views

Generate:
1. SEO Title (max 60 characters)
2. Meta Description (max 160 characters) 
3. Alt Text for accessibility
4. 5 relevant keywords

Focus on the target tribe: ${tribe}`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    return Response.json({ optimizedSEO: text })
  } catch (error) {
    console.error("SEO generation error:", error)
    return Response.json({ error: "Failed to generate SEO" }, { status: 500 })
  }
}
