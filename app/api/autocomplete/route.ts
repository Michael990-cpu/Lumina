import { type NextRequest, NextResponse } from "next/server"

// Popular search suggestions based on common queries
const suggestions = [
  "What is artificial intelligence?",
  "How does climate change work?",
  "What are the benefits of renewable energy?",
  "How do vaccines work?",
  "What is quantum computing?",
  "How does blockchain technology work?",
  "What causes global warming?",
  "How do electric cars work?",
  "What is machine learning?",
  "How does the internet work?",
  "What is cryptocurrency?",
  "How do solar panels work?",
  "What is genetic engineering?",
  "How does 5G technology work?",
  "What is space exploration?",
  "How do robots work?",
  "What is biotechnology?",
  "How does nuclear energy work?",
  "What is nanotechnology?",
  "How does virtual reality work?",
  "What is the metaverse?",
  "How do satellites work?",
  "What is gene therapy?",
  "How does 3D printing work?",
  "What is sustainable development?",
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Filter suggestions based on query
    const filteredSuggestions = suggestions
      .filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(query) ||
          suggestion
            .toLowerCase()
            .split(" ")
            .some((word) => word.startsWith(query)),
      )
      .slice(0, 5) // Limit to 5 suggestions

    return NextResponse.json({ suggestions: filteredSuggestions })
  } catch (error) {
    console.error("Autocomplete API error:", error)
    return NextResponse.json({ suggestions: [] })
  }
}
