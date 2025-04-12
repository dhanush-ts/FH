"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Plus, Trash2, CalendarIcon, Clock, HelpCircle, MoreVertical, Edit, Save, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fetchWithAuth } from "@/app/api"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TimePickerDemo } from "./time-picker"
import { getChangedFields } from "./utility"

export function ScheduleForm({initialTimeline ,initialFaq = [], eventId }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("timeline")
  const [timelines, setTimelines] = useState(initialTimeline)
  const [faqs, setFaqs] = useState(initialFaq)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)

  const originalTimelinesRef = useRef(JSON.parse(JSON.stringify(initialTimeline)))
  const originalFaqsRef = useRef(JSON.parse(JSON.stringify(initialFaq)))

  const formatDate = (dateString) => {
    if (!dateString) return "Not set"
    try {
      return format(new Date(dateString), "PPP p")
    } catch (error) {
      return "Invalid date"
    }
  }

  const handleAddTimeline = () => {
    const now = new Date()
    const newTimeline = {
      title: "",
      description: "",
      start_at: now.toISOString(),
      end_at: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      priority: timelines.length + 1,
      isEditing: true,
    }
    setTimelines([...timelines, newTimeline])
    setEditingIndex(timelines.length)
  }

  const handleRemoveTimeline = async (index, id) => {
    if (id) {
      try {
        const response = await fetchWithAuth(`/event/host/timeline/change/${id}/`, {
          method: "DELETE",
        })
      } catch (error) {
        console.log(error)
        return
      }
    }

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
    const existingDate = new Date(timelines[index][field])
    date.setHours(existingDate.getHours())
    date.setMinutes(existingDate.getMinutes())

    handleTimelineChange(index, field, date.toISOString())
  }

  const handleTimeChange = (index, field, hours, minutes) => {
    const date = new Date(timelines[index][field])
    date.setHours(hours)
    date.setMinutes(minutes)
    handleTimelineChange(index, field, date.toISOString())
  }

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", isEditing: true }])
    setEditingIndex(faqs.length)
  }

  const handleRemoveFaq = async (index, id) => {
    if (id) {
      try {
        const response = await fetchWithAuth(`/event/host/faq/change/${id}/`, {
          method: "DELETE",
        })

      } catch (error) {
        console.log(error)
        return
      }
    }

    const newFaqs = [...faqs]
    newFaqs.splice(index, 1)
    setFaqs(newFaqs)
  }

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setFaqs(newFaqs)
  }

  const toggleEditMode = (index, type) => {
    if (type === "timeline") {
      const newTimelines = [...timelines]
      newTimelines[index] = {
        ...newTimelines[index],
        isEditing: !newTimelines[index].isEditing,
      }
      setTimelines(newTimelines)
    } else {
      const newFaqs = [...faqs]
      newFaqs[index] = {
        ...newFaqs[index],
        isEditing: !newFaqs[index].isEditing,
      }
      setFaqs(newFaqs)
    }
    setEditingIndex(index)
  }

  const saveItem = async (index, type) => {
    try {
      if (type === "timeline") {
        const timeline = timelines[index]
        const original = originalTimelinesRef.current[index] || {}

        const data = timeline.id ? getChangedFields(original, timeline) : timeline

        if (timeline.id && Object.keys(data).length === 0) {
          toggleEditMode(index, type)
          return
        }

        const { isEditing, ...dataToSend } = data

        const method = timeline.id ? "PATCH" : "POST"
        const url = timeline.id ? `/event/host/timeline/change/${timeline.id}/` : `/event/host/timeline/${eventId}/`

        const response = await fetchWithAuth(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })

        if (!response.ok) {
          throw new Error("Failed to save timeline event")
        }

        const result = await response.json()

        // Update the timeline with the returned data
        const newTimelines = [...timelines]
        newTimelines[index] = {
          ...result,
          isEditing: false,
        }
        setTimelines(newTimelines)

        originalTimelinesRef.current[index] = { ...result }

      } else {
        const faq = faqs[index]
        const original = originalFaqsRef.current[index] || {}

        

        const data = faq.id ? getChangedFields(original, faq) : faq

        if (faq.id && Object.keys(data).length === 0) {
          toggleEditMode(index, type)
          return
        }

        const { isEditing, ...dataToSend } = data

        const method = faq.id ? "PATCH" : "POST"
        const url = faq.id ? `/event/host/faq/change/${faq.id}/` : `/event/host/faq/${eventId}/`

        const response = await fetchWithAuth(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })

        if (!response.ok) {
          throw new Error("Failed to save FAQ")
        }

        const result = await response.json()

        const newFaqs = [...faqs]
        newFaqs[index] = {
          ...result,
          isEditing: false,
        }
        setFaqs(newFaqs)

        originalFaqsRef.current[index] = { ...result }

      }

      toggleEditMode(index, type)
    } catch (error) {
      console.error(`Error saving ${type}:`, error)
 
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)

    try {
      // Save any unsaved timelines
      for (let i = 0; i < timelines.length; i++) {
        if (timelines[i].isEditing && timelines[i].title) {
          await saveItem(i, "timeline")
        }
      }

      // Save any unsaved FAQs
      for (let i = 0; i < faqs.length; i++) {
        if (faqs[i].isEditing && faqs[i].question && faqs[i].answer) {
          await saveItem(i, "faq")
        }
      }

      // Navigate to next section
      router.push(`/host/create/${eventId}/contact`)

    } catch (error) {
      console.error("Error saving schedule:", error)
    
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue="timeline" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="timeline" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
          <Clock className="mr-2 h-4 w-4" />
          Timeline
        </TabsTrigger>
        <TabsTrigger value="faqs" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
          <HelpCircle className="mr-2 h-4 w-4" />
          FAQs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="timeline" className="mt-2 space-y-6">
        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between bg-green-50 rounded-t-lg">
            <div>
              <CardTitle className="text-green-800">Event Timeline</CardTitle>
              <CardDescription>Create a schedule for your event participants</CardDescription>
            </div>
            <Button onClick={handleAddTimeline} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {timelines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-green-50 p-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-green-800">No timeline events yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Add timeline events to help participants understand the schedule and flow of your event
                </p>
                <Button onClick={handleAddTimeline} className="mt-6 bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Add First Event
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {timelines.map((timeline, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border p-5 transition-all",
                      timeline.isEditing ? "border-green-300 bg-green-50/50" : "hover:border-green-200",
                    )}
                  >
                    {timeline.isEditing ? (
                      // Edit mode
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-green-800">Edit Event</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleEditMode(index, "timeline")}
                              className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveItem(index, "timeline")}
                              className="h-8 bg-green-600 hover:bg-green-700"
                            >
                              <Save className="mr-2 h-3.5 w-3.5" />
                              Save
                            </Button>
                          </div>
                        </div>

                        <div className="grid gap-5">
                          <div>
                            <Label htmlFor={`timeline-title-${index}`} className="text-green-800">
                              Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`timeline-title-${index}`}
                              value={timeline.title || ""}
                              onChange={(e) => handleTimelineChange(index, "title", e.target.value)}
                              placeholder="e.g., Opening Ceremony"
                              className="mt-1 border-green-200 focus-visible:ring-green-500"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`timeline-description-${index}`} className="text-green-800">
                              Description
                            </Label>
                            <Textarea
                              id={`timeline-description-${index}`}
                              value={timeline.description || ""}
                              onChange={(e) => handleTimelineChange(index, "description", e.target.value)}
                              placeholder="Describe what happens during this event"
                              className="mt-1 border-green-200 focus-visible:ring-green-500"
                              rows={3}
                            />
                          </div>

                          <div className="grid gap-5 md:grid-cols-2">
                            <div>
                              <Label className="text-green-800">Start Date & Time</Label>
                              <div className="mt-1 space-y-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        "border-green-200 focus-visible:ring-green-500",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                                      {timeline.start_at ? (
                                        format(new Date(timeline.start_at), "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={timeline.start_at ? new Date(timeline.start_at) : undefined}
                                      onSelect={(date) => date && handleDateChange(index, "start_at", date)}
                                      initialFocus
                                      className="rounded-md border"
                                    />
                                  </PopoverContent>
                                </Popover>

                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-green-600" />
                                  <TimePickerDemo
                                    date={timeline.start_at ? new Date(timeline.start_at) : new Date()}
                                    setDate={(hours, minutes) => handleTimeChange(index, "start_at", hours, minutes)}
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label className="text-green-800">End Date & Time</Label>
                              <div className="mt-1 space-y-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start text-left font-normal",
                                        "border-green-200 focus-visible:ring-green-500",
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                                      {timeline.end_at ? (
                                        format(new Date(timeline.end_at), "PPP")
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={timeline.end_at ? new Date(timeline.end_at) : undefined}
                                      onSelect={(date) => date && handleDateChange(index, "end_at", date)}
                                      initialFocus
                                      className="rounded-md border"
                                    />
                                  </PopoverContent>
                                </Popover>

                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-green-600" />
                                  <TimePickerDemo
                                    date={timeline.end_at ? new Date(timeline.end_at) : new Date()}
                                    setDate={(hours, minutes) => handleTimeChange(index, "end_at", hours, minutes)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`timeline-priority-${index}`} className="text-green-800">
                              Priority
                            </Label>
                            <Input
                              id={`timeline-priority-${index}`}
                              type="number"
                              min="1"
                              value={timeline.priority || index + 1}
                              onChange={(e) => handleTimelineChange(index, "priority", Number.parseInt(e.target.value))}
                              placeholder="Priority"
                              className="mt-1 max-w-[100px] border-green-200 focus-visible:ring-green-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Lower numbers will appear first in the timeline
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      // View mode
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-green-800">
                                {timeline.title || "Untitled Event"}
                              </h3>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Priority: {timeline.priority || index + 1}
                              </Badge>
                            </div>

                            {timeline.description && (
                              <p className="mt-2 text-muted-foreground">{timeline.description}</p>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleEditMode(index, "timeline")}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveTimeline(index, timeline.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                          <div className="flex items-center text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Starts: {formatDate(timeline.start_at)}</span>
                          </div>
                          <ChevronRight className="hidden sm:block h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Ends: {formatDate(timeline.end_at)}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {timelines.length > 0 && (
              <Button
                onClick={handleAddTimeline}
                variant="outline"
                className="mt-4 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another Event
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="faqs" className="mt-2 space-y-6">
        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between bg-green-50 rounded-t-lg">
            <div>
              <CardTitle className="text-green-800">Frequently Asked Questions</CardTitle>
              <CardDescription>Add FAQs to help participants understand your event better</CardDescription>
            </div>
            <Button onClick={handleAddFaq} size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" /> Add FAQ
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {faqs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-green-50 p-4">
                  <HelpCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-green-800">No FAQs yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Add frequently asked questions to help participants understand your event better
                </p>
                <Button onClick={handleAddFaq} className="mt-6 bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" /> Add First FAQ
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg border p-5 transition-all",
                      faq.isEditing ? "border-green-300 bg-green-50/50" : "hover:border-green-200",
                    )}
                  >
                    {faq.isEditing ? (
                      // Edit mode
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium text-green-800">Edit FAQ</h3>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleEditMode(index, "faq")}
                              className="h-8 border-green-200 text-green-700 hover:bg-green-50"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveItem(index, "faq")}
                              className="h-8 bg-green-600 hover:bg-green-700"
                            >
                              <Save className="mr-2 h-3.5 w-3.5" />
                              Save
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <Label htmlFor={`faq-question-${index}`} className="text-green-800">
                              Question <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`faq-question-${index}`}
                              value={faq.question || ""}
                              onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                              placeholder="e.g., What is the registration deadline?"
                              className="mt-1 border-green-200 focus-visible:ring-green-500"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`faq-answer-${index}`} className="text-green-800">
                              Answer <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id={`faq-answer-${index}`}
                              value={faq.answer || ""}
                              onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                              placeholder="Provide a clear and concise answer"
                              className="mt-1 border-green-200 focus-visible:ring-green-500"
                              rows={4}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      // View mode
                      <>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-green-800">{faq.question || "Untitled Question"}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleEditMode(index, "faq")}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRemoveFaq(index, faq.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <Separator className="my-3" />

                        <div className="text-muted-foreground">{faq.answer || "No answer provided yet."}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {faqs.length > 0 && (
              <Button
                onClick={handleAddFaq}
                variant="outline"
                className="mt-4 border-green-200 text-green-700 hover:bg-green-50"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Another FAQ
              </Button>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/host/create/${eventId}/sponsors`)}
          className="border-green-200 text-green-700 hover:bg-green-50"
        >
          Previous
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </Tabs>
  )
}