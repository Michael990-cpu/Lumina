"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Loader2,
  BookOpen,
  Copy,
  Lightbulb,
  Sparkles,
  Brain,
  Zap,
  Mic,
  MicOff,
  Camera,
  Shield,
  Volume2,
  VolumeX,
  FileText,
  Download,
  Languages,
  Settings,
  Share2,
  Bookmark,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { AutocompleteInput } from "@/components/AutocompleteInput"
import { LibreLanguageSelector } from "@/components/LibreLanguageSelector"
import { exportToPDF, exportToMarkdown, validateExportData } from "@/utils/exportUtils"
import { translateSearchResults, translateSummary, getLanguageName } from "@/utils/libreTranslateUtils"
import { SearchStats } from "@/components/SearchStats"
import { TrendingSearches } from "@/components/TrendingSearches"
import { ErrorFeedback } from "@/components/ErrorFeedback"
import { DarkModeToggle } from "@/components/DarkModeToggle"
import { Tooltip } from "@/components/Tooltip"
import { ResultFilters } from "@/components/ResultFilters"
import { SearchPagination } from "@/components/SearchPagination"
import { EnhancedAuthSystem } from "@/components/EnhancedAuthSystem"
import { ZeroResultsSuggestions } from "@/components/ZeroResultsSuggestions"
import { LoadingAnimations } from "@/components/LoadingAnimations"
import { VoiceSearchFeedback } from "@/components/VoiceSearchFeedback"
import { Footer } from "@/components/Footer"
import { SupabaseTest } from "@/components/SupabaseTest"
import { SearchHistory } from "@/components/SearchHistory"
import { MobileOptimizedLayout } from "@/components/MobileOptimizedLayout"

interface SearchResult {
  title: string
  url: string
  snippet: string
  displayUrl?: string
  publishDate?: string
  credibilityScore?: number
  sentiment?: "positive" | "negative" | "neutral"
}

interface SummaryResponse {
  summary: string
  sources: SearchResult[]
  confidence: number
}

