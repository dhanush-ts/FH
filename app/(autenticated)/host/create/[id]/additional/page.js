import serverSideFetch from "@/app/service"
import { AdditionalDetailsForm } from "@/components/event-creation/addtional-details-form"

export const metadata = {
  title: "Additional Details | Create Event",
  description: "Set up additional details for your event",
}

export default async function AdditionalDetailsPage({ params }) {
  const id = (await params).id
  const additionalDetails = await serverSideFetch(`/event/organizer/additional-event-detail/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Additional Details</h1>
        <p className="mt-2 text-muted-foreground">Provide more specific information about your event</p>
      </div>

      <AdditionalDetailsForm initialData={additionalDetails} eventId={id} />
    </div>
  )
}
