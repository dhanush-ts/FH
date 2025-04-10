// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"
// import { fetchWithAuth } from "@/app/api"


// export function AdditionalDetailsForm({
//   initialData,
//   eventId,
// }) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [originalData, setOriginalData] = useState(null)

//   // Use ref to track if we've already set the initial data
//   const initialDataSetRef = useRef(false)

//   // Initialize form with default values or data from API
//   const form = useForm({
//       url: initialData?.url || "",
//       team_min_size: initialData?.team_min_size || 1,
//       team_max_size: initialData?.team_max_size || 4,
//       registration_cost: initialData?.registration_cost || 0
//   })

//   async function onSubmit(data) {
//     setIsSubmitting(true)

//     try {
//       const hasDataChanged = !originalData || JSON.stringify(originalData) !== JSON.stringify(data)

//       if (!hasDataChanged) {
  
//         setIsSubmitting(false)
//         router.push(`/host/create/${eventId}/media`)
//         return
//       }

//       const method = !initialData?.id ? "PUT" : "PATCH"
//       const url = `/event/organizer/additional-event-detail/${eventId}/`

//       const response = await fetchWithAuth(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       console.log(data)

//       if (!response.ok) {
//         throw new Error(`Failed to save: ${response.status}`)
//       }

//       const savedData = await response.json()

//       // Update context with new data
//       setOriginalData(data)
//       setSectionData("additional", data)

//       // Navigate to next section
//       router.push(`/host/create/${eventId}/media`)

//     } catch (error) {
//       console.error("Error saving additional details:", error)
 
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
//             name="url"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Event Website URL</FormLabel>
//                 <FormControl>
//                   <Input placeholder="https://yourevent.com" {...field} />
//                 </FormControl>
//                 <FormDescription>External website for your event (optional)</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="grid gap-6 md:grid-cols-2">
//             <FormField
//               control={form.control}
//               name="team_min_size"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Minimum Team Size</FormLabel>
//                   <FormControl>
//                     <Input type="number" min={1} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="team_max_size"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Maximum Team Size</FormLabel>
//                   <FormControl>
//                     <Input type="number" min={1} {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           <FormField
//             control={form.control}
//             name="registration_cost"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Registration Cost (₹)</FormLabel>
//                 <FormControl>
//                   <Input type="number" min={0} {...field} />
//                 </FormControl>
//                 <FormDescription>Enter 0 for free events</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-between space-x-4 pt-4">
//             <Button type="button" variant="outline" onClick={() => router.push(`/host/create/${eventId}`)}>
//               Previous
//             </Button>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Saving..." : "Save & Continue"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </Card>
//   )
// }

"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { fetchWithAuth } from "@/app/api";
import { getChangedFields } from "./utility";

export function AdditionalDetailsForm({ initialData, eventId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep original data for comparison
  const originalDataRef = useRef({
    url: initialData?.url || "",
    team_min_size: initialData?.team_min_size || 1,
    team_max_size: initialData?.team_max_size || 4,
    registration_cost: initialData?.registration_cost || 0,
  });

  const isInitialEmpty = Object.values(initialData || {}).every(
    (v) => v === null || v === ""
  );

  const form = useForm({
    defaultValues: {
      url: initialData?.url || "",
      team_min_size: initialData?.team_min_size || 1,
      team_max_size: initialData?.team_max_size || 4,
      registration_cost: initialData?.registration_cost || 0,
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);

    const method = isInitialEmpty ? "PUT" : "PATCH";
    const body =
      method === "PATCH" ? getChangedFields(originalDataRef.current, data) : data;

    if (method === "PATCH" && Object.keys(body).length === 0) {
      setIsSubmitting(false);
      router.push(`/host/create/${eventId}/media`);
      return;
    }

    try {
      const response = await fetchWithAuth(
        `/event/organizer/additional-event-detail/${eventId}/`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save: ${response.status}`);
      }

      await response.json();
      router.push(`/host/create/${eventId}/media`);
    } catch (error) {
      console.error("Error saving additional details:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourevent.com" {...field} />
                </FormControl>
                <FormDescription>
                  External website for your event (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="team_min_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team_max_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="registration_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration Cost (₹)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormDescription>Enter 0 for free events</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/host/create/${eventId}`)}
            >
              Previous
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}