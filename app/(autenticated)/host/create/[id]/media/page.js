import serverSideFetch from "@/app/service"
import { MediaDetailsForm } from "@/components/event-creation/media-details-form"

export const metadata = {
  title: "Media | Create Event",
  description: "Upload media for your event",
}

async function getEventDetails(id) {
  if (id === "new") return null

  try {
    const res = await serverSideFetch(`/event/organizer/base-event-detail/${id}/`)
    return res
  } catch (error) {
    console.error("Error fetching event details:", error)
    return null
  }
}

export default async function MediaPage({ params }) {
  const id = (await params).id
  const eventDetails = await getEventDetails(id)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Media</h1>
        <p className="mt-2 text-muted-foreground">Upload images and add details about your event</p>
      </div>

      <MediaDetailsForm initialData={eventDetails} eventId={id} />
    </div>
  )
}
