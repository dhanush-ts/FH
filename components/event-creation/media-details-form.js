// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import Image from "next/image"
// import { motion } from "framer-motion"
// import {
//   CalendarIcon,
//   Upload,
//   ImageIcon,
//   Calendar,
//   Globe,
//   ArrowRight,
//   ArrowLeft,
//   Sparkles,
//   HelpCircle,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Card } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { fetchWithAuth } from "@/app/api"
// import "@mdxeditor/editor/style.css"
// import { FormWrapper } from "./form-wrapper"
// import { useEventFormContext } from "./event-data-provider"
// import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
// import { MDXEditorTabs } from "../mdx-editor/mdx-editor-tabs"

// export function MediaDetailsForm({ initialData, eventId }) {
//   const [initial, setInitial] = useState(initialData?.id)
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [bannerPreview, setBannerPreview] = useState(null)
//   const [bannerFile, setBannerFile] = useState(null)
//   const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

//   const cachedDataRef = useRef(getCurrentSectionData("media"))

//   const originalDataRef = useRef({
//     banner: initialData?.banner || null,
//     about_event: initialData?.about_event || "",
//     mode: initialData?.mode || "Online",
//     start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
//     end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
//     registration_start_date: initialData?.registration_start_date
//       ? new Date(initialData.registration_start_date)
//       : new Date(),
//     registration_end_date: initialData?.registration_end_date
//       ? new Date(initialData.registration_end_date)
//       : new Date(),
//   })

//   const [markdown, setMarkdown] = useState(() => {
//     return cachedDataRef.current?.about_event || initialData?.about_event || ""
//   })

//   const convertToDateTimeLocal = (date) => {
//     if (!date) return ""
//     const d = new Date(date)
//     return d.toISOString().slice(0, 16)
//   }

//   const form = useForm({
//     defaultValues: {
//       banner: null,
//       about_event: "",
//       mode: cachedDataRef.current?.mode || initialData?.mode || "Online",
//       start_date: convertToDateTimeLocal(cachedDataRef.current?.start_date || initialData?.start_date || new Date()),
//       end_date: convertToDateTimeLocal(cachedDataRef.current?.end_date || initialData?.end_date || new Date()),
//       registration_start_date: convertToDateTimeLocal(
//         cachedDataRef.current?.registration_start_date || initialData?.registration_start_date || new Date(),
//       ),
//       registration_end_date: convertToDateTimeLocal(
//         cachedDataRef.current?.registration_end_date || initialData?.registration_end_date || new Date(),
//       ),
//     },
//   })

//   useEffect(() => {
//     if (cachedDataRef.current?.banner) {
//       setBannerPreview(cachedDataRef.current.banner)
//     } else if (initialData?.banner) {
//       setBannerPreview(initialData.banner)
//     }
//   }, [initialData])

//   const updateFormCache = useRef(null)

//   useEffect(() => {
//     const subscription = form.watch((values) => {

//       if (updateFormCache.current) {
//         clearTimeout(updateFormCache.current)
//       }

//       updateFormCache.current = setTimeout(() => {

//         const currentFormData = {
//           ...values,
//           about_event: markdown,
//         }

//         cacheFormData("media", currentFormData)

//         const changedFields = {}

//         if (bannerFile) {
//           changedFields.banner = bannerFile
//         }

//         if (markdown !== (originalDataRef.current.about_event || "")) {
//           changedFields.about_event = markdown
//         }

//         Object.entries(values).forEach(([key, value]) => {
//           if (key === "banner" || key === "about_event") return

//           if (key.includes("date")) {
//             const originalDate = originalDataRef.current[key]
//             const currentDate = value ? new Date(value) : null

//             if (originalDate && currentDate) {
//               const origDate = originalDate instanceof Date ? originalDate : new Date(originalDate)
//               const currDate = currentDate instanceof Date ? currentDate : new Date(currentDate)

//               const sameDate =
//                 origDate.getFullYear() === currDate.getFullYear() &&
//                 origDate.getMonth() === currDate.getMonth() &&
//                 origDate.getDate() === currDate.getDate() &&
//                 origDate.getHours() === currDate.getHours() &&
//                 origDate.getMinutes() === currDate.getMinutes()

