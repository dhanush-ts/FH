import serverSideFetch from "@/app/service"
import { AdditionalDetailsForm } from "@/components/event-creation/addtional-details-form"

export const metadata = {
  title: "Additional Details | Create Event",
  description: "Set up additional details for your event",
}

export default async function AdditionalDetailsPage({ params }) {
  const id = (await params).id
  const additionalDetails = await serverSideFetch(`/event/host/additional-event-detail/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <AdditionalDetailsForm initialData={additionalDetails} eventId={id} />
    </div>
  )
}