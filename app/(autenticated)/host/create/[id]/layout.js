import React from "react"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ProgressSidebar } from "@/components/event-creation/progress-sidebar"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import serverSideFetch from "@/app/service"
import { EventFormProvider } from "@/components/event-creation/event-data-provider"
import EventContextWrapper from "@/components/event-creation/event-context"

export const metadata = {
  title: "Create Event | Dashboard",
  description: "Create and manage your event details",
}

export default async function EventCreationLayout({
  children,
  params,
}) {
  const id = (await params).id
  const eventData = await serverSideFetch(`/event/host/base-event/${id}/`);
  console.log(id);

  if (!eventData) {
    notFound()
  }

  return (
    <EventContextWrapper id={id}>
      <EventFormProvider>
        <div className="flex min-h-screen flex-col md:flex-row pb-48 bg-amber-100">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
          </main>
          <div className="bg-blue-50 shadow-md rounded-2xl border mr-24 mt-8">      
            <ProgressSidebar eventId={id} />
          </div>
        </div>
      </EventFormProvider>
    </EventContextWrapper>
  )
}