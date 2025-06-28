import { type NextRequest, NextResponse } from "next/server"

// Enhanced suggestion database with categories
const suggestions = {
  technology: [
    "What is artificial intelligence?",
    "How does machine learning work?",
    "What is quantum computing?",
    "How do neural networks function?",
    "What is blockchain technology?",
    "How does 5G technology work?",
    "What is virtual reality?",
    "How do electric cars work?",
    "What is the Internet of Things?",
    "How does cloud computing work?",
  ],
  science: [
    "How does climate change work?",
    "What causes global warming?",
    "How do vaccines work?",
    "What is genetic engineering?",
    "How does photosynthesis work?",
    "What is CRISPR gene editing?",
    "How do antibiotics work?",
    "What causes earthquakes?",
    "How does the immune system work?",
    "What is dark matter?",
  ],
  health: [
    "How does exercise benefit health?",
    "What is a balanced diet?",
    "How does sleep affect health?",
    "What causes stress?",
    "How does meditation work?",
    "What is mental health?",
    "How do vitamins work?",
    "What causes allergies?",
    "How does the brain work?",
    "What is diabetes?",
  ],
  environment: [
    "What are renewable energy sources?",
    "How do solar panels work?",
    "What is sustainable development?",
    "How does recycling help environment?",
    "What causes pollution?",
    "How do wind turbines work?",
    "What is carbon footprint?",
    "How does deforestation affect climate?",
    "What is biodiversity?",
    "How do electric vehicles help environment?",
  ],
  space: [
    "How do rockets work?",
    "What is the Big Bang theory?",
    "How do satellites work?",
    "What are black holes?",
    "How does the solar system work?",
    "What is space exploration?",
    "How do astronauts live in space?",
    "What is the International Space Station?",
    "How do telescopes work?",
    "What is Mars exploration?",
  ],
}

const allSuggestions = Object.values(suggestions).flat()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase() || ""

    if (!query || query.length < 2) {
      // Return popular suggestions when no query
      return NextResponse.json({
        suggestions: allSuggestions.slice(0, 5),
        category: "popular",
      })
    }

    // Smart matching algorithm
    const matches = allSuggestions.filter((suggestion) => {
      const suggestionLower = suggestion.toLowerCase()
      const queryWords = query.split(" ")

      // Exact phrase match (highest priority)
      if (suggestionLower.includes(query)) return true

      // Word-by-word match
      return queryWords.some((word) => {
        if (word.length < 2) return false
        return suggestionLower.includes(word)
      })
    })

    // Sort by relevance
    const sortedMatches = matches
      .sort((a, b) => {
        const aLower = a.toLowerCase()
        const bLower = b.toLowerCase()

        // Prioritize exact matches
        if (aLower.includes(query) && !bLower.includes(query)) return -1
        if (!aLower.includes(query) && bLower.includes(query)) return 1

        // Prioritize matches at the beginning
        const aIndex = aLower.indexOf(query)
        const bIndex = bLower.indexOf(query)
        if (aIndex !== bIndex) return aIndex - bIndex

        // Prioritize shorter suggestions
        return a.length - b.length
      })
      .slice(0, 6)

    // Determine category
    let category = "general"
    for (const [cat, catSuggestions] of Object.entries(suggestions)) {
      if (catSuggestions.some((s) => sortedMatches.includes(s))) {
        category = cat
        break
      }
    }

    return NextResponse.json({
      suggestions: sortedMatches,
      category,
      query,
    })
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({
      suggestions: [],
      category: "error",
    })
  }
}
