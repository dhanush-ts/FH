"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Check, AlertTriangle, Clock, Send } from "lucide-react"
import { fetchWithAuth } from "@/app/api"

const getVerificationStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "verified":
      return "bg-green-500 text-white"
    case "invalid":
      return "bg-red-500 text-white"
    case "in progress":
      return "bg-yellow-500 text-white"
    case "not yet submitted":
    default:
      return "bg-gray-500 text-white"
  }
}

const getVerificationStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case "verified":
      return <Check className="h-3 w-3 mr-1" />
    case "invalid":
      return <AlertTriangle className="h-3 w-3 mr-1" />
    case "in progress":
      return <Clock className="h-3 w-3 mr-1" />
    case "not yet submitted":
    default:
      return <Send className="h-3 w-3 mr-1" />
  }
}

const getPublishedStatusColor = (isPublished) => {
  return isPublished ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
}

export default function RoughCutsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState({})
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useState(() => {
    const fetchEvents = async () => {
      try {
        const resp = await fetchWithAuth("/event/host/base-event/")
        const data = await resp.json()
        setEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleVerify = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: { ...prev[id], verify: true } }))
    try {
      const resp = await fetchWithAuth(`/event/host/base-event/${id}/verify/`, {
        method: "POST",
      })
      if(resp.status === 200) {
        setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === id ? { ...event, verification_status: "In progress" } : event)),
      )
    }
    } catch (error) {
      console.error("Error verifying event:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [id]: { ...prev[id], verify: false } }))
    }
  }

  const handlePublish = async (id) => {
    setLoading((prev) => ({ ...prev, [id]: { ...prev[id], publish: true } }))
    try {
      const resp = await fetchWithAuth(`/event/host/base-event/${id}/publish/`, {
        method: "POST",
      })

      if(resp.status === 200) {

        setEvents((prevEvents) => prevEvents.map((event) => (event.id === id ? { ...event, is_published: true } : event)))
      }
    } catch (error) {
      console.error("Error publishing event:", error)
    } finally {
      setLoading((prev) => ({ ...prev, [id]: { ...prev[id], publish: false } }))
    }
  }

  if (isInitialLoading) {
    return (
      <main className="py-10 w-full px-4 mx-auto">
        <div className="text-center">Loading events...</div>
      </main>
    )
  }

  return (
    <main className="py-10 w-full px-4 mx-auto">
      <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.id}
              className="group block w-full h-auto rounded-xl border bg-white dark:bg-gray-950 hover:shadow-lg transition-all relative overflow-hidden"
            >
              {/* Small Logo top-left as badge */}
              <div className="absolute top-4 left-4 z-10 h-12 w-12 rounded-md overflow-hidden border bg-white dark:bg-gray-900 shadow-sm">
                <Image
                  src={event.logo?.replace("localhost", "127.0.0.1") || "/placeholder.svg"}
                  alt={`${event.title} logo`}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>

              <div className="absolute top-0 right-0 z-10">
                <div
                  className={`px-2 py-0.5 rounded-tr rounded-bl text-xs font-semibold flex items-center ${getVerificationStatusColor(
                    event.verification_status,
                  )}`}
                >
                  {getVerificationStatusIcon(event.verification_status)}
                  {event.verification_status}
                </div>
              </div>

              <Link href={`/host/create/${event.id}`} className="flex h-[160px] pl-20 pr-4 py-4">
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <h2 className="font-semibold text-lg line-clamp-1 mb-1">{event.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.short_description}</p>
                  </div>
                  <div className="mt-2">
                    <Badge
                      className={`px-2 py-0.5 text-[10px] font-medium rounded ${getPublishedStatusColor(
                        event.is_published,
                      )}`}
                    >
                      {event.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
              </Link>

              <div className="p-3 border-t flex justify-end gap-2">
                {event.verification_status.toLowerCase() === "not yet submitted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleVerify(event.id)
                    }}
                    disabled={loading[event.id]?.verify}
                  >
                    {loading[event.id]?.verify ? "Verifying..." : "Verify"}
                  </Button>
                )}
                {event.verification_status.toLowerCase() === "verified" && !event.is_published && (
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handlePublish(event.id)
                    }}
                    disabled={loading[event.id]?.publish}
                  >
                    {loading[event.id]?.publish ? "Publishing..." : "Publish"}
                  </Button>
                )}
              </div>
            </div>
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
