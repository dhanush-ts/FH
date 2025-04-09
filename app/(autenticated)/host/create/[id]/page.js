import serverSideFetch from "@/app/service"
import { BasicDetailsForm } from "@/components/event-creation/basic-details-form"

export const metadata = {
  title: "Basic Details | Create Event",
  description: "Set up the basic details for your event",
}

async function getEventDetails(id) {
  if (id === "new") return null

  try {
    const res = await serverSideFetch(`/event/organizer/base-event/${id}/`)
    console.log(res)
    return res;
  
  } catch (error) {
    console.error("Error fetching event details:", error)
    return null
  }
}

export default async function BasicDetailsPage({ params }) {
  const id = (await params).id
  const eventDetails = await getEventDetails(id)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Basic Details</h1>
        <p className="mt-2 text-muted-foreground">Set up the fundamental information about your event</p>
      </div>

      <BasicDetailsForm initialData={eventDetails} eventId={id} />
    </div>
  )
}
