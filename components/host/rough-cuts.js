import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import serverSideFetch from "@/app/service"

const getVerificationStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-500 text-white"
    case "rejected":
      return "bg-red-500 text-white"
    case "pending":
      return "bg-yellow-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getPublishedStatusColor = (isPublished) => {
  return isPublished ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
}

export default async function RoughCutsPage() {
  let events = []
  try {
    events = await serverSideFetch("/event/organizer/base-event/", {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
    })
  } catch (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <main className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/host/create/${event.id}`}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative rounded-lg border bg-white dark:bg-gray-950"
            >
              <div className="absolute top-0 right-0 z-10">
                <div
                  className={`px-1.5 py-0.5 rounded-tr-md rounded-bl-md text-12 font-medium ${getVerificationStatusColor(event.verification_status)}`}
                >
                  {event.verification_status}
                </div>
              </div>

              <Card className="relative rounded-b-none h-48 overflow-hidden">
                <Image
                  src={event.logo?.replace("localhost", "127.0.0.1") || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
                <div className="absolute bottom-2 left-2">
                  <Badge
                    className={`px-1.5 py-0.5 rounded-md text-[8px] font-medium ${getPublishedStatusColor(event.is_published)}`}
                  >
                    {event.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </Card>

              <CardContent className="p-4">
                <h3 className="font-bold text-lg line-clamp-1 mb-1">{event.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.short_description}</p>
              </CardContent>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium text-muted-foreground">No hackathon events found</h3>
            <p className="mt-2">Create your first hackathon to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
