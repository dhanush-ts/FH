import EventPage from "@/components/event-creation/preview"

export const metadata = {
  title: "Preview Details | Create Event",
  description: "Set up the basic details for your event",
}

export default async function PreviewDetailsPage({ params }) {
  const id = (await params).id

  return (
    <div className="mx-auto min-h-screen mb-12">
      <EventPage id={id} />
    </div>
  )
}