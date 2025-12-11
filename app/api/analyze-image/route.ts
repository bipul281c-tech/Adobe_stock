import { generateObject } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"

const metadataSchema = z.object({
  title: z.string().describe("SEO-optimized title using all 200 characters"),
  category: z.string().describe("One Adobe Stock category"),
  tags: z.array(z.string()).describe("49 single-word keywords in lowercase"),
})

// Universal Stock Photo Prompt - Compatible with Adobe Stock & Shutterstock
const STOCK_PHOTO_PROMPT = `You are an expert at creating stock photo metadata that maximizes discoverability and sales on major platforms like Adobe Stock and Shutterstock. Analyze this image and create SEO-optimized metadata.

CRITICAL TITLE/DESCRIPTION REQUIREMENTS:
1. USE ALL 200 CHARACTERS (195-200 chars) - This is essential for SEO on both platforms
2. Structure: [Primary Subject] [Action/Context] [Setting/Environment] [Conceptual Use] [Style/Details]
3. Write as a natural, flowing description that reads like a sentence, NOT a keyword list
4. This will be used as:
   - "Title" on Adobe Stock
   - "Description" on Shutterstock
5. Include 20-30 searchable terms naturally integrated
6. Think from buyer's perspective - what would they search for?
7. Balance literal description with conceptual keywords (mood, purpose, industry application)
8. Include:
   - Primary subject and its characteristics
   - Action or state (if applicable)
   - Setting/environment/location details
   - Industry applications (business, healthcare, education, technology, lifestyle)
   - Emotional context (professional, relaxed, innovative, modern, traditional)
   - Usage scenarios (presentation, marketing, website, documentation, advertising)
   - Visual style details (colors, composition, lighting)
   - Target demographics when relevant
9. Order elements by importance for search
10. Use specific terminology over generic words
11. Include variations and synonyms of main concepts
12. Consider seasonal relevance if applicable
13. NO brand names, trademarks, or "AI-generated" references
14. Don't describe elements that aren't prominent
15. Ensure it reads naturally to humans while being SEO-rich

CATEGORY - Choose ONE (these will be auto-mapped to Shutterstock categories):
Animals, Buildings and Architecture, Business, Drinks, The Environment, States of Mind, Food, Graphic Resources, Hobbies and Leisure, Industry, Landscape, Lifestyle, People, Plants and Flowers, Culture and Religion, Science, Social Issues, Sports, Technology, Transport, Travel

TAGS/KEYWORDS REQUIREMENTS (Compatible with both platforms):
- Generate EXACTLY 49 single-word keywords in lowercase
- These work as "Keywords" on both Adobe Stock and Shutterstock
- Order by importance (most relevant first)
- Include variations of main concepts
- Mix specific and broad terms
- Include conceptual terms (emotions, uses, industries)
- NO brand names or real people names
- Think about what buyers would search for
- Include industry-specific terms
- Add mood and style descriptors
- Consider multiple use cases
- Avoid special characters - use only alphanumeric and hyphens`

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("image") as File
    const apiKey = formData.get("apiKey") as string
    const provider = (formData.get("provider") as string) || "gemini"
    const keywordsCount = Number.parseInt(formData.get("keywordsCount") as string) || 49

    if (!file) {
      return Response.json({ error: "No image provided" }, { status: 400 })
    }

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 400 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type || "image/jpeg"

    // Validate image format
    const isValidFormat = mimeType === "image/jpeg" || mimeType === "image/png"
    if (!isValidFormat) {
      return Response.json({ error: "Only JPEG and PNG images are supported" }, { status: 400 })
    }

    // Create Gemini model
    const google = createGoogleGenerativeAI({ apiKey })
    const model = google("gemini-2.0-flash")

    const { object } = await generateObject({
      model,
      schema: metadataSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
            {
              type: "text",
              text: STOCK_PHOTO_PROMPT,
            },
          ],
        },
      ],
    })

    // Post-process the response
    let title = object.title.trim()
    if (title.length > 200) {
      title = title.slice(0, 200)
    }

    let tags = object.tags.map((tag: string) => tag.toLowerCase().trim())
    if (tags.length < keywordsCount) {
      while (tags.length < keywordsCount) {
        tags.push("stock")
      }
    } else if (tags.length > keywordsCount) {
      tags = tags.slice(0, keywordsCount)
    }

    return Response.json({
      title,
      category: object.category.trim(),
      keywords: tags,
      titleLength: title.length,
    })
  } catch (error) {
    console.error("Error analyzing image:", error)
    const message = error instanceof Error ? error.message : "Failed to analyze image"
    return Response.json({ error: message }, { status: 500 })
  }
}
