"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, ImageIcon, FileText, Clock, Filter, X } from "lucide-react"

interface FilterState {
  type: "all" | "web" | "images" | "articles" | "recent"
  timeRange: "any" | "day" | "week" | "month" | "year"
  source: "all" | "academic" | "news" | "blogs"
  language: "all" | "en" | "es" | "fr" | "de"
}

interface ResultFiltersProps {
  activeFilter: FilterState
  onFilterChange: (filter: FilterState) => void
  resultCounts: {
    all: number
    web: number
    images: number
    articles: number
    recent: number
  }
}

export function ResultFilters({ activeFilter, onFilterChange, resultCounts }: ResultFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleTypeChange = (type: FilterState["type"]) => {
    onFilterChange({ ...activeFilter, type })
  }

  const handleAdvancedFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...activeFilter, [key]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      type: "all",
      timeRange: "any",
      source: "all",
      language: "all",
    })
  }

  const hasActiveFilters =
    activeFilter.timeRange !== "any" || activeFilter.source !== "all" || activeFilter.language !== "all"

  return (
    <div className="space-y-4">
      {/* Main Filter Tabs */}
      <Tabs value={activeFilter.type} onValueChange={handleTypeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/20 backdrop-blur-sm">
          <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/30">
            <Globe className="h-4 w-4 mr-2" />
            All ({resultCounts.all})
          </TabsTrigger>
          <TabsTrigger value="web" className="text-white data-[state=active]:bg-white/30">
            <Globe className="h-4 w-4 mr-2" />
            Web ({resultCounts.web})
          </TabsTrigger>
          <TabsTrigger value="images" className="text-white data-[state=active]:bg-white/30">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images ({resultCounts.images})
          </TabsTrigger>
          <TabsTrigger value="articles" className="text-white data-[state=active]:bg-white/30">
            <FileText className="h-4 w-4 mr-2" />
            Articles ({resultCounts.articles})
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-white data-[state=active]:bg-white/30">
            <Clock className="h-4 w-4 mr-2" />
            Recent ({resultCounts.recent})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Advanced Filters */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="bg-white/20 border-white/30 text-white hover:bg-white/30"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Filters Active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-white hover:bg-white/20">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        )}
      </div>

      {showAdvanced && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Time Range */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Time Range</label>
                <div className="space-y-1">
                  {[
                    { value: "any", label: "Any time" },
                    { value: "day", label: "Past 24 hours" },
                    { value: "week", label: "Past week" },
                    { value: "month", label: "Past month" },
                    { value: "year", label: "Past year" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilter.timeRange === option.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleAdvancedFilter("timeRange", option.value)}
                      className={`w-full justify-start ${
                        activeFilter.timeRange === option.value
                          ? "bg-cyan-600 text-white"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Source Type */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Source Type</label>
                <div className="space-y-1">
                  {[
                    { value: "all", label: "All sources" },
                    { value: "academic", label: "Academic" },
                    { value: "news", label: "News" },
                    { value: "blogs", label: "Blogs" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilter.source === option.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleAdvancedFilter("source", option.value)}
                      className={`w-full justify-start ${
                        activeFilter.source === option.value ? "bg-cyan-600 text-white" : "text-white hover:bg-white/20"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Language</label>
                <div className="space-y-1">
                  {[
                    { value: "all", label: "All languages" },
                    { value: "en", label: "English" },
                    { value: "es", label: "Spanish" },
                    { value: "fr", label: "French" },
                    { value: "de", label: "German" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={activeFilter.language === option.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleAdvancedFilter("language", option.value)}
                      className={`w-full justify-start ${
                        activeFilter.language === option.value
                          ? "bg-cyan-600 text-white"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
