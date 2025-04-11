import serverSideFetch from "@/app/service"
import { SponsorsForm } from "@/components/event-creation/sponsors-form"

export const metadata = {
  title: "Sponsors & Prizes | Create Event",
  description: "Add sponsors and prizes for your event",
}

export default async function SponsorsPage({ params }) {
  const id = params.id
  const sponsors = await serverSideFetch(`/event/host/sponser/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sponsors & Prizes</h1>
        <p className="mt-2 text-muted-foreground">Add sponsors and set up prizes for your event</p>
      </div>

      <SponsorsForm initialData={sponsors} eventId={id} />
    </div>
  )
}
