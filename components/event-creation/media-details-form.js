"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Upload, ImageIcon, Clock, Calendar, Globe, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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

export function MediaDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [originalData, setOriginalData] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const [editorState, setEditorState] = useState(() => {
    if (initialData?.about_event) {
      const blocksFromHtml = htmlToDraft(initialData.about_event)
      const { contentBlocks, entityMap } = blocksFromHtml
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap)
      return EditorState.createWithContent(contentState)
    }
    return EditorState.createEmpty()
  })
  const initialDataRef = useRef(false)
  const form = useForm({
    defaultValues: {
      banner: null,
      about_event: initialData?.about_event || "",
      mode: initialData?.mode || "Online",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
      end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
      registration_end_date: initialData?.registration_end_date ? new Date(initialData.registration_end_date) : new Date(),
    },
  })

  useEffect(() => {
    if (initialData?.banner && !bannerPreview) {
      setBannerPreview(initialData.banner)
    }
  }, [initialData, bannerPreview])

  useEffect(() => {
    if (initialData && !initialDataRef.current) {
      const data = {
        about_event: initialData.about_event || "",
        mode: initialData.mode || "Online",
        start_date: initialData.start_date ? new Date(initialData.start_date) : new Date(),
        end_date: initialData.end_date ? new Date(initialData.end_date) : new Date(),
        registration_end_date: initialData.registration_end_date ? new Date(initialData.registration_end_date) : new Date(),
        banner: initialData.banner || null,
      }
      setOriginalData(data)
      initialDataRef.current = true
    }
  }, [initialData])

  const handleFileUpload = async (file) => {
    const objectUrl = URL.createObjectURL(file)
    setBannerPreview(objectUrl)
    setBannerFile(file)
    form.setValue("banner", file)
  }

  function getChangedFields(currentData, aboutHtml) {
    const changed = {}
    if (!originalData) return currentData

    if (aboutHtml !== originalData.about_event) {
      changed.about_event = aboutHtml
    }
    if (currentData.mode !== originalData.mode) {
      changed.mode = currentData.mode
    }
    if (
      currentData.start_date &&
      originalData.start_date &&
      currentData.start_date.toISOString() !== new Date(originalData.start_date).toISOString()
    ) {
      changed.start_date = currentData.start_date
    }
    if (
      currentData.end_date &&
      originalData.end_date &&
      currentData.end_date.toISOString() !== new Date(originalData.end_date).toISOString()
    ) {
      changed.end_date = currentData.end_date
    }
    if (
      currentData.registration_end_date &&
      originalData.registration_end_date &&
      currentData.registration_end_date.toISOString() !== new Date(originalData.registration_end_date).toISOString()
    ) {
      changed.registration_end_date = currentData.registration_end_date
    }
    if (bannerFile) {
      changed.banner = bannerFile
    }
    return changed
  }

  async function onSubmit(data) {
    setIsSubmitting(true)
    const aboutHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()))

    try {
      const changedFields = getChangedFields(data, aboutHtml)
      const isInitialDataEmpty = Object.keys(changedFields).length === 0

      if (isInitialDataEmpty) {
        router.push(`/host/create/${eventId}/sponsors`)
        setIsSubmitting(false)
        return
      }

      const method = originalData ? "PATCH" : "POST"
      const url = `/event/host/base-event-detail/${eventId}/`

      let body, isMultipart

      if ("banner" in changedFields) {
        const formData = new FormData()
        if (bannerFile) formData.append("banner", bannerFile)
        if ("about_event" in changedFields) formData.append("about_event", aboutHtml)
        if ("mode" in changedFields) formData.append("mode", changedFields.mode)
        if ("start_date" in changedFields) formData.append("start_date", changedFields.start_date.toISOString())
        if ("end_date" in changedFields) formData.append("end_date", changedFields.end_date.toISOString())
        if ("registration_end_date" in changedFields)
          formData.append("registration_end_date", changedFields.registration_end_date.toISOString())

        body = formData
        isMultipart = true
      } else {
        const jsonPayload = {}
        if ("about_event" in changedFields) jsonPayload.about_event = aboutHtml
        if ("mode" in changedFields) jsonPayload.mode = changedFields.mode
        if ("start_date" in changedFields) jsonPayload.start_date = changedFields.start_date.toISOString()
        if ("end_date" in changedFields) jsonPayload.end_date = changedFields.end_date.toISOString()
        if ("registration_end_date" in changedFields)
          jsonPayload.registration_end_date = changedFields.registration_end_date.toISOString()

        body = JSON.stringify(jsonPayload)
        isMultipart = false
      }

      const response = await fetchWithAuth(url, { method, body }, isMultipart)
      const text = await response.text()
      try {
        const savedData = JSON.parse(text)
        console.log(savedData)
      } catch (e) {
        console.warn("Non-JSON response:", text)
      }

      if (!response.ok) throw new Error(`Failed to save: ${response.status}`)

      const updatedData = {
        ...originalData,
        ...changedFields,
        about_event: aboutHtml,
        banner: bannerPreview,
      }
      setOriginalData(updatedData)

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
                              transition={{ repeat: Infinity, duration: 2 }}
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-between border-green-200 hover:bg-green-50 hover:text-green-800 transition-all duration-300",
                                !field.value && "text-muted-foreground"
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

                      <TimePickerDemo
                        date={field.value}
                        setDate={(date) => setTimeForDate("registration_end_date", date)}
                        className="w-[140px] flex-shrink-0"
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
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
                                !field.value && "text-muted-foreground"
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
                        className="w-[140px] flex-shrink-0"
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
                  <FormItem className="flex flex-col">
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
                                !field.value && "text-muted-foreground"
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
                        className="w-[140px] flex-shrink-0"
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
  )
}
