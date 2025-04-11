"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { fetchWithAuth } from "@/app/api"
import { ArrowRight, ArrowLeft, Plus, Trash2, Calendar, Clock, Edit, AlarmClock } from "lucide-react"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"

export function ScheduleForm({ initialTimeline = [], initialFaq = [], eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  // Get cached data if available
  const cachedData = getCurrentSectionData("schedule")

  // Initialize state with cached data or initial data
  const [timelines, setTimelines] = useState(cachedData?.timelines || initialTimeline || [])
  const [faqs, setFaqs] = useState(cachedData?.faqs || initialFaq || [])

  // Store original data for comparison
  const originalTimelinesRef = useRef(JSON.parse(JSON.stringify(initialTimeline || [])))
  const originalFaqsRef = useRef(JSON.parse(JSON.stringify(initialFaq || [])))

  // Update context when data changes
  useEffect(() => {
    const currentData = {
      timelines,
      faqs,
    }

    cacheFormData("schedule", currentData)

    // Calculate changed fields
    const hasTimelineChanges = JSON.stringify(timelines) !== JSON.stringify(originalTimelinesRef.current)
    const hasFaqChanges = JSON.stringify(faqs) !== JSON.stringify(originalFaqsRef.current)

    const changedFields = {}
    if (hasTimelineChanges) changedFields.timelines = timelines
    if (hasFaqChanges) changedFields.faqs = faqs

    setChangedFields("schedule", changedFields)
  }, [timelines, faqs, cacheFormData, setChangedFields])

  const addTimeline = () => {
    setTimelines([...timelines, { title: "", description: "", date: "", time: "" }])
  }

  const updateTimeline = (index, field, value) => {
    const updatedTimelines = [...timelines]
    updatedTimelines[index] = { ...updatedTimelines[index], [field]: value }
    setTimelines(updatedTimelines)
  }

  const removeTimeline = (index) => {
    setTimelines(timelines.filter((_, i) => i !== index))
  }

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const updateFaq = (index, field, value) => {
    const updatedFaqs = [...faqs]
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value }
    setFaqs(updatedFaqs)
  }

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Save timelines
      const timelinePromises = timelines.map(async (timeline) => {
        const method = timeline.id ? "PATCH" : "POST"
        const url = timeline.id ? `/event/host/timeline/change/${timeline.id}/` : `/event/host/timeline/${eventId}/`

        const response = await fetchWithAuth(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeline),
        })

        if (!response.ok) throw new Error(`Failed to save timeline: ${response.status}`)
        return await response.json()
      })

      // Save FAQs
      const faqPromises = faqs.map(async (faq) => {
        const method = faq.id ? "PATCH" : "POST"
        const url = faq.id ? `/event/host/faq/change/${faq.id}/` : `/event/host/faq/${eventId}/`

        const response = await fetchWithAuth(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(faq),
        })

        if (!response.ok) throw new Error(`Failed to save FAQ: ${response.status}`)
        return await response.json()
      })

      // Wait for all promises to resolve
      await Promise.all([...timelinePromises, ...faqPromises])

      // Clear changes after successful save
      clearSectionChanges("schedule")

      // Update original data references
      originalTimelinesRef.current = JSON.parse(JSON.stringify(timelines))
      originalFaqsRef.current = JSON.parse(JSON.stringify(faqs))

      router.push(`/host/create/${eventId}/venue`)
    } catch (error) {
      console.error("Error saving schedule:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    router.push(`/host/create/${eventId}/venue`)
  }

  return (
    <FormWrapper section="schedule" initialData={{ timelines: initialTimeline || [], faqs: initialFaq || [] }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-20"
      >
        <div className="mb-8">
          <motion.h1
            className="text-3xl font-bold text-green-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Event Schedule
          </motion.h1>
          <motion.p
            className="mt-2 text-green-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Create a timeline and FAQ section for your event
          </motion.p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 border-green-100 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Event Timeline
              </h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={addTimeline}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Event
                </Button>
              </motion.div>
            </div>

            <div className="space-y-6">
              {timelines.map((timeline, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 border border-green-100 rounded-lg bg-green-50/50 relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeline(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-green-800">Title</Label>
                      <Input
                        value={timeline.title || ""}
                        onChange={(e) => updateTimeline(index, "title", e.target.value)}
                        placeholder="e.g., Registration Opens"
                        className="border-green-200 focus-visible:ring-green-500 mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-green-800 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Date
                        </Label>
                        <Input
                          value={timeline.date || ""}
                          onChange={(e) => updateTimeline(index, "date", e.target.value)}
                          placeholder="e.g., May 15, 2023"
                          className="border-green-200 focus-visible:ring-green-500 mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-green-800 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Time
                        </Label>
                        <Input
                          value={timeline.time || ""}
                          onChange={(e) => updateTimeline(index, "time", e.target.value)}
                          placeholder="e.g., 10:00 AM"
                          className="border-green-200 focus-visible:ring-green-500 mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-green-800">Description</Label>
                    <Textarea
                      value={timeline.description || ""}
                      onChange={(e) => updateTimeline(index, "description", e.target.value)}
                      placeholder="Describe this event in the timeline"
                      rows={2}
                      className="border-green-200 focus-visible:ring-green-500 mt-1"
                    />
                  </div>
                </motion.div>
              ))}

              {timelines.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <AlarmClock className="h-12 w-12 text-green-400" />
                  </motion.div>
                  <p className="text-green-700">
                    No timeline events added yet. Add your first event to create a schedule.
                  </p>
                </motion.div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-green-100 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <Edit className="h-5 w-5 text-green-600" />
                Frequently Asked Questions
              </h2>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  onClick={addFaq}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add FAQ
                </Button>
              </motion.div>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-4 border border-green-100 rounded-lg bg-green-50/50 relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFaq(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-green-800">Question</Label>
                      <Input
                        value={faq.question || ""}
                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                        placeholder="e.g., What is the registration deadline?"
                        className="border-green-200 focus-visible:ring-green-500 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-green-800">Answer</Label>
                      <Textarea
                        value={faq.answer || ""}
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                        placeholder="Provide a clear answer to the question"
                        rows={3}
                        className="border-green-200 focus-visible:ring-green-500 mt-1"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {faqs.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    className="inline-block mb-4"
                  >
                    <Edit className="h-12 w-12 text-green-400" />
                  </motion.div>
                  <p className="text-green-700">
                    No FAQs added yet. Add frequently asked questions to help your participants.
                  </p>
                </motion.div>
              )}
            </div>
          </Card>

          <motion.div
            className="flex justify-between space-x-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/host/create/${eventId}/sponsors`)}
                className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300 group"
              >
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                Previous
              </Button>
            </motion.div>

            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300"
                >
                  Skip
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <>
                      Save & Continue
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </FormWrapper>
  )
}
