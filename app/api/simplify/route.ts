import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { summary, query, style = "eli5" } = await request.json()

    if (!summary) {
      return NextResponse.json({ error: "Summary is required" }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      // Provide a basic simplification without AI
      const simplified = summary
        .replace(/\b(utilize|implement|facilitate)\b/g, "use")
        .replace(/\b(approximately|approximately)\b/g, "about")
        .replace(/\b(subsequently|consequently)\b/g, "then")
        .replace(/\b(demonstrate|illustrate)\b/g, "show")

      return NextResponse.json({
        simplified: `⚠️ Basic simplification (OpenAI API key needed for full ELI5):\n\n${simplified}`,
      })
    }

    const { text: simplified } = await generateText({
      model: openai("gpt-4o-mini", { apiKey: OPENAI_API_KEY }),
      system: `You are an expert at explaining complex topics in simple terms. Your task is to rewrite content for easy understanding.

Instructions for ELI5 (Explain Like I'm 5):
1. Use simple, everyday words that a child would understand
2. Replace technical terms with common words
3. Use analogies and comparisons to familiar things (toys, animals, everyday objects)
4. Keep sentences short and clear (under 15 words each)
5. Maintain all the citation numbers [1], [2], etc. exactly as they appear
6. Make it engaging and fun to read
7. Use "imagine" or "think of it like" for analogies
8. Avoid jargon completely
9. Break complex ideas into simple steps
10. Keep the same factual information, just make it super simple`,

      prompt: `Original question: ${query}

Complex summary to simplify:
${summary}

Please rewrite this as if explaining to a 5-year-old child. Keep all the citation numbers [1], [2], etc. but make everything else super simple and fun to understand. Use analogies to things kids know about.`,
    })

    return NextResponse.json({ simplified })
  } catch (error) {
    console.error("Simplify API error:", error)
    return NextResponse.json({ error: "Failed to simplify content" }, { status: 500 })
  }
}
