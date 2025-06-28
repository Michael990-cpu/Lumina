"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, Sparkles, Search, ArrowRight } from "lucide-react"

interface TrendingSearchesProps {
  onSearch: (query: string) => void
  recentSearches: string[]
}

const trendingTopics = [
  { query: "What is artificial intelligence?", category: "Technology", trend: "+15%" },
  { query: "Climate change solutions", category: "Environment", trend: "+8%" },
  { query: "Quantum computing explained", category: "Science", trend: "+12%" },
  { query: "Renewable energy benefits", category: "Environment", trend: "+6%" },
  { query: "Space exploration 2024", category: "Science", trend: "+20%" },
  { query: "Machine learning basics", category: "Technology", trend: "+10%" },
]

const popularCategories = [
  { name: "Technology", icon: "💻", queries: ["AI", "Blockchain", "5G", "IoT"] },
  { name: "Science", icon: "🔬", queries: ["Quantum", "DNA", "Climate", "Space"] },
  { name: "Health", icon: "🏥", queries: ["Vaccines", "Nutrition", "Exercise", "Mental health"] },
  { name: "Environment", icon: "🌱", queries: ["Sustainability", "Renewable energy", "Conservation", "Pollution"] },
]

export function TrendingSearches({ onSearch, recentSearches }: TrendingSearchesProps) {
  const [activeTab, setActiveTab] = useState<"trending" | "recent" | "categories">("trending")

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          Discover & Explore
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "trending" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("trending")}
            className={
              activeTab === "trending"
                ? "bg-cyan-600 text-white"
                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
            }
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
          <Button
            variant={activeTab === "recent" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("recent")}
            className={
              activeTab === "recent"
                ? "bg-cyan-600 text-white"
                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
            }
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("categories")}
            className={
              activeTab === "categories"
                ? "bg-cyan-600 text-white"
                : "bg-white/20 border-white/30 text-white hover:bg-white/30"
            }
          >
            <Search className="h-4 w-4 mr-2" />
            Categories
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {activeTab === "trending" && (
          <div className="space-y-3">
            {trendingTopics.map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between text-left h-auto p-4 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={() => onSearch(topic.query)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-cyan-400">#{index + 1}</span>
                  <div>
                    <div className="font-medium">{topic.query}</div>
                    <div className="text-sm text-gray-300">{topic.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{topic.trend}</Badge>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Button>
            ))}
          </div>
        )}

        {activeTab === "recent" && (
          <div className="space-y-3">
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4 bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm transition-all duration-300"
                  onClick={() => onSearch(search)}
                >
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  {search}
                </Button>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">No recent searches yet</p>
                <p className="text-sm text-gray-400">Your search history will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularCategories.map((category, index) => (
              <div key={index} className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <h4 className="font-semibold text-white">{category.name}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.queries.map((query, queryIndex) => (
                    <Button
                      key={queryIndex}
                      variant="outline"
                      size="sm"
                      onClick={() => onSearch(`${query} explained`)}
                      className="text-xs bg-white/30 border-white/40 text-white hover:bg-white/40"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
