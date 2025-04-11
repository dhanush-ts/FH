import serverSideFetch from "@/app/service"
import { VenueForm } from "@/components/event-creation/venue-details"

export const metadata = {
  title: "Venue | Create Event",
  description: "Set up the venue for your event",
}

export default async function VenuePage({ params }) {
  const id = params.id
  const venueDetails = await serverSideFetch(`/event/host/venue-detail/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Venue</h1>
        <p className="mt-2 text-muted-foreground">Provide details about where your event will take place</p>
      </div>

      <VenueForm initialData={venueDetails} eventId={id} />
    </div>
  )
}
