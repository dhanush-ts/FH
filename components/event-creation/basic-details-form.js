"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields, debounce } from "./utility"
import { Sparkles, ArrowRight, ArrowLeft, Edit, FileText, PenLine } from "lucide-react"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"

export function BasicDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [charCount, setCharCount] = useState(initialData?.short_description?.length || 0)
  const [animateForm, setAnimateForm] = useState(false)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  // Store initial data in a ref to persist original values
  const originalDataRef = useRef({
    title: initialData?.title || "",
    short_description: initialData?.short_description || "",
    event_type: initialData?.event_type || "",
  })

  // Get cached data if available
  const cachedData = getCurrentSectionData(`basic`)

  const form = useForm({
    defaultValues: {
      title: cachedData.title || initialData?.title || "",
      short_description: cachedData.short_description || initialData?.short_description || "",
      event_type: cachedData.event_type || initialData?.event_type || "",
    },
  })

  // Watch the short description field to update character count
  const shortDescription = form.watch("short_description")
  const formValues = form.watch()

  // Create a debounced update function
  const debouncedUpdate = useRef(
    debounce((values) => {
      const changedFields = getChangedFields(originalDataRef.current, values)
      setChangedFields("basic", changedFields)
      cacheFormData("basic", values)
    }, 300),
  ).current

  // Track form changes and update context
  useEffect(() => {
    debouncedUpdate(formValues)
  }, [formValues, debouncedUpdate])

  useEffect(() => {
    setCharCount(shortDescription?.length || 0)
  }, [shortDescription])

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateForm(true)
  }, [])

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true)

      const changes = getChangedFields(originalDataRef.current, data)
      if (Object.keys(changes).length === 0) {
        setIsSubmitting(false)
        router.push(`/host/create/${eventId}/additional`)
        return
      }

      try {
        const response = await fetchWithAuth(`/event/host/base-event/${eventId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
        })

        if (!response.ok) {
          throw new Error(`Failed to save: ${response.status}`)
        }

        await response.json()

        // Clear changes after successful save
        clearSectionChanges("basic")

        // Update original data reference
        originalDataRef.current = { ...data }

        router.push(`/host/create/${eventId}/additional`)
      } catch (error) {
        console.error("Error saving basic details:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [eventId, router, clearSectionChanges],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <FormWrapper section="basic" initialData={originalDataRef.current}>
      <motion.div
        initial="hidden"
        animate={animateForm ? "visible" : "hidden"}
        variants={containerVariants}
        className="mb-20"
      >
        <motion.div className="mb-8" variants={itemVariants}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-3xl font-bold text-green-800 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-green-600" />
              Basic Details
            </h1>
            <p className="mt-2 text-green-700 ml-11">Let's start with the essentials for your event</p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <motion.div
            className="absolute -top-4 -right-4 h-20 w-20 bg-green-100 rounded-full z-0 opacity-70"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <Card className="p-6 border-green-100 shadow-lg bg-white/90 backdrop-blur-sm relative z-10 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-y-20 translate-x-20 z-0"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <motion.div variants={itemVariants}>
                  <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                          <PenLine className="h-4 w-4" />
                          Event Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter event title"
                            {...field}
                            className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                          />
                        </FormControl>
                        <FormDescription className="text-green-600 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />A clear, concise name for your event
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    name="short_description"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                          <Edit className="h-4 w-4" />
                          Short Description
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Briefly describe your event"
                              {...field}
                              rows={3}
                              maxLength={200}
                              className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                              onChange={(e) => {
                                field.onChange(e)
                                setCharCount(e.target.value.length)
                              }}
                            />
                            <motion.span
                              className={`absolute bottom-2 right-2 text-xs ${
                                charCount > 180 ? "text-amber-500" : "text-green-600"
                              }`}
                              animate={charCount > 180 ? { scale: [1, 1.1, 1] } : {}}
                              transition={{ duration: 0.5, repeat: charCount > 180 ? Number.POSITIVE_INFINITY : 0 }}
                            >
                              {charCount}/200
                            </motion.span>
                          </div>
                        </FormControl>
                        <FormDescription className="text-green-600">
                          A short summary that will appear in event listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  className="flex justify-end space-x-4 pt-4"
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/host/dashboard")}
                      className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300 group"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
                      Cancel
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
      </motion.div>
    </FormWrapper>
  )
}
