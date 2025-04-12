"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { format } from "date-fns"
import { motion } from "framer-motion"
import { CalendarIcon, Upload, ImageIcon, Calendar, Globe, ArrowRight, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { fetchWithAuth } from "@/app/api"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import { TimePickerDemo } from "./time-picker"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"

export function MediaDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()
  console.log(bannerPreview)
  const cachedData = getCurrentSectionData(`media`)

  // Initialize editor state from cached data or initial data
  const [editorState, setEditorState] = useState(() => {
    if (cachedData?.about_event) {
      const blocksFromHtml = htmlToDraft(cachedData.about_event)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      return EditorState.createWithContent(contentState)
    } else if (initialData?.about_event) {
      const blocksFromHtml = htmlToDraft(initialData.about_event)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      return EditorState.createWithContent(contentState)
    }
    return EditorState.createEmpty()
  })

  function normalizeHtml(html) {
    return html
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
      .replace(/[\n\r\t]/g, '') // Remove newlines, carriage returns, and tabs
      .trim(); // Remove leading and trailing whitespace
  }
  

  // Store original data for comparison
  const originalDataRef = useRef({
    banner: initialData?.banner || null,
    about_event: initialData?.about_event || "",
    mode: initialData?.mode || "Online",
    start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
    end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
    registration_end_date: initialData?.registration_end_date
      ? new Date(initialData.registration_end_date)
      : new Date(),
  })

  const form = useForm({
    defaultValues: {
      banner: null,
      about_event: cachedData?.about_event || initialData?.about_event || "",
      mode: cachedData?.mode || initialData?.mode || "Online",
      start_date: cachedData?.start_date
        ? new Date(cachedData.start_date)
        : initialData?.start_date
          ? new Date(initialData.start_date)
          : new Date(),
      end_date: cachedData?.end_date
        ? new Date(cachedData.end_date)
        : initialData?.end_date
          ? new Date(initialData.end_date)
          : new Date(),
      registration_end_date: cachedData?.registration_end_date
        ? new Date(cachedData.registration_end_date)
        : initialData?.registration_end_date
          ? new Date(initialData.registration_end_date)
          : new Date(),
    },
  })

  // Watch form values for changes
  const formValues = form.watch()

  // Update context when form values change
  useEffect(() => {
    const currentFormData = {
      ...formValues,
      about_event: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    }

    cacheFormData("media", currentFormData)

    // Calculate changed fields
    const changedFields = {}
    Object.entries(currentFormData).forEach(([key, value]) => {
      if (key === "banner") return // Skip banner comparison

      if (key === "about_event") {
        const normalizedHtml = normalizeHtml(value)
        const normalizedOriginalHtml = normalizeHtml(originalDataRef.current[key])
        if (normalizedHtml !== normalizedOriginalHtml) {
          changedFields[key] = value
        }
      }

      if (originalDataRef.current[key] !== value) {
        if (value instanceof Date && originalDataRef.current[key] instanceof Date) {
          if (value.getTime() !== originalDataRef.current[key].getTime()) {
            changedFields[key] = value
          }
        } else {
          changedFields[key] = value
        }
      }
    })

    if (bannerFile) {
      changedFields.banner = bannerFile
    }
    setChangedFields("media", changedFields)
    console.log("Changed fields:", changedFields.about_event)
    console.log("Cached data:", originalDataRef.current.about_event)
  }, [formValues, editorState, bannerFile, cacheFormData, setChangedFields])

  useEffect(() => {
    if (cachedData?.banner) {
      setBannerPreview(cachedData.banner)
    } else if (initialData?.banner && !bannerPreview) {
      setBannerPreview(initialData.banner)
    }
  }, [initialData, bannerPreview, cachedData])

  const handleFileUpload = async (file) => {
    const objectUrl = URL.createObjectURL(file)
    setBannerPreview(objectUrl)
    setBannerFile(file)
    form.setValue("banner", file)
  }

  async function onSubmit(data) {
    setIsSubmitting(true)
    const aboutHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()))

    try {
      // Prepare form data
      const formData = new FormData()

      // Add banner if changed
      if (bannerFile) {
        formData.append("banner", bannerFile)
      }

      // Add other fields
      formData.append("about_event", aboutHtml)
      formData.append("mode", data.mode)
      formData.append("start_date", data.start_date.toISOString())
      formData.append("end_date", data.end_date.toISOString())
      formData.append("registration_end_date", data.registration_end_date.toISOString())

      const response = await fetchWithAuth(
        `/event/host/base-event-detail/${eventId}/`,
        {
          method: "PATCH",
          body: formData,
        },
        true,
      )
      const k = await response.json()
      console.log(k)

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }

      // Clear changes after successful save
      clearSectionChanges("media-detail")

      // Update original data reference
      originalDataRef.current = {
        ...data,
        about_event: aboutHtml,
        banner: bannerPreview,
      }

      router.push(`/host/create/${eventId}/sponsors`)
    } catch (error) {
      console.error("Error saving media details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const setDateWithTime = (field, date) => {
    const currentDate = form.getValues(field)
    if (date && currentDate) {
      date.setHours(currentDate.getHours())
      date.setMinutes(currentDate.getMinutes())
    }
    form.setValue(field, date)
  }

  const setTimeForDate = (field, time) => {
    form.setValue(field, time)
  }

  return (
    <FormWrapper section="media" initialData={originalDataRef.current}>
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
            Media & Timing
          </motion.h1>
          <motion.p
            className="mt-2 text-green-700"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Set up your event's visual appearance and schedule
          </motion.p>
        </div>

        <Card className="p-6 border-green-100 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Banner Upload */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Event Banner
                      </FormLabel>
                      <FormControl>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative w-full h-48 border-dashed border-2 border-green-300 rounded-lg flex items-center justify-center overflow-hidden bg-green-50"
                        >
                          {bannerPreview ? (
                            <>
                              <Image
                                src={bannerPreview || "/placeholder.svg"}
                                alt="Banner Preview"
                                fill
                                style={{ objectFit: "cover" }}
                                className="z-10"
                              />
                              <div className="absolute inset-0 bg-black/30 z-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white font-medium">Click to change banner</p>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-green-600">
                              <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                              >
                                <Upload className="h-10 w-10 mb-2" />
                              </motion.div>
                              <p className="font-medium">Upload Event Banner</p>
                              <p className="text-sm text-green-500 mt-1">Recommended size: 1200 x 600 px</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleFileUpload(e.target.files[0])
                                field.onChange(e.target.files[0])
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                          />
                        </motion.div>
                      </FormControl>
                      <FormDescription className="text-green-600">
                        This image will be displayed at the top of your event page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Event Mode and Registration End Date in a flex row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Event Mode
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-green-200 focus:ring-green-500 transition-all duration-300">
                            <SelectValue placeholder="Select event mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Online" className="focus:bg-green-50 focus:text-green-900">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-green-600" />
                              <span>Online</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Offline" className="focus:bg-green-50 focus:text-green-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-green-600" />
                              <span>Offline</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-green-600">
                        Choose whether your event will be held online or at a physical location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration_end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Registration End Date & Time
                      </FormLabel>
                      <div className="flex gap-2">
                        <div className="w-3/5">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between border-green-200 hover:bg-green-50 hover:text-green-800 transition-all duration-300",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-green-600" />
                                  <span>{field.value ? format(field.value, "PPP") : "Pick a date"}</span>
                                </div>
                                <CalendarIcon className="h-4 w-4 text-green-600 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => setDateWithTime("registration_end_date", date)}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="rounded-md border border-green-200"
                              />
                            </motion.div>
                          </PopoverContent>
                        </Popover>
                        </div>

                        <TimePickerDemo
                          date={field.value}
                          setDate={(date) => setTimeForDate("registration_end_date", date)}
                          className="w-[80px] flex-shrink-0"
                        />
                      </div>
                      <FormDescription className="text-green-600">
                        The deadline for participants to register for your event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Start Date, End Date */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-2 gap-6"
              >
                <FormField
                  control={form.control}
                  name="start_date"
                  className=""
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-3/5">
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Start Date & Time
                      </FormLabel>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between border-green-200 hover:bg-green-50 hover:text-green-800 transition-all duration-300",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-green-600" />
                                  <span>{field.value ? format(field.value, "PPP") : "Pick a date"}</span>
                                </div>
                                <CalendarIcon className="h-4 w-4 text-green-600 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => setDateWithTime("start_date", date)}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="rounded-md border border-green-200"
                              />
                            </motion.div>
                          </PopoverContent>
                        </Popover>

                        <TimePickerDemo
                          date={field.value}
                          setDate={(date) => setTimeForDate("start_date", date)}
                          className="w-[80px] flex-shrink-0"
                        />
                      </div>
                      <FormDescription className="text-green-600">When your event begins</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-3/5">
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        End Date & Time
                      </FormLabel>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-between border-green-200 hover:bg-green-50 hover:text-green-800 transition-all duration-300",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4 text-green-600" />
                                  <span>{field.value ? format(field.value, "PPP") : "Pick a date"}</span>
                                </div>
                                <CalendarIcon className="h-4 w-4 text-green-600 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => setDateWithTime("end_date", date)}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="rounded-md border border-green-200"
                              />
                            </motion.div>
                          </PopoverContent>
                        </Popover>

                        <TimePickerDemo
                          date={field.value}
                          setDate={(date) => setTimeForDate("end_date", date)}
                          className="w-[80px] flex-shrink-0"
                        />
                      </div>
                      <FormDescription className="text-green-600">When your event concludes</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* About Event */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <FormLabel className="text-green-800 font-medium flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4" />
                  About the Event
                </FormLabel>
                <div className="border border-green-200 bg-white rounded-md p-2 min-h-[200px] focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-1 transition-all duration-300">
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    toolbar={{
                      options: ["inline", "list", "link", "textAlign", "history"],
                      inline: {
                        options: ["bold", "italic", "underline"],
                        bold: { className: "text-green-800" },
                        italic: { className: "text-green-800" },
                        underline: { className: "text-green-800" },
                      },
                      list: {
                        options: ["unordered", "ordered"],
                        unordered: { className: "text-green-800" },
                        ordered: { className: "text-green-800" },
                      },
                    }}
                  />
                </div>
                <FormDescription className="text-green-600 mt-2">
                  Provide detailed information about your event to attract participants
                </FormDescription>
              </motion.div>

              <motion.div
                className="flex justify-between space-x-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/host/create/${eventId}/additional`)}
                    className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300 group"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                    Previous
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
              </motion.div>
            </form>
          </Form>
        </Card>
      </motion.div>
    </FormWrapper>
  )
}
