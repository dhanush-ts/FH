"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function SkillProgress({ data }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="pt-6 mt-4 bg-white border-l-4 border-b-4 border-green-500 rounded-md p-6 shadow-md hover:shadow-none transition-all duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h3 className="text-xl font-bold mb-4 flex flex-wrap items-center gap-2">
        <span>Skill Development</span>
        <Badge variant={isHovering ? "default" : "outline"} className={isHovering ? "bg-green-500" : ""}>
          {isHovering ? "After Skills" : "Before Skills"}
        </Badge>
      </h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.skill} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.skill}</span>
              <span className="font-medium">{isHovering ? `${item.after}%` : `${item.before}%`}</span>
            </div>
            <div>
              <Progress
                value={isHovering ? item.after : item.before}
                className="h-2 bg-green-100"
                style={{
                  transition: "all 0.5s ease-out",
                }}
              >
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${isHovering ? item.after : item.before}%`,
                    transition: "width 0.5s ease-out",
                  }}
                />
              </Progress>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-center mt-4 text-slate-500">
        <span>Hover over skills section to see improvement after hackathons</span>
      </div>
    </div>
  )
}

