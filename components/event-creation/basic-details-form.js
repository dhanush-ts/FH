"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEventData } from "./event-data-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/app/api"

const basicDetailsSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  short_description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description cannot exceed 200 characters"),
})


export function BasicDetailsForm({
  initialData,
  eventId,
}) {
  const router = useRouter()
  const { updateEventData, updateSectionProgress, setSectionData, hasChanges } = useEventData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  // Use ref to track if we've already set the initial data
  const initialDataSetRef = useRef(false)

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(basicDetailsSchema),
    defaultValues: {
      title: initialData?.title || "",
      short_description: initialData?.short_description || "",
    },
  })

  // Store original data for change detection
  useEffect(() => {
    if (initialData && !initialDataSetRef.current) {
      const data = {
        title: initialData.title || "",
        short_description: initialData.short_description || "",
      }
      setOriginalData(data)
      setSectionData("basic", data)
      initialDataSetRef.current = true
    }
  }, [initialData, setSectionData])

  // Calculate progress based on form completion
  const progressUpdateRef = useRef(0)

  useEffect(() => {
    const values = form.getValues()
    const fields = Object.keys(basicDetailsSchema.shape)

    let filledFields = 0
    fields.forEach((field) => {
      if (values[field]?.toString().trim()) {
        filledFields++
      }
    })

    const progress = Math.round((filledFields / fields.length) * 100)

    // Only update if progress has changed
    if (progress !== progressUpdateRef.current) {
      updateSectionProgress("basic", progress)
      progressUpdateRef.current = progress
    }
  }, [form.watch("title"), form.watch("short_description"), updateSectionProgress])

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Check if we need to make an API call (data has changed)
      const hasDataChanged =
        !originalData || originalData.title !== data.title || originalData.short_description !== data.short_description

      if (!hasDataChanged) {
 
        setIsSubmitting(false)
        return
      }

      // Determine if we need PUT or PATCH
      const method = eventId === "new" || !initialData?.id ? "POST" : "PATCH"
      const url = eventId === "new" ? `/event/organizer/base-event/` : `/event/organizer/base-event/${eventId}/`

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }

      const savedData = await response.json()

      // Update context with new data
      updateEventData("basic", savedData)
      setOriginalData(data)
      setSectionData("basic", data)

      // If this was a new event, redirect to the new event ID
      if (eventId === "new" && savedData.id) {
        router.push(`/host/create/${savedData.id}/additional`)
      } else {
        // Navigate to next section
        router.push(`/host/create/${eventId}/additional`)
      }

    } catch (error) {
      console.error("Error saving basic details:", error)
  
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormDescription>A clear, concise name for your event</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="short_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Briefly describe your event" {...field} rows={3} />
                </FormControl>
                <FormDescription>
                  A short summary that will appear in event listings (max 200 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push("/host/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
