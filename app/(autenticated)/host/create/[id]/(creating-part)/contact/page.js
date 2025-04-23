import serverSideFetch from "@/app/service"
import { ContactDetailsForm } from "@/components/event-creation/contact-details-form";

export const metadata = {
  title: "Contact Details | Create Event",
  description: "Set up Contact details for your event",
}

export default async function ContactDetailsPage({ params }) {
  const id = (await params).id
  const additionalDetails = (await serverSideFetch(`/event/host/associated-with/${id}/`)) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <ContactDetailsForm initialData={additionalDetails} eventId={id} />
    </div>
  )
}