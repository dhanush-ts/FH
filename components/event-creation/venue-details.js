// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { fetchWithAuth } from "@/app/api"

// const venueSchema = z.object({
//   place: z.string().min(2, "Venue name must be at least 2 characters"),
//   address: z.string().min(5, "Address must be at least 5 characters"),
//   gmaps_link: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
// })

// export function VenueForm({ initialData, eventId }) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   // Use refs to prevent infinite loops
//   const initialDataRef = useRef(false)
//   const progressUpdateRef = useRef(0)

//   // Initialize form with default values or data from API
//   const form = useForm({
//     resolver: zodResolver(venueSchema),
//     defaultValues: {
//       place: initialData?.place || "",
//       address: initialData?.address || "",
//       gmaps_link: initialData?.gmaps_link || "",
//     },
//   })

//   // Store original data for change detection
//   useEffect(() => {
//     if (initialData && !initialDataRef.current) {
//       const data = {
//         place: initialData.place || "",
//         address: initialData.address || "",
//         gmaps_link: initialData.gmaps_link || "",
//       }
//       setSectionData("venue", data)
//       initialDataRef.current = true
//     }
//   }, [initialData, setSectionData])

//   // Calculate progress based on form completion
//   useEffect(() => {
//     const values = form.getValues()
//     const fields = Object.keys(venueSchema.shape)

//     let filledFields = 0
//     fields.forEach((field) => {
//       if (values[field]?.toString().trim()) {
//         filledFields++
//       }
//     })

//     const progress = Math.round((filledFields / fields.length) * 100)

//     // Only update if progress has changed
//     if (progress !== progressUpdateRef.current) {
//       updateSectionProgress("venue", progress)
//       progressUpdateRef.current = progress
//     }
//   }, [form.watch("place"), form.watch("address"), form.watch("gmaps_link"), updateSectionProgress])

//   async function onSubmit(data) {
//     setIsSubmitting(true)

//     try {
//       // Determine if we need PUT or PATCH
//       const method = !initialData?.id ? "PUT" : "PATCH"
//       const url = `/event/host/venue-detail/${eventId}/`

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         throw new Error(`Failed to save: ${response.status}`)
//       }

//       const savedData = await response.json()

//       // Update context with new data
//       setSectionData("venue", data)

//       // Navigate to completion page or dashboard
//       router.push(`/host/dashboard`)
//     } catch (error) {
//       console.error("Error saving venue details:", error)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="p-6">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="place"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Venue Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="e.g., Conference Center, University Hall" {...field} />
//                 </FormControl>
//                 <FormDescription>The name of the venue where your event will be held</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="address"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Address</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="Full address of the venue" {...field} rows={3} />
//                 </FormControl>
//                 <FormDescription>Provide the complete address to help participants find the venue</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="gmaps_link"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Google Maps Link</FormLabel>
//                 <FormControl>
//                   <Input placeholder="https://maps.app.goo.gl/..." {...field} />
//                 </FormControl>
//                 <FormDescription>
//                   Add a Google Maps link to make it easier for participants to navigate to your venue
//                 </FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-between space-x-4 pt-4">
//             <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/schedule`)}>
//               Previous
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : "Complete Setup"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </Card>
//   )
// }

"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { fetchWithAuth } from "@/app/api"
import { getChangedFields } from "./utility"

const venueSchema = z.object({
  place: z.string().min(2, "Venue name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  gmaps_link: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
})

export function VenueForm({ initialData, eventId }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Store original data for change detection
  const originalDataRef = useRef({
    place: initialData?.place || "",
    address: initialData?.address || "",
    gmaps_link: initialData?.gmaps_link || "",
  })

  const isInitialEmpty = !initialData || Object.values(initialData).every(
    (v) => v === null || v === ""
  )

  // Initialize form with default values or data from API
  const form = useForm({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      place: initialData?.place || "",
      address: initialData?.address || "",
      gmaps_link: initialData?.gmaps_link || "",
    },
  })

  async function onSubmit(data) {
    setIsSubmitting(true)

    try {
      // Determine if we need PUT or PATCH
      const method = isInitialEmpty ? "PUT" : "PATCH"
      const url = `/event/host/venue-detail/${eventId}/`

      // Only send changed fields if using PATCH
      const body = method === "PATCH" 
        ? getChangedFields(originalDataRef.current, data) 
        : data

      // If nothing changed, just navigate to the next page
      if (method === "PATCH" && Object.keys(body).length === 0) {
        router.push(`/host/dashboard`)
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

      // Navigate to completion page or dashboard
      router.push(`/host/dashboard`)
    } catch (error) {
      console.error("Error saving venue details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Conference Center, University Hall" {...field} />
                </FormControl>
                <FormDescription>The name of the venue where your event will be held</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Full address of the venue" {...field} rows={3} />
                </FormControl>
                <FormDescription>Provide the complete address to help participants find the venue</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gmaps_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Maps Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://maps.app.goo.gl/..." {...field} />
                </FormControl>
                <FormDescription>
                  Add a Google Maps link to make it easier for participants to navigate to your venue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}/schedule`)}>
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}
