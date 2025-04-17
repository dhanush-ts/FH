import EventsPage from "@/components/list-hackathons/events-page"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export default function Home({
  searchParams,
}) {
  return (
    <main className="min-h-screen bg-[#f0f4f0]">
      <Suspense fallback={<EventsSkeleton />}>
        <EventsPage searchParams={searchParams} />
      </Suspense>
    </main>
  )
}

function EventsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full max-w-md mx-auto mb-8">
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>

        <div className="md:w-3/4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-lg" />
              ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-60 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
