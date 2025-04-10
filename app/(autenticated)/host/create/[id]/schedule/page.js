import serverSideFetch from "@/app/service"
import { ScheduleForm } from "@/components/event-creation/schedule-form"

export const metadata = {
  title: "Schedule | Create Event",
  description: "Set up the schedule for your event",
}

export default async function SchedulePage({ params }) {
  const id = params.id
  const timelines = await serverSideFetch(`/event/organizer/timeline/${id}/`) || [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <p className="mt-2 text-muted-foreground">Create a timeline of activities for your event</p>
      </div>

      <ScheduleForm initialData={timelines} eventId={id} />
    </div>
  )
}
