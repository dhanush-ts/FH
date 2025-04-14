import serverSideFetch from "@/app/service"
import { SponsorsForm } from "@/components/event-creation/sponsors-form"

export const metadata = {
  title: "Sponsors & Prizes | Create Event",
  description: "Add sponsors and prizes for your event",
}

export default async function SponsorsPage({ params }) {
  const id = (await params).id;
  const sponsors = await serverSideFetch(`/event/host/sponser/${id}/`) || [];
  const prizes = await serverSideFetch(`/event/host/prize/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <SponsorsForm initialSponsors={sponsors} initialPrizes={prizes} eventId={id} />
    </div>
  )
}
