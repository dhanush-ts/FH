"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields } from "./utility"
import { MapPin, Building, LinkIcon, ArrowLeft, CheckCircle2, MapPinned } from "lucide-react"

const venueSchema = z.object({
  place: z.string().min(2, "Venue name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gmaps_link: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
})

export function VenueForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)

  // Store original data for change detection
  const originalDataRef = useRef({
    place: initialData?.place || "",
    address: initialData?.address || "",
    gmaps_link: initialData?.gmaps_link || "",
  })

  const isInitialEmpty = !initialData || Object.values(initialData).every((v) => v === null || v === "")

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      place: initialData?.place || "",
      address: initialData?.address || "",
      gmaps_link: initialData?.gmaps_link || "",
    },
  })

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateForm(true)
  }, [])

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Determine if we need PUT or PATCH
      const method = isInitialEmpty ? "PUT" : "PATCH"
      const url = `/event/host/venue-detail/${eventId}/`

      // Only send changed fields if using PATCH
      const body = method === "PATCH" ? getChangedFields(originalDataRef.current, data) : data

      // If nothing changed, just navigate to the next page
      if (method === "PATCH" && Object.keys(body).length === 0) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push(`/host/dashboard`)
        }, 1500)
        return
      }

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }

      // Show success animation before navigating
      setIsSuccess(true)
      setTimeout(() => {
        router.push(`/host/dashboard`)
      }, 1500)
    } catch (error) {
      console.error("Error saving venue details:", error)
      setIsSubmitting(false)
    }
  }

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
            <MapPinned className="mr-3 h-8 w-8 text-green-600" />
            Venue Details
          </h1>
          <p className="mt-2 text-green-700 ml-11">Set the location information for your event</p>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, times: [0, 0.7, 1] }}
              className="rounded-full bg-green-100 p-6 mb-6"
            >
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl font-bold text-green-800 mb-2"
            >
              Event Setup Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-green-700 max-w-md mb-8"
            >
              Your event has been successfully set up. Redirecting to dashboard...
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="w-64 h-1 bg-green-100 rounded-full overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5 }}
                className="h-full bg-green-500 rounded-full"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
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
                        name="place"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Venue Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Conference Center, University Hall"
                                {...field}
                                className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                              />
                            </FormControl>
                            <FormDescription className="text-green-600">
                              The name of the venue where your event will be held
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Address
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Full address of the venue"
                                {...field}
                                rows={3}
                                className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm resize-none"
                              />
                            </FormControl>
                            <FormDescription className="text-green-600">
                              Provide the complete address to help participants find the venue
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="gmaps_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                              <LinkIcon className="h-4 w-4" />
                              Google Maps Link
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://maps.app.goo.gl/..."
                                {...field}
                                className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                              />
                            </FormControl>
                            <FormDescription className="text-green-600">
                              Add a Google Maps link to make it easier for participants to navigate to your venue
                            </FormDescription>
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
                          onClick={() => router.push(`/host/create/${eventId}/schedule`)}
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
                              Complete Setup
                              <CheckCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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
        )}
      </AnimatePresence>
    </motion.div>
  )
}
