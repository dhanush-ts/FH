"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ExpandableTextProps {
  text: string
  maxLines?: number
  className?: string
}

export function ExpandableText({ text, maxLines = 3, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      const element = textRef.current
      if (!element) return
      
      // Check if the content is overflowing
      setIsOverflowing(element.scrollHeight > element.clientHeight)
    }

    checkOverflow()
    
    // Re-check on window resize
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [text])

  return (
    <div className="relative">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isExpanded ? "" : `line-clamp-${maxLines}`,
          className
        )}
        style={{
          maxHeight: isExpanded ? "1000px" : undefined,
        }}
      >
        <p ref={textRef} className="text-sm text-gray-600 dark:text-gray-300">
          {text}
        </p>
      </div>
      
      {/* Gradient fade overlay when collapsed */}
      {!isExpanded && isOverflowing && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
      )}
      
      {/* Expand/collapse button */}
      {isOverflowing && (
        <div className="flex justify-center mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full h-7 px-3 flex items-center gap-1"
          >
            {isExpanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