export default function LuminaSearchEngine() {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SummaryResponse | null>(null)
  const [eli5Explanation, setEli5Explanation] = useState("")
  const [isExplainingEli5, setIsExplainingEli5] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [savedSearches, setSavedSearches] = useState<string[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [activeTab, setActiveTab] = useState("summary")
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationProgress, setTranslationProgress] = useState(0)
  const [translatedContent, setTranslatedContent] = useState<{
    summary?: string
    sources?: SearchResult[]
    eli5?: string
  }>({})
  const [translationError, setTranslationError] = useState<string>("")
  const [searchTime, setSearchTime] = useState(0)
  const [currentSort, setCurrentSort] = useState<"relevance" | "date" | "credibility">("relevance")
  const [errors, setErrors] = useState<Array<{ type: string; message: string; details?: string }>>([])
  const [isRTL, setIsRTL] = useState(false)
  const [showSearchHistory, setShowSearchHistory] = useState(false)

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const [filterState, setFilterState] = useState({
    type: "all" as const,
    timeRange: "any" as const,
    source: "all" as const,
    language: "all" as const,
  })
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [voiceConfidence, setVoiceConfidence] = useState(0)
  const [showSupabaseTest, setShowSupabaseTest] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Load saved data on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory")
    const savedBookmarks = localStorage.getItem("savedSearches")
    if (savedHistory) setSearchHistory(JSON.parse(savedHistory))
    if (savedBookmarks) setSavedSearches(JSON.parse(savedBookmarks))

    // Show Supabase test on first load
    const hasSeenTest = localStorage.getItem("supabase_test_seen")
    if (!hasSeenTest) {
      setShowSupabaseTest(true)
      localStorage.setItem("supabase_test_seen", "true")
    }
  }, [])

  // Save data when it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches))
  }, [savedSearches])

  // RTL Detection for Arabic
  useEffect(() => {
    const rtlLanguages = ["ar", "he", "fa", "ur"]
    setIsRTL(rtlLanguages.includes(selectedLanguage))
  }, [selectedLanguage])

  // Voice Search Setup with audio feedback
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        playAudioFeedback("start")
      }

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const confidence = event.results[0][0].confidence
        setQuery(transcript)
        setVoiceTranscript(transcript)
        setVoiceConfidence(confidence)
        setIsListening(false)
        playAudioFeedback("success")
        setTimeout(() => handleSearch(transcript), 500)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
        playAudioFeedback("error")
        addError("voice", "Voice recognition failed", "Please try again or check microphone permissions")
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const playAudioFeedback = (type: "start" | "success" | "error") => {
    if (typeof window !== "undefined") {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (type) {
        case "start":
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
          break
        case "success":
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
          break
        case "error":
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
          break
      }

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    }
  }

  const addError = (type: string, message: string, details?: string) => {
    setErrors((prev) => [...prev.slice(-2), { type, message, details }])
    setTimeout(() => {
      setErrors((prev) => prev.slice(1))
    }, 5000)
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    const startTime = Date.now()
    setIsLoading(true)
    setResults(null)
    setEli5Explanation("")
    setTranslatedContent({})
    setTranslationProgress(0)
    setErrors([])

    // Add to search history
    if (!searchHistory.includes(searchQuery)) {
      setSearchHistory((prev) => [searchQuery, ...prev.slice(0, 9)])
    }

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          language: "en",
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data: SummaryResponse = await response.json()
      setResults(data)
      setActiveTab("summary")
      setSearchTime((Date.now() - startTime) / 1000)

      // Check for API limitations
      if (data.summary.includes("⚠️")) {
        addError("api-key", "Limited AI functionality", "Some features require API keys for full functionality")
      }

      toast({
        title: "Search Complete! 🎉",
        description: `Found ${data.sources.length} sources with ${data.confidence}% confidence`,
      })

      // Auto-translate if language is not English
      if (selectedLanguage !== "en") {
        setTimeout(() => {
          handleTranslateResults(data)
        }, 500)
      }
    } catch (error) {
      console.error("Search error:", error)
      addError("search", "Search failed", "Please check your connection and try again")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (sortBy: "relevance" | "date" | "credibility") => {
    setCurrentSort(sortBy)
    if (!results) return

    const sortedSources = [...results.sources].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.publishDate || "").getTime() - new Date(a.publishDate || "").getTime()
        case "credibility":
          return (b.credibilityScore || 0) - (a.credibilityScore || 0)
        default:
          return 0 // Keep original relevance order
      }
    })

    setResults({ ...results, sources: sortedSources })
  }

  const handleFilter = (filter: string) => {
    // Implement filtering logic here
    console.log("Filter applied:", filter)
  }

  const handleTranslateResults = async (resultsToTranslate?: SummaryResponse) => {
    const currentResults = resultsToTranslate || results
    if (!currentResults || selectedLanguage === "en") return

    setIsTranslating(true)
    setTranslationProgress(0)
    setTranslationError("")

    try {
      toast({
        title: `Translating to ${getLanguageName(selectedLanguage)}... 🌍`,
        description: "Please wait while we translate the content.",
      })

      const [translatedSummary, translatedSources] = await Promise.all([
        translateSummary(currentResults.summary, selectedLanguage),
        translateSearchResults(currentResults.sources, selectedLanguage, "en", setTranslationProgress),
      ])

      setTranslatedContent({
        summary: translatedSummary,
        sources: translatedSources,
      })

      toast({
        title: "Translation Complete! ✅",
        description: `Content translated to ${getLanguageName(selectedLanguage)}`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      setTranslationError(error instanceof Error ? error.message : "Translation failed")
      addError("translation", "Translation partially failed", "Some content may not be translated")
    } finally {
      setIsTranslating(false)
      setTranslationProgress(0)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)

    if (newLanguage === "en") {
      setTranslatedContent({})
    } else if (results) {
      setTimeout(() => {
        handleTranslateResults()
      }, 100)
    }
  }

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      addError("voice", "Voice search unavailable", "Voice search is not supported in this browser")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      toast({
        title: "Listening... 🎤",
        description: "Speak your question now",
      })
    }
  }

  const handleImageSearch = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    toast({
      title: "Analyzing Image... 📸",
      description: "Please wait while we analyze your image.",
    })

    try {
      const response = await fetch("/api/image-search", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Image analysis failed")

      const data = await response.json()
      setQuery(data.description)
      handleSearch(data.description)
    } catch (error) {
      addError("image", "Image analysis failed", "Please try a different image or check your connection")
    }
  }

  const handleTextToSpeech = () => {
    if (!results?.summary) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const textToSpeak = (translatedContent.summary || results.summary).replace(/\[\d+\]/g, "").replace(/⚠️[^.]*\./g, "")

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesis.speak(utterance)
  }

  const handleExplainEli5 = async () => {
    if (!results?.summary) return

    setIsExplainingEli5(true)
    try {
      const response = await fetch("/api/explain-eli5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: results.summary,
          query: query,
          language: "en",
        }),
      })

      if (!response.ok) throw new Error("ELI5 explanation failed")

      const data = await response.json()
      setEli5Explanation(data.explanation)

      if (selectedLanguage !== "en") {
        try {
          const translatedEli5 = await translateSummary(data.explanation, selectedLanguage)
          setTranslatedContent((prev) => ({
            ...prev,
            eli5: translatedEli5,
          }))
        } catch (error) {
          console.error("ELI5 translation error:", error)
        }
      }

      toast({
        title: "ELI5 Ready! 🧒",
        description: "Explanation simplified for easy understanding.",
      })
    } catch (error) {
      addError("eli5", "ELI5 explanation failed", "Please try again or check your connection")
    } finally {
      setIsExplainingEli5(false)
    }
  }

  const copyToClipboard = async () => {
    const textToCopy = translatedContent.eli5 || eli5Explanation || translatedContent.summary || results?.summary || ""

    try {
      await navigator.clipboard.writeText(textToCopy)
      toast({
        title: "Copied! 📋",
        description: "Content copied to clipboard.",
      })
    } catch (error) {
      addError("copy", "Copy failed", "Failed to copy to clipboard")
    }
  }

  const handleShare = async () => {
    if (!results) return

    const shareData = {
      title: `Lumina Search: ${query}`,
      text: translatedContent.summary || results.summary,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`)
        toast({
          title: "Shared! 🔗",
          description: "Content copied to clipboard for sharing.",
        })
      }
    } catch (error) {
      addError("share", "Share failed", "Failed to share content")
    }
  }

  const handleSaveSearch = () => {
    if (!query || savedSearches.includes(query)) return

    setSavedSearches((prev) => [query, ...prev.slice(0, 9)])
    toast({
      title: "Search Saved! 🔖",
      description: "Added to your saved searches.",
    })
  }

  const handleExportPDF = async () => {
    if (!results) return

    try {
      const exportData = {
        query,
        summary: translatedContent.eli5 || eli5Explanation || translatedContent.summary || results.summary,
        sources: translatedContent.sources || results.sources,
        confidence: results.confidence,
        timestamp: new Date().toLocaleString(),
        language: selectedLanguage,
      }

      if (!validateExportData(exportData)) {
        throw new Error("Invalid export data")
      }

      exportToPDF(exportData)

      toast({
        title: "PDF Exported! 📄",
        description: "Search results saved as PDF file.",
      })
    } catch (error) {
      addError("export", "PDF export failed", "Please try again")
    }
  }

  const handleExportMarkdown = async () => {
    if (!results) return

    try {
      const exportData = {
        query,
        summary: translatedContent.eli5 || eli5Explanation || translatedContent.summary || results.summary,
        sources: translatedContent.sources || results.sources,
        confidence: results.confidence,
        timestamp: new Date().toLocaleString(),
        language: selectedLanguage,
      }

      if (!validateExportData(exportData)) {
        throw new Error("Invalid export data")
      }

      exportToMarkdown(exportData)

      toast({
        title: "Markdown Exported! 📝",
        description: "Search results saved as Markdown file.",
      })
    } catch (error) {
      addError("export", "Markdown export failed", "Please try again")
    }
  }

  const displaySummary =
    translatedContent.eli5 || eli5Explanation || translatedContent.summary || results?.summary || ""
  const displaySources = translatedContent.sources || results?.sources || []

  return (
    <MobileOptimizedLayout
      onVoiceSearch={handleVoiceSearch}
      onImageSearch={handleImageSearch}
      onHistoryOpen={() => setShowSearchHistory(true)}
      onSettingsOpen={() => setShowSupabaseTest(!showSupabaseTest)}
      isListening={isListening}
      currentUser={currentUser}
      selectedLanguage={selectedLanguage}
      onLanguageChange={handleLanguageChange}
    >
      <div className={`min-h-screen relative overflow-hidden ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.10'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>

          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='%23ffffff' strokeWidth='0.5' opacity='0.15'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header - Hidden on mobile (handled by MobileOptimizedLayout) */}
            <div className="text-center mb-12 pt-8 hidden md:block">
              <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <div className="flex items-center gap-2">
                  <Tooltip content="View search history">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSearchHistory(true)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <Brain className="h-12 w-12 text-cyan-400" />
                    <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Lumina
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <LibreLanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                    isTranslating={isTranslating}
                    onTranslateResults={results ? () => handleTranslateResults() : undefined}
                  />
                  <DarkModeToggle />
                  <EnhancedAuthSystem
                    onLogin={setCurrentUser}
                    onLogout={() => setCurrentUser(null)}
                    currentUser={currentUser}
                  />
                  <Tooltip content="Settings">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSupabaseTest(!showSupabaseTest)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <p className="text-xl text-gray-300 mb-2">AI-Powered Knowledge Discovery</p>
              <p className="text-gray-400">Multi-modal search with free multilingual translation</p>
            </div>

            {/* Mobile Header */}
            <div className="text-center mb-8 pt-4 md:hidden">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative">
                  <Brain className="h-8 w-8 text-cyan-400" />
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Lumina
                </h1>
              </div>
              <p className="text-sm text-gray-300">AI-Powered Knowledge Discovery</p>
            </div>

            {/* Supabase Connection Test */}
            {showSupabaseTest && <SupabaseTest />}

            {/* Search History Modal */}
            <SearchHistory
              isOpen={showSearchHistory}
              onClose={() => setShowSearchHistory(false)}
              onSearch={handleSearch}
              recentSearches={searchHistory}
            />

            {/* Error Messages */}
            {errors.map((error, index) => (
              <ErrorFeedback
                key={index}
                type={error.type as any}
                message={error.message}
                details={error.details}
                onRetry={() => setErrors((prev) => prev.filter((_, i) => i !== index))}
              />
            ))}

            {/* Search Interface */}
            <Card className="mb-6 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
              <CardContent className="p-4 md:p-6">
                <div className={`flex gap-2 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <AutocompleteInput
                    value={query}
                    onChange={setQuery}
                    onSearch={handleSearch}
                    placeholder="What would you like to discover today?"
                    className="h-12 md:h-14 text-base md:text-lg bg-white/80 border-white/30 focus:bg-white focus:border-cyan-400 transition-all duration-300"
                  />

                  {/* Desktop Voice/Image buttons */}
                  <div className="hidden md:flex gap-2">
                    <Tooltip content="Voice search">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleVoiceSearch}
                        className={`h-14 px-4 transition-all duration-300 ${
                          isListening
                            ? "bg-red-500 text-white border-red-500 animate-pulse"
                            : "bg-white/80 hover:bg-white/90"
                        }`}
                      >
                        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>
                    </Tooltip>

                    <Tooltip content="Image search">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleImageSearch}
                        className="h-14 px-4 bg-white/80 hover:bg-white/90"
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </div>

                  <Button
                    onClick={() => handleSearch()}
                    disabled={isLoading || !query.trim()}
                    size="lg"
                    className="h-12 md:h-14 px-6 md:px-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    ) : (
                      <>
                        <Zap className="h-4 w-4 md:h-5 md:w-5 mr-2" />
                        <span className="hidden sm:inline">Discover</span>
                        <span className="sm:hidden">Go</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Actions */}
                {query && (
                  <div className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                    <Tooltip content="Save this search">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveSearch}
                        className="text-white hover:bg-white/20"
                      >
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            {/* Search Statistics */}
            {results && (
              <SearchStats
                results={displaySources}
                totalResults={displaySources.length}
                searchTime={searchTime}
                query={query}
                onSort={handleSort}
                onFilter={handleFilter}
                currentSort={currentSort}
                onRetry={() => handleSearch()}
                onSuggestedSearch={handleSearch}
              />
            )}

            {/* Loading Animation */}
            {isLoading && <LoadingAnimations type="search" message="Discovering knowledge across the web..." />}

            {/* Voice Search Feedback */}
            {(isListening || voiceTranscript) && (
              <VoiceSearchFeedback
                isListening={isListening}
                onToggleListening={handleVoiceSearch}
                transcript={voiceTranscript}
                confidence={voiceConfidence}
              />
            )}

            {/* Result Filters */}
            {results && (
              <ResultFilters
                activeFilter={filterState}
                onFilterChange={setFilterState}
                resultCounts={{
                  all: displaySources.length,
                  web: Math.floor(displaySources.length * 0.6),
                  images: Math.floor(displaySources.length * 0.1),
                  articles: Math.floor(displaySources.length * 0.2),
                  recent: Math.floor(displaySources.length * 0.1),
                }}
              />
            )}

            {/* Results */}
            {results && (
              <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-t-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <BookOpen className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <span className="text-lg md:text-xl">AI-Generated Insights</span>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span className="text-sm">Confidence: {results.confidence}%</span>
                            <Progress value={results.confidence} className="w-12 md:w-16 h-2" />
                          </div>
                          {selectedLanguage !== "en" && (
                            <Badge variant="outline" className="text-xs border-blue-400 text-blue-200 w-fit">
                              <Languages className="h-3 w-3 mr-1" />
                              {getLanguageName(selectedLanguage)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Tooltip content="Listen to summary">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleTextToSpeech}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        >
                          {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      </Tooltip>
                      <Tooltip content="Explain Like I'm 5 - Simplify the explanation">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExplainEli5}
                          disabled={isExplainingEli5}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        >
                          {isExplainingEli5 ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Lightbulb className="h-4 w-4" />
                          )}
                        </Button>
                      </Tooltip>
                      <Tooltip content="Copy to clipboard">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyToClipboard}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Share results">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                      <div className="hidden md:flex gap-2">
                        <Tooltip content="Export as PDF">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportPDF}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Export as Markdown">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportMarkdown}
                            className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/20">
                      <TabsTrigger value="summary" className="text-white data-[state=active]:bg-white/30">
                        AI Summary
                      </TabsTrigger>
                      <TabsTrigger value="sources" className="text-white data-[state=active]:bg-white/30">
                        Sources ({displaySources.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="mt-6">
                      <div className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          <div className="p-4 md:p-6 bg-white/80 rounded-xl shadow-inner">
                            <p className="text-gray-800 leading-relaxed text-base md:text-lg whitespace-pre-line">
                              {displaySummary}
                            </p>
                          </div>
                        </div>

                        {(eli5Explanation || translatedContent.eli5) && (
                          <div className="flex justify-center">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 text-sm font-medium">
                              <Lightbulb className="h-4 w-4 mr-2" />
                              Explained Like You're 5
                            </Badge>
                          </div>
                        )}

                        {selectedLanguage !== "en" && (translatedContent.summary || translatedContent.eli5) && (
                          <div className="flex justify-center">
                            <Badge className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-4 py-2 text-sm font-medium">
                              <Languages className="h-4 w-4 mr-2" />
                              Translated by LibreTranslate
                            </Badge>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="sources" className="mt-6">
                      <div className="grid gap-4">
                        {displaySources.map((source, index) => (
                          <div
                            key={index}
                            className="bg-white/80 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <div className="flex items-start gap-3 md:gap-4">
                              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm px-2 md:px-3 py-1 min-w-[2rem] text-center">
                                {index + 1}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-base md:text-lg text-gray-900 mb-2">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-cyan-600 transition-colors duration-200 break-words"
                                  >
                                    {source.title}
                                  </a>
                                </h4>
                                <p className="text-gray-700 mb-3 leading-relaxed text-sm md:text-base">
                                  {source.snippet}
                                </p>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                                  <a
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-colors duration-200 truncate"
                                  >
                                    {source.displayUrl || source.url}
                                  </a>
                                  {source.credibilityScore && (
                                    <Badge variant="outline" className="text-xs w-fit">
                                      {source.credibilityScore}% credible
                                    </Badge>
                                  )}
                                  {selectedLanguage !== "en" && translatedContent.sources && (
                                    <Badge variant="outline" className="text-xs w-fit">
                                      <Languages className="h-3 w-3 mr-1" />
                                      Translated
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Zero Results */}
            {results && displaySources.length === 0 && (
              <ZeroResultsSuggestions
                originalQuery={query}
                onSuggestedSearch={handleSearch}
                onRetry={() => handleSearch()}
              />
            )}

            {/* Trending Searches */}
            {!results && !isLoading && <TrendingSearches onSearch={handleSearch} recentSearches={searchHistory} />}

            {/* Pagination */}
            {results && displaySources.length > 0 && (
              <SearchPagination
                currentPage={currentPage}
                totalPages={Math.ceil(displaySources.length / resultsPerPage)}
                totalResults={displaySources.length}
                resultsPerPage={resultsPerPage}
                onPageChange={setCurrentPage}
                onResultsPerPageChange={setResultsPerPage}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </MobileOptimizedLayout>
  )
}
