import serverSideFetch from "@/app/service"
import { MediaDetailsForm } from "@/components/event-creation/media-details-form"

export const metadata = {
  title: "Media | Create Event",
  description: "Upload media for your event",
}

export default async function MediaPage({ params }) {
  const id = (await params).id
  const eventDetails = await serverSideFetch(`/event/host/base-event-detail/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">

      <MediaDetailsForm initialData={eventDetails} eventId={id} />
    </div>
  )
}
