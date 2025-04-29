"use client"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Users, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { useState, useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"
import { useMediaQuery } from "@/hooks/use-media-query"

export function HackathonList({ events }) {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center rounded-md bg-white dark:bg-gray-900 shadow">
        <h3 className="text-xl font-medium">No hackathons found</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-2"} gap-4`}>
      {events.map((event, index) => (
        <HackathonCard key={event.id} event={event} index={index} />
      ))}
    </div>
  )
}

// Helper to check if registration is closed
const isRegistrationClosed = (endDate) => {
  if (!endDate) return false
  const now = new Date()
  const end = new Date(endDate)
  return now > end
}

function HackathonCard({ event, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [isHovered, setIsHovered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if registration is closed
  const registrationClosed = useMemo(
    () => isRegistrationClosed(event.registration_end_date),
    [event.registration_end_date],
  )

  // Default themes if not provided
  const themes = useMemo(() => {
    const defaultThemes = ["AI", "Machine Learning"]
    if (!event.themes) return defaultThemes
    return Array.isArray(event.themes) ? event.themes : [event.themes]
  }, [event.themes])

  // Default participant count
  const participantCount = event.participant_count || 750

  // Random participants for demo
  const participants = useMemo(() => {
    return [
      { name: "User1", image: "/placeholder.svg?height=40&width=40" },
      { name: "User2", image: "/placeholder.svg?height=40&width=40" },
      { name: "User3", image: "/placeholder.svg?height=40&width=40" },
    ]
  }, [])

  // Format team size
  const teamSizeText = useMemo(() => {
    if (!event.team_min_size && !event.team_max_size) return "Any team size"
    if (event.team_min_size === event.team_max_size) return `${event.team_min_size} members`
    return `${event.team_min_size}-${event.team_max_size} members`
  }, [event.team_min_size, event.team_max_size])

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-300 mt-6 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hackathon label positioned outside the card */}
      <div className="absolute -top-7 left-0 z-10">
        <div className="bg-green-500 text-white font-bold py-1 px-4 text-md rounded-t-md">HACKATHON</div>
        <div className="absolute top-0 right-0 h-full w-5 bg-green-500 rounded-tr-md dark:bg-gray-900 transform translate-x-1/2 skew-x-[30deg]"></div>
      </div>

      <a href={`http://${event.slug}.lvh.me:3000/home`} className="block h-full">
        <Card
          className={`overflow-hidden rounded-tl-none border-3 border-green-300 hover:border-green-500 h-full relative bg-white dark:bg-gray-900 p-0 ${
            isHovered ? "shadow-lg" : "shadow-sm"
          }`}
          style={{
            backgroundImage: isHovered
              ? "linear-gradient(white, white), linear-gradient(to right, #10b981, #3b82f6)"
              : "none",
          }}
        >
          <div className="p-5">
            <div className="mb-4">
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white">{event.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-md">{event.short_description}</p>
            </div>

            {/* Theme and participants in two columns */}
            <div className="flex mb-4">
              {/* Left column - Theme */}
              <div className="flex-1 pr-2">
                <div className="text-sm uppercase font-semibold text-gray-500 dark:text-gray-400 mb-2">Theme</div>
                <div className="flex flex-wrap gap-2">
                  {themes.map((theme, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="bg-amber-50 text-sm dark:bg-amber-900/20 p-2 px-4 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-800 flex items-center gap-1"
                    >
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Right column - Participants */}
              <div className="flex items-end justify-start">
                <div className="flex -space-x-2 mb-1">
                  {participants.map((participant, i) => (
                    <Avatar key={i} className="border-2 border-white dark:border-gray-900 w-8 h-8">
                      <AvatarImage src={participant.image || "/placeholder.svg"} alt={participant.name} />
                      <AvatarFallback>{participant.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-green-500 mb-2 ml-2 dark:text-green-400 font-semibold">{participantCount}+ attendees</div>
              </div>
            </div>

            {/* Info badges */}
            <div className="flex flex-wrap pb-2 gap-2 mb-4">
              <Badge
                variant="outline"
                className="bg-blue-50 dark:bg-blue-900/30 text-sm p-2 px-4 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800"
              >
                {event.mode || "Online"}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center text-sm gap-1 p-2 px-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <CalendarDays className="h-3 w-3" />
                Starts {formatDate(event.start_date)}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center text-sm gap-1 p-2 px-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <Users className="h-3 w-3" />
                {teamSizeText}
              </Badge>
            </div>

            {/* Registration button */}
            <Button
              className={`w-full group`}
              disabled={registrationClosed}
            >
              <span className="mr-1">{registrationClosed ? "Applications Closed" : "Register Now"}</span>
              <span className={`transition-transform ${isHovered && !registrationClosed ? "translate-x-1" : ""}`}>
                →
              </span>
            </Button>
          </div>
        </Card>
      </a>
    </div>
  )
}
