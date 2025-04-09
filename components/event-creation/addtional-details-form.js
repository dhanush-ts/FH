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
import { Card } from "@/components/ui/card"

const additionalDetailsSchema = z.object({
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  team_min_size: z.coerce.number().int().min(1, "Minimum team size must be at least 1").optional(),
  team_max_size: z.coerce.number().int().min(1, "Maximum team size must be at least 1").optional(),
  registration_cost: z.coerce.number().min(0, "Cost cannot be negative").optional(),
})


export function AdditionalDetailsForm({
  initialData,
  eventId,
}) {
  const router = useRouter()
  const { updateSectionProgress, setSectionData } = useEventData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState(null)

  // Use ref to track if we've already set the initial data
  const initialDataSetRef = useRef(false)

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      url: initialData?.url || "",
      team_min_size: initialData?.team_min_size || 1,
      team_max_size: initialData?.team_max_size || 4,
      registration_cost: initialData?.registration_cost || 0,
    },
  })

  // Store original data for change detection
  useEffect(() => {
    if (initialData && !initialDataSetRef.current) {
      const data = {
        url: initialData.url || "",
        team_min_size: initialData.team_min_size || 1,
        team_max_size: initialData.team_max_size || 4,
        registration_cost: initialData.registration_cost || 0,
      }
      setOriginalData(data)
      setSectionData("additional", data)
      initialDataSetRef.current = true
    }
  }, [initialData, setSectionData])

  // Calculate progress based on form completion
  const progressUpdateRef = useRef(0)

  useEffect(() => {
    const values = form.getValues()
    const fields = Object.keys(additionalDetailsSchema.shape)

    let filledFields = 0
    fields.forEach((field) => {
      if (
        values[field  ] !== undefined &&
        values[field  ] !== null
      ) {
        filledFields++
      }
    })

    const progress = Math.round((filledFields / fields.length) * 100)

    // Only update if progress has changed
    if (progress !== progressUpdateRef.current) {
      updateSectionProgress("additional", progress)
      progressUpdateRef.current = progress
    }
  }, [
    form.watch("url"),
    form.watch("team_min_size"),
    form.watch("team_max_size"),
    form.watch("registration_cost"),
    updateSectionProgress,
  ])

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Check if we need to make an API call (data has changed)
      const hasDataChanged = !originalData || JSON.stringify(originalData) !== JSON.stringify(data)

      if (!hasDataChanged) {
  
        setIsSubmitting(false)
        router.push(`/host/create/${eventId}/media`)
        return
      }

      // Determine if we need PUT or PATCH
      const method = !initialData?.id ? "PUT" : "PATCH"
      const url = `/event/organizer/additional-event-detail/${eventId}/`

      const response = await fetch(url, {
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
      setOriginalData(data)
      setSectionData("additional", data)

      // Navigate to next section
      router.push(`/host/create/${eventId}/media`)

    } catch (error) {
      console.error("Error saving additional details:", error)
 
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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourevent.com" {...field} />
                </FormControl>
                <FormDescription>External website for your event (optional)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="team_min_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_max_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="registration_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Cost (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormDescription>Enter 0 for free events</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}`)}>
              Previous
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
