import { GoogleGenerativeAI } from "@google/generative-ai"
import type { NextRequest } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 300

interface MetadataResult {
  filename: string
  title: string
  category: string
  tags: string[]
  success: boolean
  error?: string
}

async function encodeImageToBase64(file: File): Promise<string | null> {
  try {
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    return base64
  } catch (error) {
    console.error("Error encoding image:", error)
    return null
  }
}

async function captionImage(
  genAI: GoogleGenerativeAI,
  file: File,
  constraints: {
    platform: string
    titleMin: number
    titleMax: number
    keywordMin: number
    keywordMax: number
  },
): Promise<{ title: string; category: string; tags: string[] } | null> {
  try {
    const base64Image = await encodeImageToBase64(file)
    if (!base64Image) return null

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `You are an expert at creating stock photography metadata for ${constraints.platform}. Analyze this image and create an SEO-optimized title, category, and tags.

TITLE REQUIREMENTS:
- Length: ${constraints.titleMin}-${constraints.titleMax} characters
- Descriptive, specific, and keyword-rich
- Natural language, not just keywords
- Include key visual elements, colors, concepts
- NO special characters except hyphens and spaces

CATEGORY:
- Choose ONE category from Adobe Stock's main categories: Animals, Buildings and Architecture, Business, Drinks, The Environment, States of Mind, Food, Graphic Resources, Hobbies and Leisure, Industry, Landscapes, Lifestyle, People, Plants and Flowers, Culture and Religion, Science, Social Issues, Sports, Technology, Transport, Travel

TAGS:
- Count: ${constraints.keywordMin}-${constraints.keywordMax} keywords
- Mix of specific and broad terms
- Include: main subject, colors, composition, mood, style, industry/use case
- Prioritize searchable terms over obscure descriptions

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "title": "string",
  "category": "string",
  "tags": ["string"]
}`

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: file.type,
          data: base64Image,
        },
      },
      { text: prompt },
    ])

    const response = result.response.text()
    const cleanedResponse = response
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim()
    const parsed = JSON.parse(cleanedResponse)

    return {
      title: parsed.title || "",
      category: parsed.category || "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    }
  } catch (error) {
    console.error("Error captioning image:", error)
    throw error // Re-throw to be handled by caller
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const formData = await request.formData()
        const files = formData.getAll("files") as File[]
        const apiKey = formData.get("apiKey") as string
        const maxWorkers = Number.parseInt(formData.get("maxWorkers") as string) || 5
        const batchSize = Number.parseInt(formData.get("batchSize") as string) || 100

        const platform = (formData.get("platform") as string) || "adobe"
        const titleMin = Number.parseInt(formData.get("titleMin") as string) || 70
        const titleMax = Number.parseInt(formData.get("titleMax") as string) || 200
        const keywordMin = Number.parseInt(formData.get("keywordMin") as string) || 25
        const keywordMax = Number.parseInt(formData.get("keywordMax") as string) || 49

        const constraints = {
          platform,
          titleMin,
          titleMax,
          keywordMin,
          keywordMax,
        }

        if (!apiKey) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "log", message: "API key is required", level: "error" })}\n\n`,
            ),
          )
          controller.close()
          return
        }

        const genAI = new GoogleGenerativeAI(apiKey)
        const results: MetadataResult[] = []
        const stats = {
          totalProcessed: 0,
          optimalTitles: 0,
          shortTitles: 0,
          failed: 0,
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "log", message: `Starting processing of ${files.length} images for ${platform}...`, level: "info" })}\n\n`,
          ),
        )

        // Process images in batches with concurrency control
        for (let i = 0; i < files.length; i += Math.min(maxWorkers, batchSize)) {
          const batch = files.slice(i, i + Math.min(maxWorkers, batchSize))
          const batchPromises = batch.map(async (file) => {
            try {
              const metadata = await captionImage(genAI, file, constraints)

              if (metadata) {
                const titleLength = metadata.title.length
                const isOptimal = titleLength >= constraints.titleMin

                stats.totalProcessed++
                if (isOptimal) {
                  stats.optimalTitles++
                } else {
                  stats.shortTitles++
                }

                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({
                      type: "log",
                      message: `✓ Processed: ${file.name} (${titleLength} chars)`,
                      level: "success",
                    })}\n\n`,
                  ),
                )

                return {
                  filename: file.name,
                  title: metadata.title,
                  category: metadata.category,
                  tags: metadata.tags,
                  success: true,
                }
              } else {
                // Should not happen if captionImage throws on error, but keeping as fallback
                throw new Error("No metadata returned")
              }
            } catch (error: any) {
              stats.failed++
              stats.totalProcessed++

              let errorMessage = error instanceof Error ? error.message : "Unknown error"

              // Check for rate limit errors
              if (errorMessage.includes("429") || errorMessage.includes("Quota exceeded")) {
                errorMessage = "Quota exceeded (429). Please wait a moment or check your API plan."
              }

              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "log",
                    message: `✗ Error: ${file.name} - ${errorMessage}`,
                    level: "error",
                  })}\n\n`,
                ),
              )

              return {
                filename: file.name,
                title: "",
                category: "",
                tags: [],
                success: false,
                error: errorMessage,
              }
            }
          })

          const batchResults = await Promise.all(batchPromises)
          results.push(...batchResults)

          const progress = ((i + batch.length) / files.length) * 100

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "progress",
                progress,
                stats,
              })}\n\n`,
            ),
          )
        }

        // Generate CSV based on platform
        let csvContent = ""
        if (platform === "freepik") {
          csvContent = "File name;Title;Keywords\n"
          csvContent += results
            .map((r) => {
              // Freepik uses semicolons for columns and commas for keywords
              // Guide example shows all fields quoted: "filename";"title";"keywords"
              const tags = r.tags.join(",")
              return `"${r.filename}";"${r.title.replace(/"/g, '""')}";"${tags}"`
            })
            .join("\n")
        } else if (platform === "shutterstock") {
          csvContent = "Filename,Description,Keywords,Categories\n"
          csvContent += results
            .map((r) => {
              const tags = r.tags.join(",")
              return `${r.filename},"${r.title.replace(/"/g, '""')}","${tags}","${r.category}"`
            })
            .join("\n")
        } else {
          // Default (Adobe Stock)
          csvContent = "Filename,Title,Category,Tags\n"
          csvContent += results
            .map((r) => {
              const tags = r.tags.join(", ")
              return `${r.filename},"${r.title.replace(/"/g, '""')}","${r.category}","${tags}"`
            })
            .join("\n")
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              csvData: csvContent,
              stats,
            })}\n\n`,
          ),
        )

        controller.close()
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "log",
              message: `Fatal error: ${error instanceof Error ? error.message : "Unknown error"}`,
              level: "error",
            })}\n\n`,
          ),
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