//               if (!sameDate) {
//                 changedFields[key] = value
//               }
//             } else if (originalDate !== currentDate) {
//               changedFields[key] = value
//             }
//           } else if (originalDataRef.current[key] !== value) {
//             changedFields[key] = value
//           }
//         })

//         setChangedFields("media", changedFields)
//         console.log("Changed fields:", changedFields)
//       }, 300) // Debounce for 300ms
//     })

//     return () => {
//       if (updateFormCache.current) {
//         clearTimeout(updateFormCache.current)
//       }
//       subscription.unsubscribe()
//     }
//   }, [form, markdown, bannerFile, cacheFormData, setChangedFields])

//   // Handle markdown changes
//   const handleMarkdownChange = (value) => {
//     setMarkdown(value)
//   }

//   // Handle file upload
//   const handleFileUpload = async (file) => {
//     if (!file) return

//     try {
//       const objectUrl = URL.createObjectURL(file)
//       setBannerPreview(objectUrl)
//       setBannerFile(file)
//       form.setValue("banner", file)
//     } catch (error) {
//       console.error("Error handling file upload:", error)
//     }
//   }

//   // Form submission
//   async function onSubmit(data) {
//     setIsSubmitting(true)

//     try {
//       const formData = new FormData()

//       if (bannerFile) {
//         formData.append("banner", bannerFile)
//       }

//       const formatDateWithTimezone = (dateString) => {
//         if (!dateString) return null

//         const date = new Date(dateString)

//         const tzOffset = date.getTimezoneOffset()
//         const tzOffsetHours = Math.abs(Math.floor(tzOffset / 60))
//         const tzOffsetMinutes = Math.abs(tzOffset % 60)

//         const tzSign = tzOffset <= 0 ? "+" : "-"
//         const tzString = `${tzSign}${tzOffsetHours.toString().padStart(2, "0")}:${tzOffsetMinutes.toString().padStart(2, "0")}`

//         const year = date.getFullYear()
//         const month = (date.getMonth() + 1).toString().padStart(2, "0")
//         const day = date.getDate().toString().padStart(2, "0")
//         const hours = date.getHours().toString().padStart(2, "0")
//         const minutes = date.getMinutes().toString().padStart(2, "0")

//         return `${year}-${month}-${day}T${hours}:${minutes}:00${tzString}`
//       }

//       formData.append("about_event", markdown)
//       formData.append("mode", data.mode)
//       formData.append("start_date", formatDateWithTimezone(data.start_date))
//       formData.append("end_date", data.end_date ? formatDateWithTimezone(data.end_date) : "")
//       formData.append("registration_start_date", formatDateWithTimezone(data.registration_start_date))
//       formData.append("registration_end_date", formatDateWithTimezone(data.registration_end_date))

//       console.log({
//         start_date: formatDateWithTimezone(data.start_date),
//         end_date: data.end_date ? formatDateWithTimezone(data.end_date) : null,
//         registration_start_date: formatDateWithTimezone(data.registration_start_date),
//         registration_end_date: formatDateWithTimezone(data.registration_end_date),
//       })

//       const response = await fetchWithAuth(
//         `/event/host/base-event-detail/${eventId}/`,
//         {
//           method: initial ? "PATCH" : "POST",
//           body: formData,
//         },
//         true,
//       )
//       const result = await response.json()
//       console.log(result)

//       if (!response.ok) {
//         throw new Error(`Failed to save: ${response.status}`)
//       }

//       clearSectionChanges("media-detail")

//       originalDataRef.current = {
//         ...data,
//         about_event: markdown,
//         banner: bannerPreview,
//       }

//       router.push(`/host/create/${eventId}/sponsors`)
//     } catch (error) {
//       console.error("Error saving media details:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <TooltipProvider>
//       <FormWrapper section="media" initialData={originalDataRef.current}>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-20"
//         >
//           <div className="mb-8">
//             <motion.h1
//               className="text-3xl font-bold text-green-800"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//             >
//               Media & Timing
//             </motion.h1>
//             <motion.p
//               className="mt-2 text-green-700"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//             >
//               Set up your event's visual appearance and schedule
//             </motion.p>
//           </div>

