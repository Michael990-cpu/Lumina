import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        description:
          "⚠️ Image analysis unavailable - OpenAI API key not configured. Please describe what you see in the image as a text query instead.",
      })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = image.type

    const { text: description } = await generateText({
      model: openai("gpt-4o-mini", { apiKey: OPENAI_API_KEY }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image and generate a detailed search query that would help find information about what's shown. Focus on the main subject, context, and any notable details that would be useful for research.",
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${base64}`,
            },
          ],
        },
      ],
    })

    return NextResponse.json({ description })
  } catch (error) {
    console.error("Image search API error:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
