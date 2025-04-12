"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, formatISO } from "date-fns"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"

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

    // Format the date in the required format for the backend
    // This will create a string like: 2025-04-10T07:30:00+05:30
    const formattedDate = formatISO(newDate)
    setDate(hours, minutes) // Pass hours and minutes to parent component
  }

  const formatDisplayDate = () => {
    try {
      if (selectedDate instanceof Date && !isNaN(selectedDate.getTime())) {
        return format(selectedDate, "HH:mm")
      }
      return "Select time"
    } catch (error) {
      return "Select time"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <div className="p-3">
          <Input placeholder="Search time..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <ScrollArea className="h-48 border-t">
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
      </PopoverContent>
    </Popover>
  )
}