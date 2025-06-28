"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  totalResults: number
  resultsPerPage: number
  onPageChange: (page: number) => void
  onResultsPerPageChange: (count: number) => void
  isLoading?: boolean
}

export function SearchPagination({
  currentPage,
  totalPages,
  totalResults,
  resultsPerPage,
  onPageChange,
  onResultsPerPageChange,
  isLoading = false,
}: SearchPaginationProps) {
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false)

  const startResult = (currentPage - 1) * resultsPerPage + 1
  const endResult = Math.min(currentPage * resultsPerPage, totalResults)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const handleLoadMore = () => {
    onPageChange(currentPage + 1)
  }

  if (totalPages <= 1) return null

  return (
    <div className="space-y-4">
      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-white">
        <span>
          Showing {startResult.toLocaleString()}-{endResult.toLocaleString()} of {totalResults.toLocaleString()} results
        </span>

        <div className="flex items-center gap-4">
          {/* Results per page */}
          <div className="flex items-center gap-2">
            <span>Show:</span>
            <Select value={resultsPerPage.toString()} onValueChange={(value) => onResultsPerPageChange(Number(value))}>
              <SelectTrigger className="w-20 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={!isInfiniteScroll ? "default" : "outline"}
              size="sm"
              onClick={() => setIsInfiniteScroll(false)}
              className={!isInfiniteScroll ? "bg-cyan-600" : "bg-white/20 border-white/30 text-white"}
            >
              Pages
            </Button>
            <Button
              variant={isInfiniteScroll ? "default" : "outline"}
              size="sm"
              onClick={() => setIsInfiniteScroll(true)}
              className={isInfiniteScroll ? "bg-cyan-600" : "bg-white/20 border-white/30 text-white"}
            >
              Infinite
            </Button>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {!isInfiniteScroll ? (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <div key={index}>
                {page === "..." ? (
                  <Button variant="ghost" size="sm" disabled className="text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={
                      currentPage === page
                        ? "bg-cyan-600 text-white"
                        : "bg-white/20 border-white/30 text-white hover:bg-white/30"
                    }
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      ) : (
        /* Infinite Scroll Load More */
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={currentPage >= totalPages || isLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Loading...
              </>
            ) : currentPage >= totalPages ? (
              "No more results"
            ) : (
              "Load More Results"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