//           <Card className="p-6 border-green-100 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.1 }}
//                 >
//                   <FormField
//                     control={form.control}
//                     name="banner"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-green-800 font-medium flex items-center gap-2">
//                           <ImageIcon className="h-4 w-4" />
//                           Event Banner
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-green-800 text-white border-green-700">
//                               <p>
//                                 Upload a high-quality image to represent your event. Recommended size: 1200 x 600 px
//                               </p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </FormLabel>
//                         <FormControl>
//                           <motion.div
//                             whileHover={{ scale: 1.02 }}
//                             className="relative w-full h-48 border-dashed border-2 border-green-300 rounded-lg flex items-center justify-center overflow-hidden bg-green-50"
//                           >
//                             {bannerPreview ? (
//                               <>
//                                 <div className="absolute inset-0 flex items-center justify-center">
//                                   <Image
//                                     src={bannerPreview || "/placeholder.svg"}
//                                     alt="Banner Preview"
//                                     fill
//                                     style={{ objectFit: "cover" }}
//                                     className="z-10"
//                                     onError={(e) => {
//                                       console.error("Image failed to load")
//                                       e.target.style.display = "none"
//                                     }}
//                                   />
//                                 </div>
//                                 <div className="absolute inset-0 bg-black/30 z-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
//                                   <p className="text-white font-medium">Click to change banner</p>
//                                 </div>
//                               </>
//                             ) : (
//                               <div className="flex flex-col items-center justify-center text-green-600">
//                                 <motion.div
//                                   animate={{ y: [0, -5, 0] }}
//                                   transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
//                                 >
//                                   <Upload className="h-10 w-10 mb-2" />
//                                 </motion.div>
//                                 <p className="font-medium">Upload Event Banner</p>
//                                 <p className="text-sm text-green-500 mt-1">Recommended size: 1200 x 600 px</p>
//                               </div>
//                             )}
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => {
//                                 if (e.target.files?.[0]) {
//                                   handleFileUpload(e.target.files[0])
//                                 }
//                               }}
//                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
//                             />
//                           </motion.div>
//                         </FormControl>
//                         <FormDescription className="text-green-600">
//                           {/* This image will be displayed at the top of your event page */}
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.2 }}
//                   className="grid grid-cols-1 gap-6"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="mode"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel className="text-green-800 font-medium flex items-center gap-2">
//                           <Globe className="h-4 w-4" />
//                           Event Mode
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-green-800 text-white border-green-700">
//                               <p>Choose whether your event will be held online or at a physical location</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </FormLabel>
//                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                           <FormControl>
//                             <SelectTrigger className="border-green-200 focus:ring-green-500 transition-all duration-300">
//                               <SelectValue placeholder="Select event mode" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="Online" className="focus:bg-green-50 focus:text-green-900">
//                               <div className="flex items-center gap-2">
//                                 <Globe className="h-4 w-4 text-green-600" />
//                                 <span>Online</span>
//                               </div>
//                             </SelectItem>
//                             <SelectItem value="Offline" className="focus:bg-green-50 focus:text-green-900">
//                               <div className="flex items-center gap-2">
//                                 <Calendar className="h-4 w-4 text-green-600" />
//                                 <span>Offline</span>
//                               </div>
//                             </SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormDescription className="text-green-600">
//                         </FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div>
//                     <FormLabel className="text-green-800 font-medium flex items-center gap-2">
//                       <Calendar className="h-4 w-4" />
//                       Registration Period
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                         </TooltipTrigger>
//                         <TooltipContent className="bg-green-800 text-white border-green-700">
//                           <p>When registration opens and closes for your event</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </FormLabel>
//                     <div className="flex flex-col sm:flex-row gap-2 mt-2">
//                       <div className="relative w-full">
//                         <FormField
//                           control={form.control}
//                           name="registration_start_date"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormControl>
//                                 <div className="relative w-full">
//                                   <input
//                                     type="datetime-local"
//                                     {...field}
//                                     className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                   />
//                                   <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <span className="text-xs text-green-600 block mt-1">Start</span>
//                       </div>
//                       <div className="flex items-center justify-center">
//                         <span className="text-green-600">to</span>
//                       </div>
//                       <div className="relative w-full">
//                         <FormField
//                           control={form.control}
//                           name="registration_end_date"
//                           render={({ field }) => (
//                             <FormItem className="flex-1">
//                               <FormControl>
//                                 <div className="relative w-full">
//                                   <input
//                                     type="datetime-local"
//                                     {...field}
//                                     className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                                   />
//                                   <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
//                                 </div>
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <span className="text-xs text-green-600 block mt-1">End</span>
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.3 }}
//                   className="grid grid-cols-1 md:grid-cols-2 gap-6"
//                 >
//                   <FormField
//                     control={form.control}
//                     name="start_date"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel className="text-green-800 font-medium flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           Start Date & Time
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-green-800 text-white border-green-700">
//                               <p>When your event begins. This will be displayed on your event page.</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative w-full">
//                             <input
//                               type="datetime-local"
//                               {...field}
//                               className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                             />
//                             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="end_date"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel className="text-green-800 font-medium flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           End Date & Time
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-green-800 text-white border-green-700">
//                               <p>When your event concludes. Must be after the start date.</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </FormLabel>
//                         <FormControl>
//                           <div className="relative w-full">
//                             <input
//                               type="datetime-local"
//                               {...field}
//                               className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                             />
//                             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
//                           </div>
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </motion.div>

