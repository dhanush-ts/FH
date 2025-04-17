"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const goToPage = (pageNumber) => {
    router.push(createPageURL(pageNumber))
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2 // Number of pages to show before and after current page
    const range = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    // Add first and last page
    if (currentPage - delta > 2) {
      range.unshift(-1) // -1 represents ellipsis
    }
    if (currentPage + delta < totalPages - 1) {
      range.push(-1) // -1 represents ellipsis
    }

    if (totalPages > 1) {
      range.unshift(1)
      if (totalPages > 1) {
        range.push(totalPages)
      }
    }

    return range
  }

  // If there's only 1 page, don't show pagination
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex justify-center items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage || currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum, i) =>
        pageNum === -1 ? (
          <span key={`ellipsis-${i}`} className="px-2">
            …
          </span>
        ) : (
          <Button
            key={`page-${pageNum}`}
            variant={pageNum === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => goToPage(pageNum)}
            className="w-9 h-9"
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
        disabled={!hasNextPage || currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
