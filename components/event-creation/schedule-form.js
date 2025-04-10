"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Plus, Trash2, CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchWithAuth } from "@/app/api"
import { cn } from "@/lib/utils"

export function ScheduleForm({ initialData = [], eventId }) {
  const router = useRouter()
  const [timelines, setTimelines] = useState(initialData || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use refs to prevent infinite loops
  const initialDataRef = useRef(false)
  const progressUpdateRef = useRef(0)

  // Store original data for change detection
  useEffect(() => {
    if (!initialDataRef.current && initialData?.length > 0) {
      setTimelines(initialData)
      initialDataRef.current = true
      setSectionData("schedule", { timelines: initialData })
    }
  }, [initialData, setSectionData])

  // Calculate progress based on data
  useEffect(() => {
    // Only update progress if it has changed
    const newProgress = calculateProgress()
    if (newProgress !== progressUpdateRef.current) {
      updateSectionProgress("schedule", newProgress)
      progressUpdateRef.current = newProgress
    }
  }, [timelines.length]) // Only depend on the length, not the full array

  const calculateProgress = () => {
    // Simple progress calculation based on having at least one timeline item
    if (timelines.length > 0) {
      return 100
    }
    return 0
  }

  const handleAddTimeline = () => {
    const now = new Date()
    setTimelines([
      ...timelines,
      {
        title: "",
        description: "",
        start_date: now.toISOString(),
        end_date: now.toISOString(),
        priority: timelines.length + 1,
      },
    ])
  }

  const handleRemoveTimeline = (index) => {
    const newTimelines = [...timelines]
    newTimelines.splice(index, 1)
    setTimelines(newTimelines)
  }

  const handleTimelineChange = (index, field, value) => {
    const newTimelines = [...timelines]
    newTimelines[index] = { ...newTimelines[index], [field]: value }
    setTimelines(newTimelines)
  }

  const handleDateChange = (index, field, date) => {
    handleTimelineChange(index, field, date.toISOString())
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Save timelines
      for (const timeline of timelines) {
        if (!timeline.title) continue // Skip empty timelines

        const method = timeline.id ? "PATCH" : "POST"
        const url = timeline.id ? `/event/organizer/timeline/${timeline.id}/` : `/event/organizer/timeline/${eventId}/`

        await fetchWithAuth(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(timeline),
        })
      }

      // Update context with new data
      setSectionData("schedule", { timelines })

      // Navigate to next section
      router.push(`/host/create/${eventId}/venue`)
    } catch (error) {
      console.error("Error saving schedule:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Timeline</CardTitle>
        <Button onClick={handleAddTimeline} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </CardHeader>
      <CardContent>
        {timelines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No timeline events yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add timeline events to help participants understand the schedule
            </p>
            <Button onClick={handleAddTimeline} className="mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {timelines.map((timeline, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">Event {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTimeline(index)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4">
                  <Label htmlFor={`timeline-title-${index}`}>Title</Label>
                  <Input
                    id={`timeline-title-${index}`}
                    value={timeline.title || ""}
                    onChange={(e) => handleTimelineChange(index, "title", e.target.value)}
                    placeholder="Event title"
                    className="mt-1"
                  />
                </div>

                <div className="mt-4">
                  <Label htmlFor={`timeline-description-${index}`}>Description</Label>
                  <Textarea
                    id={`timeline-description-${index}`}
                    value={timeline.description || ""}
                    onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                    placeholder="Event description"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Start Date</Label>
                    <div className="mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {timeline.start_date ? (
                              format(new Date(timeline.start_date), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={timeline.start_date ? new Date(timeline.start_date) : undefined}
                            onSelect={(date) => date && handleDateChange(index, "start_date", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>End Date</Label>
                    <div className="mt-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {timeline.end_date ? format(new Date(timeline.end_date), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={timeline.end_date ? new Date(timeline.end_date) : undefined}
                            onSelect={(date) => date && handleDateChange(index, "end_date", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor={`timeline-priority-${index}`}>Priority</Label>
                  <Input
                    id={`timeline-priority-${index}`}
                    type="number"
                    min="1"
                    value={timeline.priority || index + 1}
                    onChange={(e) => handleTimelineChange(index, "priority", Number.parseInt(e.target.value))}
                    placeholder="Priority"
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/sponsors`)}>
            Previous
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
