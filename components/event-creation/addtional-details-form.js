"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields, debounce } from "./utility"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, LinkIcon, Users, IndianRupee, ArrowRight, ArrowLeft, Settings } from "lucide-react"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"

export function AdditionalDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  // Keep original data for comparison
  const originalDataRef = useRef({
    url: initialData?.url || "",
    team_min_size: initialData?.team_min_size || 1,
    team_max_size: initialData?.team_max_size || 4,
    registration_cost: initialData?.registration_cost || 0,
    mode: initialData?.mode || "Online",
  })

  // Get cached data if available
  const cachedData = getCurrentSectionData(`additional`)

  const isInitialEmpty = Object.values(initialData || {}).every((v) => v === null || v === "")

  const form = useForm({
    defaultValues: {
      url: cachedData.url || initialData?.url || "",
      team_min_size: cachedData.team_min_size || initialData?.team_min_size || 1,
      team_max_size: cachedData.team_max_size || initialData?.team_max_size || 4,
      registration_cost: cachedData.registration_cost || initialData?.registration_cost || 0,
      mode: cachedData.mode || initialData?.mode || "Online",
    },
  })

  // Watch team size fields to validate
  const minSize = form.watch("team_min_size")
  const maxSize = form.watch("team_max_size")
  const formValues = form.watch()

  // Create a debounced update function
  const debouncedUpdate = useRef(
    debounce((values) => {
      const changedFields = getChangedFields(originalDataRef.current, values)
      setChangedFields("additional", changedFields)
      cacheFormData("additional", values)
    }, 300),
  ).current

  // Track form changes and update context
  useEffect(() => {
    debouncedUpdate(formValues)
  }, [formValues, debouncedUpdate])

  // Validate team sizes
  useEffect(() => {
    if (minSize > maxSize) {
      form.setError("team_max_size", {
        type: "manual",
        message: "Maximum team size must be greater than or equal to minimum team size",
      })
    } else {
      form.clearErrors("team_max_size")
    }
  }, [minSize, maxSize, form])

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateForm(true)
  }, [])

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true)

      const method = isInitialEmpty ? "POST" : "PATCH"
      const body = method === "PATCH" ? getChangedFields(originalDataRef.current, data) : data

      if (method === "PATCH" && Object.keys(body).length === 0) {
        setIsSubmitting(false)
        router.push(`/host/create/${eventId}/media`)
        return
      }

      try {
        const response = await fetchWithAuth(`/event/host/additional-event-detail/${eventId}/`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          throw new Error(`Failed to save: ${response.status}`)
        }

        await response.json()

        // Clear changes after successful save
        clearSectionChanges("additional")

        // Update original data reference
        originalDataRef.current = { ...data }

        router.push(`/host/create/${eventId}/media`)
      } catch (error) {
        console.error("Error saving additional details:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [isInitialEmpty, eventId, router, clearSectionChanges],
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
    <FormWrapper section="additional" initialData={originalDataRef.current}>
      <TooltipProvider delayDuration={300}>
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
                <Settings className="mr-3 h-8 w-8 text-green-600" />
                Additional Details
              </h1>
              <p className="mt-2 text-green-700 ml-11">Provide more specific information about your event</p>
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
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Event Website URL
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://yourevent.com"
                              {...field}
                              className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-green-600">
                            External website for your event (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="team_min_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Minimum Team Size
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-green-800 text-white border-green-700">
                                  <p>The minimum number of participants allowed in a team</p>
                                </TooltipContent>
                              </Tooltip>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                                className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="team_max_size"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Maximum Team Size
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-green-800 text-white border-green-700">
                                  <p>The maximum number of participants allowed in a team</p>
                                </TooltipContent>
                              </Tooltip>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                                className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="registration_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <IndianRupee className="h-4 w-4" />
                            Registration Cost (₹)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                              className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-green-600">Enter 0 for free events</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    className="flex justify-between space-x-4 pt-4"
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/host/create/${eventId}`)}
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
        </motion.div>
      </TooltipProvider>
    </FormWrapper>
  )
}
