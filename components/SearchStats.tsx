"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, TrendingUp, ArrowUpDown, Filter, Search, Lightbulb } from "lucide-react"

interface SearchResult {
  title: string
  url: string
  snippet: string
  displayUrl?: string
  publishDate?: string
  credibilityScore?: number
  sentiment?: "positive" | "negative" | "neutral"
}

interface SearchStatsProps {
  results: SearchResult[]
  totalResults: number
  searchTime: number
  query: string
  onSort: (sortBy: "relevance" | "date" | "credibility") => void
  onFilter: (filter: string) => void
  currentSort: "relevance" | "date" | "credibility"
  onRetry: () => void
  onSuggestedSearch: (query: string) => void
}

const alternativeSuggestions = [
  "Try using different keywords",
  "Check your spelling",
  "Use more general terms",
  "Try related topics",
]

const suggestedQueries = [
  "What is artificial intelligence?",
  "How does climate change work?",
  "Benefits of renewable energy",
  "Latest technology trends",
  "Space exploration news",
  "Quantum computing explained",
]

export function SearchStats({
  results,
  totalResults,
  searchTime,
  query,
  onSort,
  onFilter,
  currentSort,
  onRetry,
  onSuggestedSearch,
}: SearchStatsProps) {
  const [showFilters, setShowFilters] = useState(false)

  // No results state
  if (totalResults === 0) {
    return (
      <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-300 mb-4">
              We couldn't find any results for "<span className="font-medium">{query}</span>"
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Suggestions */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Try these suggestions:
              </h4>
              <ul className="space-y-2 text-left">
                {alternativeSuggestions.map((suggestion, index) => (
                  <li key={index} className="text-gray-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
              <Button onClick={onRetry} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                Try Again
              </Button>
            </div>

            {/* Popular Searches */}
            <div>
              <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular searches:
              </h4>
              <div className="space-y-2">
                {suggestedQueries.slice(0, 4).map((suggestedQuery, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestedSearch(suggestedQuery)}
                    className="w-full text-left justify-start bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    {suggestedQuery}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Results found state
  return (
    <div className="mb-6 space-y-4">
      {/* Stats Bar */}
      <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg border-white/20 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            <Search className="h-3 w-3 mr-1" />
            {totalResults.toLocaleString()} results
          </Badge>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            <Clock className="h-3 w-3 mr-1" />
            {searchTime.toFixed(2)}s
          </Badge>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            {Math.round(results.reduce((sum, r) => sum + (r.credibilityScore || 0), 0) / results.length || 0)}% avg
            credibility
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <Select value={currentSort} onValueChange={onSort}>
            <SelectTrigger className="w-40 bg-white/80 border-white/30">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="credibility">Credibility</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/80 hover:bg-white/90"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Content Type</label>
                <Select onValueChange={onFilter}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="articles">Articles</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Date Range</label>
                <Select onValueChange={onFilter}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any time</SelectItem>
                    <SelectItem value="day">Past 24 hours</SelectItem>
                    <SelectItem value="week">Past week</SelectItem>
                    <SelectItem value="month">Past month</SelectItem>
                    <SelectItem value="year">Past year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Source Quality</label>
                <Select onValueChange={onFilter}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    <SelectItem value="high">High credibility (90%+)</SelectItem>
                    <SelectItem value="medium">Medium credibility (70%+)</SelectItem>
                    <SelectItem value="verified">Verified sources only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Language</label>
                <Select onValueChange={onFilter}>
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
