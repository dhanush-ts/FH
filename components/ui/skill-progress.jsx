"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"


export function SkillProgress({ data }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="pt-6 mt-4 bg-white border-l-4 border-b-4 border-green-500 rounded-md p-6 shadow-md hover:shadow-none transition-all duration-300">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>Skill Development</span>
        <Badge
          variant={hoveredIndex !== null ? "default" : "outline"}
          className={hoveredIndex !== null ? "bg-green-500" : ""}
        >
          {hoveredIndex !== null ? "After Skills" : "Before Skills"}
        </Badge>
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div
            key={item.skill}
            className="space-y-1 group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex justify-between text-sm">
              <span>{item.skill}</span>
              <span className="font-medium skill-hover">
                <span className="before-value">{item.before}%</span>
                <span className="after-value">{item.after}%</span>
              </span>
            </div>
            <div className="skill-progress">
              <Progress
                value={hoveredIndex === index ? item.after : item.before}
                className="h-2 bg-green-100"
                style={{
                  transition: "all 0.5s ease-out",
                }}
              >
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{
                    width: `${hoveredIndex === index ? item.after : item.before}%`,
                    transition: "width 0.5s ease-out",
                  }}
                />
              </Progress>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-center mt-4 text-slate-500">
        <span>Hover over skills to see improvement after hackathons</span>
      </div>
    </div>
  )
}

