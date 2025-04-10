"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Image from "next/image"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
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
  banner: z.any().optional(),
  about_event: z.string().min(10, "About event must be at least 10 characters"),
  mode: z.enum(["Online", "Offline", "Hybrid"]),
  start_date: z.date(),
  end_date: z.date(),
  registration_end_date: z.date(),
})

export function MediaDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)

  // Use refs to prevent infinite loops
  const initialDataRef = useRef(false)
  const progressUpdateRef = useRef(0)

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(mediaDetailsSchema),
    defaultValues: {
      banner: null,
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
    if (initialData?.banner && !bannerPreview) {
      setBannerPreview(initialData.banner)
    }
  }, [initialData, bannerPreview])

  // Store original data for change detection
  useEffect(() => {
    if (initialData && !initialDataRef.current) {
      const data = {
        banner: initialData.banner || null,
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
      initialDataRef.current = true
    }
  }, [initialData, setSectionData])

  // Calculate progress based on form completion
  useEffect(() => {
    const values = form.getValues()
    const fields = ["about_event", "mode", "start_date", "end_date", "registration_end_date"]

    let filledFields = 0
    fields.forEach((field) => {
      if (values[field]) {
        filledFields++
      }
    })

    // Add banner as a partial field
    if (bannerFile || bannerPreview) {
      filledFields += 0.5
    }

    const progress = Math.round((filledFields / fields.length) * 100)

    // Only update if progress has changed
    if (progress !== progressUpdateRef.current) {
      updateSectionProgress("media", progress)
      progressUpdateRef.current = progress
    }
  }, [
    form.watch("about_event"),
    form.watch("mode"),
    form.watch("start_date"),
    form.watch("end_date"),
    form.watch("registration_end_date"),
    bannerFile,
    bannerPreview,
    updateSectionProgress,
  ])

  // Handle file uploads
  const handleFileUpload = async (file) => {
    // Create a preview URL for the UI
    const objectUrl = URL.createObjectURL(file)
    setBannerPreview(objectUrl)
    setBannerFile(file)
    form.setValue("banner", file)
  }

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Determine if we need PUT or PATCH
      const method = !initialData?.id ? "PUT" : "PATCH"
      const url = `/event/organizer/base-event-detail/${eventId}/`

      // Create FormData for file upload
      const formData = new FormData()

      // Add the banner file if it exists
      if (bannerFile) {
        formData.append("banner", bannerFile)
      }

      // Add other form fields
      formData.append("about_event", data.about_event)
      formData.append("mode", data.mode)
      formData.append("start_date", data.start_date.toISOString())
      formData.append("end_date", data.end_date.toISOString())
      formData.append("registration_end_date", data.registration_end_date.toISOString())

      const response = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
        // Don't set Content-Type header, browser will set it with boundary for FormData
      })

      const savedData = await response.json()

      // if (!response.ok) {
      //   throw new Error(`Failed to save: ${savedData}`)
      // }
      console.log(savedData)


      // Update context with new data
      const updatedData = {
        ...data,
        banner: bannerPreview,
      }
      setOriginalData(updatedData)
      setSectionData("media", updatedData)

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
                      if (file) handleFileUpload(file)
                    }}
                  />
                </label>
              </div>
              <FormDescription>Banner image for your event page (recommended: 1200×400px)</FormDescription>
            </div>
          </FormItem>

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
