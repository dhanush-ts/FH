import serverSideFetch from "@/app/service"
import { ScheduleForm } from "@/components/event-creation/schedule-form"

export const metadata = {
  title: "Schedule | Create Event",
  description: "Set up the schedule for your event",
}

export default async function SchedulePage({ params }) {
  const id = (await params).id
  const timelines = await serverSideFetch(`/event/host/timeline/${id}/`) || [];
  const faq = await serverSideFetch(`/event/host/faq/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">

      <ScheduleForm initialTimeline={timelines} initialFaq={faq} eventId={id} />
    </div>
  )
}