//                 {/* About Event - MDX Editor with Tabs */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                 >
//                   <FormLabel className="text-green-800 font-medium flex items-center gap-2 mb-2">
//                     <Sparkles className="h-4 w-4" />
//                     About the Event
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
//                       </TooltipTrigger>
//                       <TooltipContent className="bg-green-800 text-white border-green-700">
//                         <p>
//                           Provide detailed information about your event to attract participants. Include key details,
//                           highlights, and what attendees can expect.
//                         </p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </FormLabel>
//                   <div className="border border-green-200 bg-white rounded-md min-h-[200px] focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-1 transition-all duration-300">
//                     <MDXEditorTabs markdown={markdown} onChange={handleMarkdownChange} className="min-h-[200px]" />
//                   </div>
//                   <FormDescription className="text-green-600 mt-2">
//                     Use the tabs to switch between editing markdown and previewing the result
//                   </FormDescription>
//                 </motion.div>

//                 <motion.div
//                   className="flex justify-between space-x-4 pt-4"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: 0.5 }}
//                 >
//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() => router.push(`/host/create/${eventId}/additional`)}
//                       className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 transition-all duration-300 group"
//                     >
//                       <ArrowLeft className="mr-2 h-4 w-4 group-hover:animate-pulse" />
//                       Previous
//                     </Button>
//                   </motion.div>

//                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                     <Button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className="bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group"
//                     >
//                       {isSubmitting ? (
//                         <div className="flex items-center gap-2">
//                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                           <span>Saving...</span>
//                         </div>
//                       ) : (
//                         <>
//                           Save & Continue
//                           <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                         </>
//                       )}
//                     </Button>
//                   </motion.div>
//                 </motion.div>
//               </form>
//             </Form>
//           </Card>
//         </motion.div>
//       </FormWrapper>
//     </TooltipProvider>
//   )
// }

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  CalendarIcon,
  Upload,
  ImageIcon,
  Calendar,
  Globe,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth } from "@/app/api"
import "@mdxeditor/editor/style.css"
import { FormWrapper } from "./form-wrapper"
import { useEventFormContext } from "./event-data-provider"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { MDXEditorTabs } from "../mdx-editor/mdx-editor-tabs"
import { formatForDateTimeInput, formatDateForBackend } from "@/lib/date-utils" // Import the utility functions

