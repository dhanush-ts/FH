"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function TimePickerDemo({ date, setDate, className }) {
  const minuteRef = React.useRef(null)
  const hourRef = React.useRef(null)
  const [hour, setHour] = React.useState(date.getHours())
  const [minute, setMinute] = React.useState(date.getMinutes())

  // Update internal state when date prop changes
  React.useEffect(() => {
    setHour(date.getHours())
    setMinute(date.getMinutes())
  }, [date])

  const handleHourChange = (e) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setHour(0)
      return
    }

    if (value > 23) {
      setHour(23)
    } else if (value < 0) {
      setHour(0)
    } else {
      setHour(value)
    }

    setDate(value < 0 ? 0 : value > 23 ? 23 : value, minute)

    if (value > 2) {
      minuteRef.current?.focus()
    }
  }

  const handleMinuteChange = (e) => {
    const value = Number.parseInt(e.target.value, 10)
    if (isNaN(value)) {
      setMinute(0)
      return
    }

    if (value > 59) {
      setMinute(59)
    } else if (value < 0) {
      setMinute(0)
    } else {
      setMinute(value)
    }

    setDate(hour, value < 0 ? 0 : value > 59 ? 59 : value)
  }

  const formatHour = (hour) => {
    return hour.toString().padStart(2, "0")
  }

  const formatMinute = (minute) => {
    return minute.toString().padStart(2, "0")
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="grid gap-1 text-center">
        <div className="flex items-center gap-1">
          <Input
            ref={hourRef}
            value={formatHour(hour)}
            onChange={handleHourChange}
            className="w-15 h-8 border-green-200 focus-visible:ring-green-500"
            type="number"
            min={0}
            max={23}
          />
          <span className="text-sm">:</span>
          <Input
            ref={minuteRef}
            value={formatMinute(minute)}
            onChange={handleMinuteChange}
            className="w-15 h-8 border-green-200 focus-visible:ring-green-500"
            type="number"
            min={0}
            max={59}
          />
        </div>
      </div>
    </div>
  )
}
