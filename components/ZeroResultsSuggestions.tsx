"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Lightbulb, TrendingUp, RefreshCw, Sparkles } from "lucide-react"

interface ZeroResultsSuggestionsProps {
  originalQuery: string
  onSuggestedSearch: (query: string) => void
  onRetry: () => void
}

export function ZeroResultsSuggestions({ originalQuery, onSuggestedSearch, onRetry }: ZeroResultsSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    spelling: string[]
    related: string[]
    broader: string[]
    trending: string[]
  }>({
    spelling: [],
    related: [],
    broader: [],
    trending: [],
  })

  useEffect(() => {
    generateSuggestions(originalQuery)
  }, [originalQuery])

  const generateSuggestions = (query: string) => {
    // Spelling corrections (simple implementation)
    const spellingCorrections = generateSpellingCorrections(query)

    // Related queries based on keywords
    const relatedQueries = generateRelatedQueries(query)

    // Broader search terms
    const broaderTerms = generateBroaderTerms(query)

    // Trending alternatives
    const trendingAlternatives = [
      "What is artificial intelligence?",
      "How does climate change work?",
      "Benefits of renewable energy",
      "Latest technology trends",
      "Space exploration updates",
      "Machine learning basics",
    ]

    setSuggestions({
      spelling: spellingCorrections,
      related: relatedQueries,
      broader: broaderTerms,
      trending: trendingAlternatives,
    })
  }

  const generateSpellingCorrections = (query: string): string[] => {
    const commonMisspellings: { [key: string]: string } = {
      artifical: "artificial",
      inteligence: "intelligence",
      machien: "machine",
      learing: "learning",
      quantom: "quantum",
      computor: "computer",
      enviroment: "environment",
      tecnology: "technology",
      reserch: "research",
      develope: "develop",
    }

    const words = query.toLowerCase().split(" ")
    const corrections: string[] = []

    words.forEach((word) => {
      if (commonMisspellings[word]) {
        const correctedQuery = query.replace(new RegExp(word, "gi"), commonMisspellings[word])
        if (correctedQuery !== query) {
          corrections.push(correctedQuery)
        }
      }
    })

    // Add some phonetic suggestions
    const phoneticSuggestions = generatePhoneticSuggestions(query)
    corrections.push(...phoneticSuggestions)

    return [...new Set(corrections)].slice(0, 3)
  }

  const generatePhoneticSuggestions = (query: string): string[] => {
    const phoneticReplacements: { [key: string]: string[] } = {
      ph: ["f"],
      f: ["ph"],
      c: ["k", "s"],
      k: ["c"],
      s: ["c", "z"],
      z: ["s"],
      i: ["y"],
      y: ["i"],
    }

    const suggestions: string[] = []
    const words = query.split(" ")

    words.forEach((word) => {
      Object.entries(phoneticReplacements).forEach(([from, toList]) => {
        if (word.includes(from)) {
          toList.forEach((to) => {
            const newWord = word.replace(from, to)
            const newQuery = query.replace(word, newWord)
            if (newQuery !== query) {
              suggestions.push(newQuery)
            }
          })
        }
      })
    })

    return suggestions.slice(0, 2)
  }

  const generateRelatedQueries = (query: string): string[] => {
    const keywords = query.toLowerCase().split(" ")
    const relatedTerms: { [key: string]: string[] } = {
      ai: ["artificial intelligence", "machine learning", "neural networks", "deep learning"],
      artificial: ["AI", "machine learning", "automation", "robotics"],
      intelligence: ["AI", "cognition", "learning", "reasoning"],
      climate: ["environment", "global warming", "weather", "sustainability"],
      change: ["transformation", "evolution", "development", "shift"],
      energy: ["power", "electricity", "renewable", "solar", "wind"],
      technology: ["tech", "innovation", "digital", "computing"],
      computer: ["computing", "technology", "software", "hardware"],
      science: ["research", "study", "analysis", "discovery"],
      quantum: ["physics", "computing", "mechanics", "theory"],
    }

    const related: string[] = []
    keywords.forEach((keyword) => {
      if (relatedTerms[keyword]) {
        relatedTerms[keyword].forEach((term) => {
          const newQuery = query.replace(new RegExp(keyword, "gi"), term)
          if (newQuery !== query) {
            related.push(newQuery)
          }
        })
      }
    })

    // Add some contextual suggestions
    if (query.includes("how")) {
      related.push(query.replace("how", "what is"))
      related.push(query.replace("how", "why"))
    }
    if (query.includes("what")) {
      related.push(query.replace("what", "how"))
      related.push(query.replace("what", "why"))
    }

    return [...new Set(related)].slice(0, 4)
  }

  const generateBroaderTerms = (query: string): string[] => {
    const words = query.toLowerCase().split(" ")
    const broader: string[] = []

    // Remove specific modifiers to make broader
    const modifiersToRemove = ["latest", "new", "recent", "advanced", "modern", "current", "2024", "2023"]
    let broaderQuery = query
    modifiersToRemove.forEach((modifier) => {
      broaderQuery = broaderQuery.replace(new RegExp(modifier, "gi"), "").trim()
    })
    if (broaderQuery !== query && broaderQuery.length > 0) {
      broader.push(broaderQuery)
    }

    // Remove last word to make broader
    if (words.length > 2) {
      broader.push(words.slice(0, -1).join(" "))
    }

    // Add general category terms
    const categoryMappings: { [key: string]: string } = {
      "artificial intelligence": "technology",
      "machine learning": "computer science",
      "climate change": "environment",
      "renewable energy": "energy",
      "quantum computing": "physics",
      "space exploration": "science",
    }

    const lowerQuery = query.toLowerCase()
    Object.entries(categoryMappings).forEach(([specific, general]) => {
      if (lowerQuery.includes(specific)) {
        broader.push(general)
      }
    })

    return [...new Set(broader)].filter((b) => b.length > 0).slice(0, 3)
  }

  return (
    <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Search className="h-5 w-5" />
          No results found for "{originalQuery}"
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-300 mb-4">
            Don't worry! Let's try to find what you're looking for with these suggestions:
          </p>
          <Button
            onClick={onRetry}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Spelling Corrections */}
          {suggestions.spelling.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                Did you mean?
              </h4>
              <div className="space-y-2">
                {suggestions.spelling.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => onSuggestedSearch(suggestion)}
                    className="w-full text-left justify-start bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                    <Badge variant="outline" className="ml-auto text-xs border-yellow-400 text-yellow-300">
                      Spelling
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Related Queries */}
          {suggestions.related.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Related searches
              </h4>
              <div className="space-y-2">
                {suggestions.related.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => onSuggestedSearch(suggestion)}
                    className="w-full text-left justify-start bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                    <Badge variant="outline" className="ml-auto text-xs border-purple-400 text-purple-300">
                      Related
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Broader Terms */}
          {suggestions.broader.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Broader topics
              </h4>
              <div className="space-y-2">
                {suggestions.broader.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => onSuggestedSearch(suggestion)}
                    className="w-full text-left justify-start bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                    <Badge variant="outline" className="ml-auto text-xs border-green-400 text-green-300">
                      Broader
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Alternatives */}
          <div>
            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Popular searches
            </h4>
            <div className="space-y-2">
              {suggestions.trending.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => onSuggestedSearch(suggestion)}
                  className="w-full text-left justify-start bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                  <Badge variant="outline" className="ml-auto text-xs border-cyan-400 text-cyan-300">
                    Popular
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-white/20">
          <p className="text-sm text-gray-400 mb-2">Still can't find what you're looking for?</p>
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSuggestedSearch("help me search better")}
              className="text-white hover:bg-white/20"
            >
              Search Tips
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSuggestedSearch("contact support")}
              className="text-white hover:bg-white/20"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
