"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { History, Search, Trash2, Star, Clock, TrendingUp, X, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SearchHistoryItem {
  query: string
  timestamp: number
  results?: number
  isFavorite?: boolean
}

interface SearchHistoryProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  recentSearches: string[]
}

export function SearchHistory({ isOpen, onClose, onSearch, recentSearches }: SearchHistoryProps) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [favorites, setFavorites] = useState<SearchHistoryItem[]>([])
  const [filterText, setFilterText] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "alphabetical">("recent")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("lumina_search_history")
    const savedFavorites = localStorage.getItem("lumina_favorites")

    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error("Error loading search history:", error)
      }
    }

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }
  }, [])

  // Sync with recent searches from parent
  useEffect(() => {
    const newHistory = recentSearches.map((query, index) => ({
      query,
      timestamp: Date.now() - index * 60000, // Spread out timestamps
      results: Math.floor(Math.random() * 100) + 10,
      isFavorite: favorites.some((fav) => fav.query === query),
    }))

    setSearchHistory((prev) => {
      const merged = [...newHistory]
      prev.forEach((item) => {
        if (!newHistory.some((newItem) => newItem.query === item.query)) {
          merged.push(item)
        }
      })
      return merged.slice(0, 50) // Keep only last 50 searches
    })
  }, [recentSearches, favorites])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("lumina_search_history", JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem("lumina_favorites", JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (item: SearchHistoryItem) => {
    const isFavorite = favorites.some((fav) => fav.query === item.query)

    if (isFavorite) {
      setFavorites((prev) => prev.filter((fav) => fav.query !== item.query))
      setSearchHistory((prev) => prev.map((h) => (h.query === item.query ? { ...h, isFavorite: false } : h)))
      toast({
        title: "Removed from favorites",
        description: `"${item.query}" removed from your favorites`,
      })
    } else {
      const favoriteItem = { ...item, isFavorite: true }
      setFavorites((prev) => [favoriteItem, ...prev])
      setSearchHistory((prev) => prev.map((h) => (h.query === item.query ? { ...h, isFavorite: true } : h)))
      toast({
        title: "Added to favorites! ⭐",
        description: `"${item.query}" saved to your favorites`,
      })
    }
  }

  const deleteHistoryItem = (query: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.query !== query))
    setFavorites((prev) => prev.filter((item) => item.query !== query))
    toast({
      title: "Deleted from history",
      description: `"${query}" removed from search history`,
    })
  }

  const clearAllHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("lumina_search_history")
    toast({
      title: "History cleared",
      description: "All search history has been deleted",
    })
  }

  const exportHistory = () => {
    const data = {
      searchHistory,
      favorites,
      exportDate: new Date().toISOString(),
      totalSearches: searchHistory.length,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lumina-search-history-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "History exported! 📄",
      description: "Your search history has been downloaded",
    })
  }

  const filteredHistory = searchHistory
    .filter((item) => {
      if (showFavoritesOnly && !item.isFavorite) return false
      if (filterText && !item.query.toLowerCase().includes(filterText.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.query.localeCompare(b.query)
        case "popular":
          return (b.results || 0) - (a.results || 0)
        default:
          return b.timestamp - a.timestamp
      }
    })

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <History className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl">Search History</span>
                <div className="text-sm opacity-90 mt-1">
                  {searchHistory.length} searches • {favorites.length} favorites
                </div>
              </div>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Filter search history..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Star className="h-4 w-4 mr-1" />
                Favorites
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="recent">Recent</option>
                <option value="popular">Popular</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={exportHistory}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearAllHistory} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>

          {/* History List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No search history found</p>
                <p className="text-sm">Start searching to build your history</p>
              </div>
            ) : (
              filteredHistory.map((item, index) => (
                <div
                  key={`${item.query}-${item.timestamp}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => onSearch(item.query)}
                        className="text-left font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                      >
                        {item.query}
                      </button>
                      {item.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.timestamp)}
                      </div>
                      {item.results && (
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {item.results} results
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleFavorite(item)} className="h-8 w-8 p-0">
                      <Star
                        className={`h-4 w-4 ${
                          item.isFavorite ? "text-yellow-500 fill-current" : "text-gray-400 hover:text-yellow-500"
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onSearch(item.query)} className="h-8 w-8 p-0">
                      <Search className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHistoryItem(item.query)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Stats */}
          {searchHistory.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{searchHistory.length}</div>
                  <div className="text-xs text-gray-500">Total Searches</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{favorites.length}</div>
                  <div className="text-xs text-gray-500">Favorites</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {searchHistory.filter((item) => Date.now() - item.timestamp < 86400000).length}
                  </div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      searchHistory.reduce((sum, item) => sum + (item.results || 0), 0) / searchHistory.length || 0,
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Avg Results</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
