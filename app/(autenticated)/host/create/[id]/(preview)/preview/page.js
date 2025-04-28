import { Metadata } from "next"
import EventPage from "@/components/event-creation/preview"
import serverSideFetch from "@/app/service";

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const id = params.id
  
  try {
      const eventData = await serverSideFetch(`/event/host/preview/${id}`);
      // const eventData = await response.json();
        // setEventData(data)
    
    return {
      title: `${eventData?.base_event?.title || "Event Details"} | Event Platform`,
      description: eventData?.base_event?.short_description || "View event details, schedule, and registration information",
      openGraph: {
        title: eventData?.base_event?.title || "Event Details",
        description: eventData?.base_event?.short_description || "View event details, schedule, and registration information",
        images: eventData?.event_detail?.banner ? [{ url: eventData.event_detail.banner }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: eventData?.base_event?.title || "Event Details",
        description: eventData?.base_event?.short_description || "View event details, schedule, and registration information",
        images: eventData?.event_detail?.banner ? [eventData.event_detail.banner] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Event Details | Event Platform",
      description: "View event details, schedule, and registration information",
    }
  }
}

export default async function EventDetailsPage({ params }) {
  const id = params.id

  return (
    <div className="mx-auto min-h-screen mb-12">
      <EventPage id={id} />
    </div>
  )
}