export function MediaDetailsForm({ initialData, eventId }) {
  const [initial, setInitial] = useState(initialData?.id)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [bannerFile, setBannerFile] = useState(null)
  const { cacheFormData, setChangedFields, clearSectionChanges, getCurrentSectionData } = useEventFormContext()

  const cachedDataRef = useRef(getCurrentSectionData("media"))

  const originalDataRef = useRef({
    banner: initialData?.banner || null,
    about_event: initialData?.about_event || "",
    mode: initialData?.mode || "Online",
    start_date: initialData?.start_date ? new Date(initialData.start_date) : new Date(),
    end_date: initialData?.end_date ? new Date(initialData.end_date) : new Date(),
    registration_start_date: initialData?.registration_start_date
      ? new Date(initialData.registration_start_date)
      : new Date(),
    registration_end_date: initialData?.registration_end_date
      ? new Date(initialData.registration_end_date)
      : new Date(),
  })

  const [markdown, setMarkdown] = useState(() => {
    return cachedDataRef.current?.about_event || initialData?.about_event || ""
  })

  // Use the formatForDateTimeInput function for datetime-local inputs
  const form = useForm({
    defaultValues: {
      banner: null,
      about_event: "",
      mode: cachedDataRef.current?.mode || initialData?.mode || "Online",
      start_date: formatForDateTimeInput(cachedDataRef.current?.start_date || initialData?.start_date || new Date()),
      end_date: formatForDateTimeInput(cachedDataRef.current?.end_date || initialData?.end_date || new Date()),
      registration_start_date: formatForDateTimeInput(
        cachedDataRef.current?.registration_start_date || initialData?.registration_start_date || new Date(),
      ),
      registration_end_date: formatForDateTimeInput(
        cachedDataRef.current?.registration_end_date || initialData?.registration_end_date || new Date(),
      ),
    },
  })

  useEffect(() => {
    if (cachedDataRef.current?.banner) {
      setBannerPreview(cachedDataRef.current.banner)
    } else if (initialData?.banner) {
      setBannerPreview(initialData.banner)
    }
  }, [initialData])

  const updateFormCache = useRef(null)

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (updateFormCache.current) {
        clearTimeout(updateFormCache.current)
      }

      updateFormCache.current = setTimeout(() => {
        const currentFormData = {
          ...values,
          about_event: markdown,
        }

        cacheFormData("media", currentFormData)

        const changedFields = {}

        if (bannerFile) {
          changedFields.banner = bannerFile
        }

        if (markdown !== (originalDataRef.current.about_event || "")) {
          changedFields.about_event = markdown
        }

        Object.entries(values).forEach(([key, value]) => {
          if (key === "banner" || key === "about_event") return

          if (key.includes("date")) {
            const originalDate = originalDataRef.current[key]
            const currentDate = value ? new Date(value) : null

            if (originalDate && currentDate) {
              const origDate = originalDate instanceof Date ? originalDate : new Date(originalDate)
              const currDate = currentDate instanceof Date ? currentDate : new Date(currentDate)

              const sameDate =
                origDate.getFullYear() === currDate.getFullYear() &&
                origDate.getMonth() === currDate.getMonth() &&
                origDate.getDate() === currDate.getDate() &&
                origDate.getHours() === currDate.getHours() &&
                origDate.getMinutes() === currDate.getMinutes()

              if (!sameDate) {
                changedFields[key] = value
              }
            } else if (originalDate !== currentDate) {
              changedFields[key] = value
            }
          } else if (originalDataRef.current[key] !== value) {
            changedFields[key] = value
          }
        })

        setChangedFields("media", changedFields)
        console.log("Changed fields:", changedFields)
      }, 300) // Debounce for 300ms
    })

    return () => {
      if (updateFormCache.current) {
        clearTimeout(updateFormCache.current)
      }
      subscription.unsubscribe()
    }
  }, [form, markdown, bannerFile, cacheFormData, setChangedFields])

  // Handle markdown changes
  const handleMarkdownChange = (value) => {
    setMarkdown(value)
  }

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return

    try {
      const objectUrl = URL.createObjectURL(file)
      setBannerPreview(objectUrl)
      setBannerFile(file)
      form.setValue("banner", file)
    } catch (error) {
      console.error("Error handling file upload:", error)
    }
  }

  // Form submission
  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      if (bannerFile) {
        formData.append("banner", bannerFile)
      }

      // Use formatDateForBackend to handle timezone correctly
      formData.append("about_event", JSON.stringify(markdown)) // Stringify markdown data
      formData.append("mode", data.mode)
      formData.append("start_date", formatDateForBackend(data.start_date))
      formData.append("end_date", data.end_date ? formatDateForBackend(data.end_date) : "")
      formData.append("registration_start_date", formatDateForBackend(data.registration_start_date))
      formData.append("registration_end_date", formatDateForBackend(data.registration_end_date))

      console.log({
        start_date: formatDateForBackend(data.start_date),
        end_date: data.end_date ? formatDateForBackend(data.end_date) : null,
        registration_start_date: formatDateForBackend(data.registration_start_date),
        registration_end_date: formatDateForBackend(data.registration_end_date),
      })

      const response = await fetchWithAuth(
        `/event/host/base-event-detail/${eventId}/`,
        {
          method: initial ? "PATCH" : "POST",
          body: formData,
        },
        true,
      )
      const result = await response.json()
      console.log(result)

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`)
      }

      clearSectionChanges("media-detail")

      originalDataRef.current = {
        ...data,
        about_event: markdown,
        banner: bannerPreview,
      }

      router.push(`/host/create/${eventId}/sponsors`)
    } catch (error) {
      console.error("Error saving media details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <TooltipProvider>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-800 text-white border-green-700">
                              <p>
                                Upload a high-quality image to represent your event. Recommended size: 1200 x 600 px
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative w-full h-48 border-dashed border-2 border-green-300 rounded-lg flex items-center justify-center overflow-hidden bg-green-50"
                          >
                            {bannerPreview ? (
                              <>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Image
                                    src={bannerPreview || "/placeholder.svg"}
                                    alt="Banner Preview"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="z-10"
                                    onError={(e) => {
                                      console.error("Image failed to load")
                                      e.target.style.display = "none"
                                    }}
                                  />
                                </div>
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
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                            />
                          </motion.div>
                        </FormControl>
                        <FormDescription className="text-green-600">
                          {/* This image will be displayed at the top of your event page */}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 gap-6"
                >
                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Event Mode
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-800 text-white border-green-700">
                              <p>Choose whether your event will be held online or at a physical location</p>
                            </TooltipContent>
                          </Tooltip>
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
                        <FormDescription className="text-green-600"></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel className="text-green-800 font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Registration Period
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-green-800 text-white border-green-700">
                          <p>When registration opens and closes for your event</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <div className="relative w-full">
                        <FormField
                          control={form.control}
                          name="registration_start_date"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative w-full">
                                  <input
                                    type="datetime-local"
                                    {...field}
                                    className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  />
                                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="text-xs text-green-600 block mt-1">Start</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className="text-green-600">to</span>
                      </div>
                      <div className="relative w-full">
                        <FormField
                          control={form.control}
                          name="registration_end_date"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <div className="relative w-full">
                                  <input
                                    type="datetime-local"
                                    {...field}
                                    className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                  />
                                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <span className="text-xs text-green-600 block mt-1">End</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-800 text-white border-green-700">
                              <p>When your event begins. This will be displayed on your event page.</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <input
                              type="datetime-local"
                              {...field}
                              className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                          </div>
                        </FormControl>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="bg-green-800 text-white border-green-700">
                              <p>When your event concludes. Must be after the start date.</p>
                            </TooltipContent>
                          </Tooltip>
                        </FormLabel>
                        <FormControl>
                          <div className="relative w-full">
                            <input
                              type="datetime-local"
                              {...field}
                              className="w-full rounded-md border border-green-200 p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* About Event - MDX Editor with Tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FormLabel className="text-green-800 font-medium flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4" />
                    About the Event
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-green-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-800 text-white border-green-700">
                        <p>
                          Provide detailed information about your event to attract participants. Include key details,
                          highlights, and what attendees can expect.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <div className="border border-green-200 bg-white rounded-md min-h-[200px] focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-1 transition-all duration-300">
                    <MDXEditorTabs markdown={markdown} onChange={handleMarkdownChange} className="min-h-[200px]" />
                  </div>
                  <FormDescription className="text-green-600 mt-2">
                    Use the tabs to switch between editing markdown and previewing the result
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
    </TooltipProvider>
  )
}
