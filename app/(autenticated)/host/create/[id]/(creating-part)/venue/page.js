import serverSideFetch from "@/app/service"
import { VenueForm } from "@/components/event-creation/venue-details"

export const metadata = {
  title: "Venue | Create Event",
  description: "Set up the venue for your event",
}

export default async function VenuePage({ params }) {
  const id = params.id
  const venueDetails = (await serverSideFetch(`/event/host/venue-detail/${id}/`)) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <VenueForm initialData={venueDetails} eventId={id} />
    </div>
  )
}
