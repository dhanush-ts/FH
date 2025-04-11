"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"

const generateTimeSlots = () => {
  const slots = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = String(h).padStart(2, "0")
      const min = String(m).padStart(2, "0")
      slots.push(`${hour}:${min}`)
    }
  }
  return slots
}

export function TimePickerDemo({ date, setDate, className }) {
  // Initialize with current date if date is not provided or invalid
  const [selectedDate, setSelectedDate] = useState(() => {
    if (date && date instanceof Date && !isNaN(date.getTime())) {
      return date
    }
    return new Date()
  })
  
  // Initialize with current time from the selectedDate
  const [selectedTime, setSelectedTime] = useState(() => {
    if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
      return format(selectedDate, "HH:mm")
    }
    return format(new Date(), "HH:mm")
  })
  
  const [search, setSearch] = useState("")

  // Update selectedDate when date prop changes
  useEffect(() => {
    if (date && date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(date)
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  const filteredSlots = useMemo(() => {
    const lower = search.toLowerCase()
    return generateTimeSlots().filter((t) => t.includes(lower))
  }, [search])

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    const [hours, minutes] = time.split(":").map(Number)
    const newDate = new Date(selectedDate)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    newDate.setSeconds(0)
    setDate(newDate)
  }

  const formatDisplayDate = () => {
    try {
      if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        return format(selectedDate, "yyyy-MM-dd HH:mm")
      }
      return "Select date and time"
    } catch (error) {
      return "Select date and time"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {formatDisplayDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-4 w-[280px] sm:flex-row sm:gap-2 sm:w-[420px]">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(d) => {
            if (d) {
              setSelectedDate(d)
              // Preserve the time when changing the date
              const newDate = new Date(d)
              const [hours, minutes] = selectedTime.split(":").map(Number)
              newDate.setHours(hours)
              newDate.setMinutes(minutes)
              setDate(newDate)
            }
          }}
          className="flex-shrink-0"
        />
        <div className="flex flex-col gap-2 w-full">
          <Input
            placeholder="Search time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ScrollArea className="h-48 border rounded-md">
            <div className="grid grid-cols-2 gap-1 p-2">
              {filteredSlots.map((slot) => (
                <Button
                  key={slot}
                  variant={selectedTime === slot ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTimeSelect(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
