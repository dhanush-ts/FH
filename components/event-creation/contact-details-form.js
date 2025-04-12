"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields, debounce } from "./utility"
import { HelpCircle, ArrowRight, ArrowLeft, Mail, Phone, User, MapPin } from "lucide-react"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"

export function ContactDetailsForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  // Store initial data in a ref to persist original values
  const originalDataRef = useRef({
    instagram_url: initialData?.instagram_url || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    other_url: initialData?.other_url || "",
  })

  // Get cached data if available
  const cachedData = getCurrentSectionData("contact-detail");
  console.log(cachedData)

  const isInitialEmpty = Object.values(initialData || {}).every((v) => v === null || v === "")

  const form = useForm({
    defaultValues: {
      instagram_url: cachedData.instagram_url || initialData?.instagram_url || "",
      email: cachedData.email || initialData?.email || "",
      phone: cachedData.phone || initialData?.phone || "",
      other_url: cachedData.other_url || initialData?.other_url || "",
    },
  })

  const formValues = form.watch()

  // Create a debounced update function
  const debouncedUpdate = useRef(
    debounce((values) => {
      const changedFields = getChangedFields(originalDataRef.current, values)
      setChangedFields("contact-detail", changedFields)
      cacheFormData("contact-detail", values)
    }, 300),
  ).current

  // Track form changes and update context
  useEffect(() => {
    debouncedUpdate(formValues)
  }, [formValues, debouncedUpdate])

  // Trigger animation after component mounts
  useEffect(() => {
    setAnimateForm(true)
  }, [])

  // Fetch data on component mount
//   useEffect(() => {
//     const fetchContactDetails = async () => {
//       try {
//         const response = await fetchWithAuth(`/event/host/contact-detail/${eventId}/`, {
//           method: "GET",
//         })

//         if (response.ok) {
//           const data = await response.json()

//           // Update form with fetched data
//           form.reset({
//             instagram_url: data.instagram_url || "",
//             email: data.email || "",
//             phone: data.phone || "",
//             other_url: data.other_url || "",
//           })

//           // Update original data reference
//           originalDataRef.current = {
//             instagram_url: data.instagram_url || "",
//             email: data.email || "",
//             phone: data.phone || "",
//             other_url: data.other_url || "",
//           }

//           // Cache the fetched data
//           cacheFormData("contact-detail", data)
//         }
//       } catch (error) {
//         console.error("Error fetching contact details:", error)
//       }
//     }

//     fetchContactDetails()
//   }, [eventId, form, cacheFormData])

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true)

      const method = isInitialEmpty ? "POST" : "PATCH"
      const body = method === "PATCH" ? getChangedFields(originalDataRef.current, data) : data

      if (method === "PATCH" && Object.keys(body).length === 0) {
        setIsSubmitting(false)
        router.push(`/host/create/${eventId}/venue`)
        return
      }

      try {
        const response = await fetchWithAuth(`/event/host/contact-detail/${eventId}/`, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
        
        const data = await response.json()
        console.log(data)
        if (!response.ok) {
          throw new Error(`Failed to save: ${response.status}`)
        }


        // Clear changes after successful save
        clearSectionChanges("contact-detail")

        // Update original data reference
        originalDataRef.current = { ...data }

        router.push(`/host/create/${eventId}/venue`)
      } catch (error) {
        console.error("Error saving contact details:", error)
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
    <FormWrapper section="contact-detail" initialData={originalDataRef.current}>
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
                <Mail className="mr-3 h-8 w-8 text-green-600" />
                Contact Details
              </h1>
              <p className="mt-2 text-green-700 ml-11">Provide contact information for your event</p>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Contact Email
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>Email address for event inquiries</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter contact email"
                              {...field}
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Contact Phone
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>Phone number for event inquiries</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                                type="text"
                              placeholder="Enter contact phone"
                              {...field}
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
                      name="instagram_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Instagram Url
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>The your instagram url for providing updates</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Enter Instagram url link"
                              {...field}
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
                      name="other_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Other links
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>Provide any other social media link</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                                type="url"
                              placeholder="Enter any other social url"
                              {...field}
                              className="border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm"
                            />
                          </FormControl>
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