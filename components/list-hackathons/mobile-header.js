"use client"

import { useState } from "react"
import { Search, Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { HackathonFilters } from "@/components/list-hackathons/hackathon-filters"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function MobileHeader({ defaultQuery = "", currentFilters, isScrolled }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(defaultQuery)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }

    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearSearch = () => {
    setSearchQuery("")
    const params = new URLSearchParams(searchParams)
    params.delete("query")
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
    setIsSearchExpanded(false)
  }

  return (
    <div
      className={cn(
        "fixed top-20 left-0 right-0 z-50 dark:bg-gray-950 p-3 transition-all duration-300"
      )}
    >
      <div className="flex items-center gap-2">
        <AnimatePresence initial={false}>
          {isSearchExpanded ? (
            <motion.form
              key="search-form"
              initial={{ width: "50%" }}
              animate={{ width: "100%" }}
              exit={{ width: "50%" }}
              className="flex-1 flex items-center"
              onSubmit={handleSearch}
            >
              <div className="relative flex-1 bg-gray-100">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search hackathons..."
                  className="pl-9 pr-9 h-11 border-2 border-gray-200 dark:border-gray-800 focus:border-green-600 dark:focus:border-green-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="search-button"
              initial={{ width: "100%" }}
              animate={{ width: "50%" }}
              exit={{ width: "100%" }}
              className="flex-1"
            >
              <Button
                variant="outline"
                className="w-full h-11 flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-800"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="h-4 w-4" />
                <span className="font-medium">Search</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSearchExpanded && (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 h-11 flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-800"
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters</span>
                <ChevronDown className="h-4 w-4 ml-auto" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] pt-6">
              <div className="h-full overflow-auto pb-16">
                <HackathonFilters currentFilters={currentFilters} />
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  )
}
