"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { useEventData } from "./event-data-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { fetchWithAuth } from "@/app/api"

const mediaDetailsSchema = z.object({
  banner: z.string().optional(),
  thumbnail: z.string().optional(),
  about_event: z.string().min(10, "About event must be at least 10 characters"),
  mode: z.enum(["Online", "Offline", "Hybrid"]),
  start_date: z.date(),
  end_date: z.date(),
  registration_end_date: z.date(),
})

export function MediaDetailsForm({
  initialData,
  eventId,
}) {
  const router = useRouter()
  const { updateSectionProgress, setSectionData } = useEventData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(mediaDetailsSchema),
    defaultValues: {
      banner: initialData?.banner || "",
      thumbnail: initialData?.thumbnail || "",
      about_event: initialData?.about_event || "",
      mode: initialData?.mode || "Online",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
      registration_end_date: initialData?.registration_end_date
        ? new Date(initialData.registration_end_date)
        : new Date(),
    },
  })

  // Set preview images
  useEffect(() => {
    if (initialData?.banner) {
      setBannerPreview(initialData.banner)
    }
    if (initialData?.thumbnail) {
      setThumbnailPreview(initialData.thumbnail)
    }
  }, [initialData])

  // Store original data for change detection
  useEffect(() => {
    if (initialData) {
      const data = {
        banner: initialData.banner || "",
        thumbnail: initialData.thumbnail || "",
        about_event: initialData.about_event || "",
        mode: initialData.mode || "Online",
        start_date: initialData.start_date ? new Date(initialData.start_date) : new Date(),
        end_date: initialData.end_date ? new Date(initialData.end_date) : new Date(),
        registration_end_date: initialData.registration_end_date
          ? new Date(initialData.registration_end_date)
          : new Date(),
      }
      setOriginalData(data)
      setSectionData("media", data)
    }
  }, [initialData, setSectionData])

  // Calculate progress based on form completion
  useEffect(() => {
    const values = form.getValues()
    const fields = Object.keys(mediaDetailsSchema.shape)

    let filledFields = 0
    fields.forEach((field) => {
      if (field === "banner" || field === "thumbnail") {
        // Optional fields
        filledFields += 0.5
      } else if (values[field]) {
        filledFields++
      }
    })

    const progress = Math.round((filledFields / (fields.length - 1)) * 100) // -1 because banner and thumbnail count as 0.5 each
    updateSectionProgress("media", progress)
  }, [form.watch(), updateSectionProgress])

  // Handle file uploads
  const handleFileUpload = async (file, type) => {
    // In a real implementation, you would upload the file to your server
    // For now, we'll create a local URL for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (type === "banner") {
        setBannerPreview(result)
        form.setValue("banner", result)
      } else {
        setThumbnailPreview(result)
        form.setValue("thumbnail", result)
      }
    }
    reader.readAsDataURL(file)

    // Simulate API upload

  }

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Check if we need to make an API call (data has changed)
      const hasDataChanged =
        !originalData ||
        JSON.stringify({
          ...originalData,
          start_date: originalData.start_date.toISOString(),
          end_date: originalData.end_date.toISOString(),
          registration_end_date: originalData.registration_end_date.toISOString(),
        }) !==
          JSON.stringify({
            ...data,
            start_date: data.start_date.toISOString(),
            end_date: data.end_date.toISOString(),
            registration_end_date: data.registration_end_date.toISOString(),
          })

      if (!hasDataChanged) {

        setIsSubmitting(false)
        router.push(`/host/create/${eventId}/sponsors`)
        return
      }

      // Determine if we need PUT or PATCH
      const method = !initialData?.id ? "PUT" : "PATCH"
      const url = `/event/organizer/base-event-detail/${eventId}/`

      // Format dates for API
      const formattedData = {
        ...data,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        registration_end_date: data.registration_end_date.toISOString(),
      }

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      })

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }

      const savedData = await response.json()

      // Update context with new data
      setOriginalData(data)
      setSectionData("media", data)

      // Navigate to next section
      router.push(`/host/create/${eventId}/sponsors`)

    } catch (error) {
      console.error("Error saving media details:", error)
 
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    {bannerPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={bannerPreview || "/placeholder.svg"}
                          alt="Banner preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 2MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "banner")
                      }}
                    />
                  </label>
                </div>
                <FormDescription>Banner image for your event page (recommended: 1200×400px)</FormDescription>
              </div>
            </FormItem>

            <FormItem>
              <FormLabel>Thumbnail Image</FormLabel>
              <div className="mt-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                    {thumbnailPreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                          <p className="text-white text-sm">Click to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 1MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "thumbnail")
                      }}
                    />
                  </label>
                </div>
                <FormDescription>Thumbnail for event listings (recommended: 400×400px)</FormDescription>
              </div>
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="about_event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Event</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your event in detail" {...field} rows={5} />
                </FormControl>
                <FormDescription>Detailed description of your event, including goals and highlights</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Event Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Online" id="online" />
                      <Label htmlFor="online">Online</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Offline" id="offline" />
                      <Label htmlFor="offline">Offline</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Hybrid" id="hybrid" />
                      <Label htmlFor="hybrid">Hybrid</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="registration_end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Registration End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>Last date for participants to register</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/additional`)}>
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
