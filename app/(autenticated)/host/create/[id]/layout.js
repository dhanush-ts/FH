import React from "react"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProgressSidebar } from "@/components/event-creation/progress-sidebar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import serverSideFetch from "@/app/service"

export const metadata = {
  title: "Create Event | Dashboard",
  description: "Create and manage your event details",
}

async function getEventData(id) {
  try {
    const res = await serverSideFetch(`/event/organizer/base-event/${id}/`)

    return res
  } catch (error) {
    console.error("Error fetching event data:", error)
    return null
  }
}

export default async function EventCreationLayout({
  children,
  params,
}) {
  const id = (await params).id
  const eventData = await getEventData(id)

  if (!eventData) {
    notFound()
  }

  return (
      <div className="flex min-h-screen flex-col md:flex-row">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
        </main>
        <ProgressSidebar eventId={id} />
      </div>
  )
}
