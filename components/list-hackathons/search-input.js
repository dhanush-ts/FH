"use client"
import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useTransition, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SearchInput({ defaultValue = "" }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(defaultValue)
  const [isPending, startTransition] = useTransition()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)

    // Only add query param if there's a value
    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }

    // Reset to first page on new search
    params.set("page", "1")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  // Handle keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <Input
          ref={inputRef}
          placeholder="Search for hackathons... (Ctrl+K)"
          className={cn(
            "pl-10 pr-24 h-12 bg-white dark:bg-gray-900 border-2 transition-all duration-200 rounded-md shadow-sm",
            isSearchFocused
              ? "border-green-600 dark:border-green-700 ring-2 ring-green-600/20"
              : "border-gray-200 dark:border-gray-800",
          )}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-600 dark:text-gray-400">
            <span className="text-xs">CTRL</span>K
          </kbd>
          <Button type="submit" className="h-10 bg-green-600 hover:bg-green-700" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
    </form>
  )
}
