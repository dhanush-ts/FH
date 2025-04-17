"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

export function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Convert currentPage to number if it's a string
  currentPage = typeof currentPage === "string" ? Number.parseInt(currentPage, 10) : currentPage || 1

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    router.push(createPageURL(pageNumber))
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 1) return []

    const delta = isMobile ? 0 : 1 // Show fewer pages on mobile
    const range = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    // Add first and last page
    if (currentPage - delta > 2) {
      range.unshift("ellipsis-start")
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("ellipsis-end")
    }

    if (totalPages > 1) {
      if (range[0] !== 1 && range[0] !== "ellipsis-start") {
        range.unshift(1)
      }
      if (range[range.length - 1] !== totalPages && range[range.length - 1] !== "ellipsis-end") {
        range.push(totalPages)
      }
    }

    return range
  }

  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center gap-1 md:gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage || currentPage <= 1}
        aria-label="Previous page"
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((pageNum, i) =>
        pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-500 dark:text-gray-400">
            …
          </span>
        ) : (
          <Button
            key={`page-${pageNum}`}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(pageNum)}
            className={`w-9 h-9 ${pageNum === currentPage ? "bg-green-600 hover:bg-green-700" : ""}`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage || currentPage >= totalPages}
        aria-label="Next page"
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
