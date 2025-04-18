"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CalendarDays, Users, Award, MapPin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"
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

function HackathonCard({ event, index }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link href={`/hackathon/${event.slug}`} className="block h-full" >
        <Card className="overflow-hidden border-2 hover:border-green-600 dark:hover:border-green-700 transition-colors h-full group relative bg-white dark:bg-gray-900 shadow-sm hover:shadow-md">
          <div className="p-3 flex flex-col h-full">
            <div className="flex items-start gap-3 mb-2">
              <div className="rounded-md bg-white dark:bg-gray-800 p-1 shadow-md flex-shrink-0">
                {event.logo ? (
                  <Image
                    src={event.logo.replace("localhost","127.0.0.1") || "/placeholder.svg"}
                    alt={`${event.title} logo`}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Award className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg md:text-xl line-clamp-1 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                  {event.short_description}
                </p>
              </div>

              {event.is_promoted && (
                <Badge className="bg-green-600 hover:bg-green-700 absolute top-2 right-2 text-xs font-medium">
                  Featured
                </Badge>
              )}
            </div>

            <div className="mt-auto pt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm py-1.5 px-2.5 font-medium"
              >
                <CalendarDays className="h-4 w-4" />
                {formatDate(event.start_date)}
              </Badge>

              <Badge
                variant="outline"
                className={`flex items-center gap-1 text-sm py-1.5 px-2.5 font-medium ${
                  event.mode === "Online"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}
              >
                {event.mode === "Online" ? (
                  <>Online</>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Offline
                  </>
                )}
              </Badge>

              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm py-1.5 px-2.5 font-medium"
              >
                <Users className="h-4 w-4" />
                {event.team_min_size}-{event.team_max_size} members
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
