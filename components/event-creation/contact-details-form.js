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
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields, debounce } from "./utility"
import {
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  User,
  MapPin,
  FileText,
  Upload,
  Eye,
  Check,
  ChevronsUpDown,
  Building,
  School,
} from "lucide-react"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"
import OtpInput from "../ui/otp"
import { useAuth } from "@/app/providers"

export function ContactDetailsForm({ initialData, eventId }) {
  const { profile } = useAuth()
  const { email: organizerEmail } = profile || {}
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [isSameEmail, setIsSameEmail] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(initialData?.proof_link || null)
  const [organizationType, setOrganizationType] = useState("college") // "college" or "company"
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedOrganization, setSelectedOrganization] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef(null)
  const searchTimeout = useRef(null)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  // Store initial data in a ref to persist original values
  const originalDataRef = useRef({
    organization: initialData?.organization || "",
    organization_id: initialData?.organization_id || null,
    contact_email: initialData?.contact_email || "",
    contact_phone: initialData?.contact_phone || "",
    instagram_url: initialData?.instagram_url || "",
    other_url: initialData?.other_url || "",
    proof: initialData?.proof || null,
  })

  // Get cached data if available
  const cachedData = getCurrentSectionData(`contact-detail`)

  const isInitialEmpty = Object.values(initialData || {}).every((v) => v === null || v === "")
  const isEmailVerified = initialData?.is_contact_email_verified || false

  const form = useForm({
    defaultValues: {
      organization: cachedData.organization || initialData?.organization || "",
      organization_id: cachedData.organization_id || initialData?.organization_id || null,
      contact_email: cachedData.contact_email || initialData?.contact_email || "",
      contact_phone: cachedData.contact_phone || initialData?.contact_phone || "",
      instagram_url: cachedData.instagram_url || initialData?.instagram_url || "",
      other_url: cachedData.other_url || initialData?.other_url || "",
    },
  })

  const formValues = form.watch()
  const contactEmail = form.watch("contact_email")

  // Effect to handle the same email checkbox
  useEffect(() => {
    if (isSameEmail && organizerEmail) {
      form.setValue("contact_email", organizerEmail)
    }
  }, [isSameEmail, organizerEmail, form])

  // Create a debounced update function
  const debouncedUpdate = useRef(
    debounce((values) => {
      const changedFields = getChangedFields(originalDataRef.current, values)
      setChangedFields("contact-detail", changedFields)
      cacheFormData("contact-detail", values)
    }, 300),
  ).current

  useEffect(() => {
    debouncedUpdate(formValues)
  }, [formValues, debouncedUpdate])

  useEffect(() => {
    setAnimateForm(true)
  }, [])

  // Initialize selected organization if we have initial data
  useEffect(() => {
    if (initialData?.organization && initialData?.organization_id) {
      setSelectedOrganization({
        id: initialData.organization_id,
        name: initialData.organization,
        location: initialData.location || "",
      })
    }
  }, [initialData])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)

      // Create a preview URL for the file
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleRequestEmailChange = () => {
    form.setValue("contact_email", "")
    const emailField = document.querySelector('input[name="contact_email"]')
    if (emailField) {
      emailField.disabled = false
      emailField.focus()
    }

    // Create a save button that will appear next to the input
    const saveButton = document.createElement("button")
    saveButton.textContent = "Save"
    saveButton.className = "px-3 py-1 bg-green-600 text-white rounded text-sm ml-2"
    saveButton.onclick = (e) => {
      e.preventDefault()
      const newEmail = form.getValues("contact_email")
      if (newEmail) {
        fetchWithAuth(`/event/host/associated-with/${eventId}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ contact_email: newEmail }),
        }).then(async (response) => {
          const responseData = await response.json()
          if (!responseData.is_contact_email_verified) {
            setShowOtp(true)
          }
          saveButton.remove()
        })
      }
    }

    const emailContainer = emailField.parentElement.parentElement
    emailContainer.appendChild(saveButton)
  }

  const verifyEmail = async () => {
    try {
      const response = await fetchWithAuth(`/event/host/associated-with/${eventId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: otpValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Failed to verify: ${response.status}`)
      }

      if (data.is_contact_email_verified) {
        setShowOtp(false)
        router.push(`/host/create/${eventId}/data`)
      }
    } catch (error) {
      console.error("Error verifying email:", error)
    }
  }

  const searchOrganizations = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const endpoint =
        organizationType === "college"
          ? `/common/dropdown/colleges/?q=${encodeURIComponent(query)}`
          : `/common/dropdown/companies/?q=${encodeURIComponent(query)}`

      const response = await fetchWithAuth(endpoint, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`Failed to search: ${response.status}`)
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching organizations:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchInputChange = (value) => {
    setSearchQuery(value)

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Set new timeout to debounce API calls
    searchTimeout.current = setTimeout(() => {
      searchOrganizations(value)
    }, 300)
  }

  const handleOrganizationSelect = (organization) => {
    setSelectedOrganization(organization)
    form.setValue("organization", organization.name)
    form.setValue("organization_id", organization.id)
    setIsSearchOpen(false)
  }

  const handleOrganizationTypeChange = (value) => {
    setOrganizationType(value)
    setSearchQuery("")
    setSearchResults([])
    setSelectedOrganization(null)
    form.setValue("organization", "")
    form.setValue("organization_id", null)
  }

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true)

      try {
        // Create FormData for file upload
        const formData = new FormData()

        // Add form fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (
            value !== "" &&
            value !== null &&
            key !== "contact_email" &&
            (!isInitialEmpty || key !== "contact_email")
          ) {
            formData.append(key, value)
          }
        })

        // Only include contact_email in the initial POST request
        if (isInitialEmpty && contactEmail) {
          formData.append("contact_email", contactEmail)
        }

        // Add organization_id if selected
        if (selectedOrganization) {
          formData.append("organization_id", selectedOrganization.id.toString())
        }

        // Add file if selected
        if (selectedFile) {
          formData.append("proof", selectedFile)
        }

        const method = isInitialEmpty ? "POST" : "PATCH"

        // If it's a PATCH request and there are no changes, just navigate
        if (
          method === "PATCH" &&
          Object.keys(getChangedFields(originalDataRef.current, data)).length === 0 &&
          !selectedFile
        ) {
          setIsSubmitting(false)
          clearSectionChanges("contact-detail")
          router.push(`/host/create/${eventId}/venue`)
          return
        }

        const response = await fetchWithAuth(
          `/event/host/associated-with/${eventId}/`,
          {
            method,
            body: formData, // No Content-Type header for FormData
          },
          true,
        )

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(`Failed to save: ${response.status}`)
        }

        // Clear changes after successful save
        clearSectionChanges("contact-detail")

        // Update original data reference
        originalDataRef.current = { ...responseData }

        // Show OTP field if it's the first submission and email is not verified
        if (isInitialEmpty && !isSameEmail && !responseData.is_contact_email_verified) {
          setShowOtp(true)
        } else {
          router.push(`/host/create/${eventId}/venue`)
        }
      } catch (error) {
        console.error("Error saving associated with details:", error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [
      isInitialEmpty,
      eventId,
      router,
      clearSectionChanges,
      selectedFile,
      contactEmail,
      isSameEmail,
      selectedOrganization,
    ],
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

  useEffect(() => {
    setChangedFields("contact-detail", getChangedFields(originalDataRef.current, formValues))
    console.log(getChangedFields(originalDataRef.current, formValues))
  }, [formValues])

  return (
    <FormWrapper section="associated-with" initialData={originalDataRef.current}>
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
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-green-800 flex items-center">
                  <User className="mr-3 h-8 w-8 text-green-600" />
                  Organization Details
                </h1>
                <p className="mt-2 text-green-700 ml-11">Provide information about your organization</p>
              </div>
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
                    <div className="space-y-4">
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Organization Type
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-green-800 text-white border-green-700">
                            <p>Select the type of organization</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <RadioGroup
                        value={organizationType}
                        onValueChange={handleOrganizationTypeChange}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="college" id="college" />
                          <label htmlFor="college" className="flex items-center gap-1 cursor-pointer">
                            <School className="h-4 w-4" />
                            College
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="company" id="company" />
                          <label htmlFor="company" className="flex items-center gap-1 cursor-pointer">
                            <Building className="h-4 w-4" />
                            Company
                          </label>
                        </div>
                      </RadioGroup>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {organizationType === "college" ? "College Name" : "Company Name"}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>Search and select your {organizationType}</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <div>
                            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={isSearchOpen}
                                  disabled={initialData?.locked_fields?.includes("organization")}
                                  className={`w-full justify-between border-green-200 text-left font-normal ${
                                    initialData?.locked_fields?.includes("organization")
                                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  {selectedOrganization?.name
                                    ? selectedOrganization.name
                                    : initialData?.organization
                                      ? initialData.organization
                                      : `Search for a ${organizationType === "college" ? "college" : "company"}...`}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[400px] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder={`Search ${organizationType}...`}
                                    value={searchQuery}
                                    onValueChange={handleSearchInputChange}
                                    className="h-9"
                                  />
                                  <CommandList>
                                    {isSearching && (
                                      <div className="py-6 text-center text-sm">
                                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                                        <p className="mt-2 text-muted-foreground">Searching...</p>
                                      </div>
                                    )}
                                    {!isSearching && (
                                      <CommandEmpty>
                                        {searchQuery.length < 2
                                          ? "Type at least 2 characters to search"
                                          : "No results found"}
                                      </CommandEmpty>
                                    )}
                                    <CommandGroup>
                                      {searchResults.map((item) => (
                                        <CommandItem
                                          key={item.id}
                                          value={item.name}
                                          onSelect={() => handleOrganizationSelect(item)}
                                          className="flex flex-col items-start py-2"
                                        >
                                          <div className="flex w-full items-center">
                                            <span>{item.name}</span>
                                            {selectedOrganization?.id === item.id && (
                                              <Check className="ml-auto h-4 w-4 text-green-500" />
                                            )}
                                          </div>
                                          {item.location && (
                                            <span className="text-xs text-muted-foreground">{item.location}</span>
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <input type="hidden" {...field} value={selectedOrganization?.name || ""} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Proof Document
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-green-800 text-white border-green-700">
                            <p>Upload a document as proof of your organization</p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <div className="flex flex-col gap-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerFileInput}
                          className="border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          {previewUrl ? "Change Document" : "Upload Document"}
                        </Button>

                        {previewUrl && (
                          <div className="mt-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-700">Document uploaded</span>
                            {previewUrl && (
                              <a
                                href={previewUrl.replace("127.0.0.1", "localhost")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" /> View
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {!isEmailVerified && (
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center space-x-2 mb-4">
                        <Checkbox id="same-email" checked={isSameEmail} onCheckedChange={setIsSameEmail} />
                        <label
                          htmlFor="same-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Use organizer email ({organizerEmail || "Not available"})
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="contact_email"
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
                            {isEmailVerified && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </FormLabel>
                          <div className="flex gap-2 items-center">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Enter contact email"
                                {...field}
                                disabled={
                                  isEmailVerified ||
                                  isSameEmail ||
                                  initialData?.locked_fields?.includes("contact_email")
                                }
                                className={`border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm ${
                                  isEmailVerified ||
                                  isSameEmail ||
                                  initialData?.locked_fields?.includes("contact_email")
                                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                    : ""
                                }`}
                              />
                            </FormControl>
                            {!isInitialEmpty &&
                              (isEmailVerified ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={handleRequestEmailChange}
                                  className="whitespace-nowrap"
                                >
                                  Request Change
                                </Button>
                              ) : (
                                contactEmail &&
                                !showOtp && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      fetchWithAuth(`/event/host/associated-with/${eventId}/`, {
                                        method: "PATCH",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ contact_email: contactEmail }),
                                      }).then(async (response) => {
                                        const responseData = await response.json()
                                        if (!responseData.is_contact_email_verified) {
                                          setShowOtp(true)
                                        }
                                      })
                                    }}
                                    className="whitespace-nowrap"
                                  >
                                    Verify
                                  </Button>
                                )
                              ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {showOtp && (
                    <motion.div variants={itemVariants} className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="text-green-800 font-medium mb-3">Email Verification</h3>
                      <p className="text-sm text-green-700 mb-4">
                        A verification code has been sent to your email. Please enter it below to verify your email
                        address.
                      </p>
                      <div className="flex flex-col items-center gap-4">
                        <OtpInput length={6} value={otpValue} onChange={setOtpValue} />
                        <Button
                          type="button"
                          onClick={verifyEmail}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Verify Email
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="contact_phone"
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
                              disabled={initialData?.locked_fields?.includes("contact_phone")}
                              className={`border-green-200 focus-visible:ring-green-500 transition-all duration-300 shadow-sm ${
                                initialData?.locked_fields?.includes("contact_phone")
                                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                  : ""
                              }`}
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
                            Instagram URL
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-green-800 text-white border-green-700">
                                <p>Your Instagram URL for providing updates</p>
                              </TooltipContent>
                            </Tooltip>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Enter Instagram URL"
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
                            Other Links
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
                              placeholder="Enter any other social URL"
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
