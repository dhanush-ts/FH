import serverSideFetch from "@/app/service"
import { BasicDetailsForm } from "@/components/event-creation/basic-details-form"

export const metadata = {
  title: "Basic Details | Create Event",
  description: "Set up the basic details for your event",
}

async function getEventDetails(id) {
  if (id === "new") return null

  try {
    const res = await serverSideFetch(`/event/host/base-event/${id}/`)
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
      <BasicDetailsForm initialData={eventDetails} eventId={id} />
    </div>
  )
}
