import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Enhanced mock search results with more realistic data
const mockSearchResults = [
  {
    title: "Understanding Quantum Computing - MIT Technology Review",
    url: "https://www.technologyreview.com/quantum-computing",
    snippet:
      "Quantum computing harnesses quantum mechanical phenomena to process information in fundamentally different ways than classical computers. Recent breakthroughs show promise for solving complex problems.",
    credibilityScore: 92,
    sentiment: "positive" as const,
    publishDate: "2024-01-15",
  },
  {
    title: "Quantum Computing Explained - IBM Research",
    url: "https://www.ibm.com/quantum-computing",
    snippet:
      "Quantum computers use quantum bits or qubits that can exist in multiple states simultaneously, enabling parallel processing capabilities that could revolutionize computing.",
    credibilityScore: 95,
    sentiment: "neutral" as const,
    publishDate: "2024-02-03",
  },
  {
    title: "The Future of Quantum Computing - Nature",
    url: "https://www.nature.com/articles/quantum-future",
    snippet:
      "Recent advances in quantum error correction and qubit stability are bringing practical quantum computing closer to reality, with potential applications in cryptography and drug discovery.",
    credibilityScore: 98,
    sentiment: "positive" as const,
    publishDate: "2024-01-28",
  },
  {
    title: "Quantum vs Classical Computing - Scientific American",
    url: "https://www.scientificamerican.com/quantum-vs-classical",
    snippet:
      "While classical computers process information sequentially, quantum computers can explore multiple solutions simultaneously, offering exponential speedup for certain problems.",
    credibilityScore: 89,
    sentiment: "neutral" as const,
    publishDate: "2024-02-10",
  },
  {
    title: "Quantum Computing Challenges - Harvard Business Review",
    url: "https://hbr.org/quantum-challenges",
    snippet:
      "Despite promising developments, quantum computing faces significant challenges including error rates, scalability issues, and the need for extremely low temperatures to maintain quantum states.",
    credibilityScore: 85,
    sentiment: "negative" as const,
    publishDate: "2024-01-20",
  },
]

async function searchWeb(query: string) {
  // Simulate contextual results based on query
  return mockSearchResults.map((result) => ({
    ...result,
    snippet: result.snippet.replace(/quantum computing/gi, query.toLowerCase()),
    title: result.title.replace(/Quantum Computing/gi, query),
  }))
}

function generateFollowUpQuestions(query: string): string[] {
  const questions = [
    `What are the practical applications of ${query}?`,
    `What are the main challenges facing ${query}?`,
    `How does ${query} compare to traditional alternatives?`,
    `What is the future outlook for ${query}?`,
    `Who are the leading researchers in ${query}?`,
  ]
  return questions.slice(0, 3)
}

function generateRelatedTopics(query: string): string[] {
  const topics = [
    "machine learning",
    "artificial intelligence",
    "blockchain technology",
    "renewable energy",
    "space exploration",
    "biotechnology",
    "nanotechnology",
    "robotics",
  ]
  return topics.filter((topic) => !query.toLowerCase().includes(topic)).slice(0, 4)
}

export async function POST(request: NextRequest) {
  try {
    const { query, language = "en", style = "balanced" } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Step 1: Search for results
    const searchResults = await searchWeb(query)

    // If no API key, provide enhanced fallback
    if (!OPENAI_API_KEY) {
      const fallbackSummary =
        `Based on the available sources, here's what we found about ${query}:\n\n` +
        searchResults
          .slice(0, 3)
          .map((result, index) => `${result.snippet} [${index + 1}]`)
          .join(" ") +
        "\n\n⚠️ This is a basic summary. Enable OpenAI integration for enhanced AI analysis."

      return NextResponse.json({
        summary: fallbackSummary,
        sources: searchResults,
        confidence: 75,
        bias: "neutral",
        followUpQuestions: generateFollowUpQuestions(query),
        relatedTopics: generateRelatedTopics(query),
        factCheck: {
          verified: true,
          concerns: ["Limited AI analysis without OpenAI API key"],
        },
      })
    }

    // Step 2: Prepare content for LLM
    const combinedContent = searchResults
      .map(
        (result, index) =>
          `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.url}\nCredibility: ${result.credibilityScore}%\nSentiment: ${result.sentiment}\nPublished: ${result.publishDate}`,
      )
      .join("\n\n")

    // Step 3: Generate enhanced summary with AI SDK
    const { text: summary } = await generateText({
      model: openai("gpt-4o-mini", { apiKey: OPENAI_API_KEY }),
      system: `You are an expert research assistant. Analyze search results and provide comprehensive summaries.

Style Guidelines:
- ${style === "academic" ? "Use formal, scholarly language with precise terminology" : ""}
- ${style === "casual" ? "Use conversational, easy-to-understand language" : ""}
- ${style === "technical" ? "Include technical details and specifications" : ""}
- ${style === "creative" ? "Use engaging, creative language with analogies" : ""}
- ${style === "balanced" ? "Balance accessibility with accuracy" : ""}

Instructions:
1. Write a comprehensive 4-6 sentence summary that directly answers the user's question
2. ALWAYS use inline citations like [1], [2], [3] to reference specific sources
3. Include at least 3-4 citations distributed throughout the summary
4. Be factual and objective, noting any conflicting information
5. If sources have credibility concerns, mention this
6. Focus on the most important and relevant information
7. End with a confidence assessment of your summary`,

      prompt: `User Question: ${query}
Language: ${language}
Style: ${style}

Search Results:
${combinedContent}

Provide a comprehensive summary with proper inline citations [1], [2], etc. Make sure to cite specific sources for specific claims.`,
    })

    // Generate confidence score based on source quality
    const avgCredibility =
      searchResults.reduce((sum, source) => sum + (source.credibilityScore || 0), 0) / searchResults.length
    const confidence = Math.round(avgCredibility * 0.9) // Slightly lower than source average

    // Detect potential bias
    const sentiments = searchResults.map((s) => s.sentiment)
    const positiveCount = sentiments.filter((s) => s === "positive").length
    const negativeCount = sentiments.filter((s) => s === "negative").length
    let bias = "neutral"
    if (positiveCount > negativeCount + 1) bias = "slightly positive"
    if (negativeCount > positiveCount + 1) bias = "slightly negative"

    // Fact check
    const lowCredibilitySources = searchResults.filter((s) => (s.credibilityScore || 0) < 70)
    const factCheck = {
      verified: lowCredibilitySources.length === 0,
      concerns:
        lowCredibilitySources.length > 0
          ? [`${lowCredibilitySources.length} sources have credibility scores below 70%`]
          : [],
    }

    return NextResponse.json({
      summary,
      sources: searchResults,
      confidence,
      bias,
      followUpQuestions: generateFollowUpQuestions(query),
      relatedTopics: generateRelatedTopics(query),
      factCheck,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Failed to search and summarize" }, { status: 500 })
  }
}
