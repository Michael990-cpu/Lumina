"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Loader2, TrendingUp, Lightbulb } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Suggestion {
  text: string
  category: string
}

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

const categoryIcons = {
  technology: "💻",
  science: "🔬",
  health: "🏥",
  environment: "🌱",
  space: "🚀",
  general: "🔍",
  popular: "⭐",
}

const categoryColors = {
  technology: "bg-blue-100 text-blue-800",
  science: "bg-green-100 text-green-800",
  health: "bg-red-100 text-red-800",
  environment: "bg-emerald-100 text-emerald-800",
  space: "bg-purple-100 text-purple-800",
  general: "bg-gray-100 text-gray-800",
  popular: "bg-yellow-100 text-yellow-800",
}

export function AutocompleteInput({ value, onChange, onSearch, placeholder, className }: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [category, setCategory] = useState("general")

  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/predict?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setCategory(data.category || "general")
      setShowSuggestions(data.suggestions?.length > 0)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Autocomplete error:", error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounce suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value.trim()) {
        fetchSuggestions(value)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value, fetchSuggestions])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter") {
        onSearch(value)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0) {
          const selectedSuggestion = suggestions[selectedIndex]
          onChange(selectedSuggestion)
          onSearch(selectedSuggestion)
          setShowSuggestions(false)
        } else {
          onSearch(value)
        }
        break
      case "Escape":
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    onSearch(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`pl-12 pr-12 ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
        >
          {/* Category Header */}
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons] || "🔍"}</span>
              <Badge className={categoryColors[category as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500 ml-auto">{suggestions.length} suggestions</span>
            </div>
          </div>

          {/* Suggestions List */}
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-50 last:border-b-0 ${
                index === selectedIndex ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-800 flex-1">{suggestion}</span>
                {index === selectedIndex && <TrendingUp className="h-4 w-4 text-blue-500" />}
              </div>
            </button>
          ))}

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Use ↑↓ to navigate, Enter to select</span>
              <div className="flex items-center gap-1">
                <Lightbulb className="h-3 w-3" />
                <span>AI-powered suggestions</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
