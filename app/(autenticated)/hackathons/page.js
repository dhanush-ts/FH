import EventsPage from "@/components/list-hackathons/events-page"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export const metadata = {
  title: "Discover Hackathons & Tech Events | Find Your Next Challenge",
  description: "Browse and filter through the latest hackathons, coding competitions, and tech events. Find opportunities to showcase your skills and connect with the community.",
  keywords: "hackathons, coding competitions, tech events, programming challenges, developer events",
  openGraph: {
    title: "Discover Hackathons & Tech Events",
    description: "Find your next coding challenge or hackathon. Filter by event type, status, and more.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hackathon Events"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Discover Hackathons & Tech Events",
    description: "Find your next coding challenge or hackathon. Filter by event type, status, and more."
  }
}

export default async function Home({ searchParams }) {
    const data = (await searchParams)
  return (
    <main className="min-h-screen pb-24 bg-[#f8faf8] dark:bg-gray-950">
      <Suspense fallback={<EventsSkeleton />}>
        <EventsPage searchParams={data} />
      </Suspense>
    </main>
  )
}

function EventsSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto mb-6">
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>

        <div className="md:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-md" />
              ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-60 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
