import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  try {
    const { summary, query, language = "en" } = await request.json()

    if (!summary) {
      return NextResponse.json({ error: "Summary is required" }, { status: 400 })
    }

    if (!OPENAI_API_KEY) {
      // Basic simplification without AI
      const simplified = summary
        .replace(/\b(utilize|implement|facilitate)\b/gi, "use")
        .replace(/\b(approximately)\b/gi, "about")
        .replace(/\b(subsequently|consequently)\b/gi, "then")
        .replace(/\b(demonstrate|illustrate)\b/gi, "show")
        .replace(/\b(comprehensive|extensive)\b/gi, "complete")

      return NextResponse.json({
        explanation: `⚠️ Basic simplification (OpenAI API needed for full ELI5):\n\n${simplified}`,
      })
    }

    const { text: explanation } = await generateText({
      model: openai("gpt-4o-mini", { apiKey: OPENAI_API_KEY }),
      system: `You are an expert at explaining complex topics to children. Your task is to make content understandable for a 5-year-old.

Language: ${language}

Instructions for ELI5:
1. Use simple, everyday words that a child would understand
2. Replace technical terms with common words
3. Use analogies to familiar things (toys, animals, food, family)
4. Keep sentences short and simple (under 12 words)
5. Maintain all citation numbers [1], [2], [3] exactly as they appear
6. Make it fun and engaging
7. Use "imagine" or "think of it like" for comparisons
8. Avoid all jargon and complex concepts
9. Break down ideas into simple steps
10. Keep the same facts, just make them super simple`,

      prompt: `Original question: ${query}

Complex summary to explain like I'm 5:
${summary}

Please rewrite this as if explaining to a 5-year-old child. Keep all citation numbers [1], [2], [3] but make everything else super simple and fun. Use analogies to things kids know about.`,
    })

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error("ELI5 API error:", error)
    return NextResponse.json({ error: "Failed to create ELI5 explanation" }, { status: 500 })
  }
}
