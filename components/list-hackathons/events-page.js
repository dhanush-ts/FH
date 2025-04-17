"use client"

import { useState, useEffect } from "react"
import { HackathonFilters } from "@/components/list-hackathons/hackathon-filters"
import { HackathonList } from "@/components/list-hackathons/hackathon-list"
import { MobileHeader } from "@/components/list-hackathons/mobile-header"
import { SearchInput } from "@/components/list-hackathons/search-input"
import { Pagination } from "@/components/list-hackathons/pagination"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import Head from "next/head"
import { useMediaQuery } from "@/hooks/use-media-query"
import { fetchWithAuth } from "@/app/api"

export default function EventsPage({ searchParams }) {
  const { page, status, type, mode, is_team_event, registration_cost, query } = searchParams || {}
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [eventsData, setEventsData] = useState({ results: [], count: 0, next: null, previous: null })
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Extract search parameters with defaults
  const pagef = typeof page === "string" ? Number.parseInt(page) : 1
  const statusf = typeof status === "string" ? status : undefined
  const typef = typeof type === "string" ? type : undefined
  const modef = typeof mode === "string" ? mode : undefined
  const isTeamEventf = typeof is_team_event === "string" ? is_team_event === "true" : undefined
  const registrationCostf = typeof registration_cost === "string" ? registration_cost === "true" : undefined
  const queryf = typeof query === "string" ? query : undefined

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Build the query URL with only defined parameters
        const queryParams = new URLSearchParams()

        // Always include page parameter
        queryParams.set("page", pagef.toString())

        // Only add other parameters if they are defined
        if (statusf) queryParams.set("status", statusf)
        if (typef) queryParams.set("type", typef)
        if (modef) queryParams.set("mode", modef)
        if (isTeamEventf !== undefined) queryParams.set("is_team_event", isTeamEventf.toString())
        if (registrationCostf !== undefined) queryParams.set("registration_cost", registrationCostf.toString())
        if (queryf) queryParams.set("query", queryf)

        const apiUrl = `/event/list/?${queryParams.toString()}`
        const response = await fetchWithAuth(apiUrl)
        const data = await response.json();
        setEventsData(data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setEventsData({ results: [], count: 0, error: true })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchParams])

  if (isLoading) {
    return <EventSkeleton />
  }

  return (
    <>
      <Head>
        <title>Discover Hackathons & Tech Events | Find Your Next Challenge</title>
        <meta
          name="description"
          content="Browse and filter through the latest hackathons, coding competitions, and tech events. Find opportunities to showcase your skills and connect with the community."
        />
        <meta
          name="keywords"
          content="hackathons, coding competitions, tech events, programming challenges, developer events"
        />
      </Head>

      <div className="container mx-auto py-3 md:py-5 px-3 md:px-8">
        {isMobile ? (
          // Mobile layout with expandable search/filter
          <MobileHeader
            defaultQuery={queryf}
            currentFilters={{
              status: statusf,
              type: typef,
              mode: modef,
              is_team_event: isTeamEventf,
              registration_cost: registrationCostf,
            }}
            isScrolled={isScrolled}
          />
        ) : (
          // Desktop layout with side-by-side search and filters
          <div className="flex flex-col gap-5">
            <div className="flex gap-5 items-start">
              <div
                className={`w-1/4 sticky ${isScrolled ? "top-24" : "top-5"} transition-all duration-300 ease-in-out`}
              >
                <HackathonFilters
                  currentFilters={{
                    status: statusf,
                    type: typef,
                    mode: modef,
                    is_team_event: isTeamEventf,
                    registration_cost: registrationCostf,
                  }}
                />
              </div>

              <div className="w-3/4">
                <div
                  className={`sticky ${isScrolled ? "top-24" : "top-5"} z-30 transition-all duration-300 ease-in-out mb-5`}
                >
                  <SearchInput defaultValue={queryf} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {eventsData.error ? (
                    <div className="bg-white dark:bg-gray-900 rounded-md p-6 text-center shadow-md">
                      <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-3">No Results Found</h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        Try adjusting your filters to find more events.
                      </p>
                    </div>
                  ) : (
                    <>
                      <HackathonList events={eventsData.results} />

                      <div className="mt-6">
                        <Pagination
                          currentPage={pagef}
                          totalPages={Math.ceil((eventsData.count || 0) / 20)}
                          hasNextPage={!!eventsData.next}
                          hasPrevPage={!!eventsData.previous}
                        />
                      </div>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile content area */}
        {isMobile && (
          <div className="mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {eventsData.error ? (
                <div className="bg-white dark:bg-gray-900 rounded-md p-6 text-center shadow-md">
                  <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-3">No Results Found</h2>
                  <p className="text-gray-600 dark:text-gray-300">Try adjusting your filters to find more events.</p>
                </div>
              ) : (
                <>
                  <HackathonList events={eventsData.results} />

                  <div className="mt-6">
                    <Pagination
                      currentPage={pagef}
                      totalPages={Math.ceil((eventsData.count || 0) / 20)}
                      hasNextPage={!!eventsData.next}
                      hasPrevPage={!!eventsData.previous}
                    />
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}

function EventSkeleton() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="container mx-auto py-3 md:py-5 px-3 md:px-5">
      {isMobile ? (
        <>
          <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 p-3 shadow-md">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-md" />
                ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-5 items-start">
          <div className="w-1/4">
            <Skeleton className="h-[500px] w-full rounded-md" />
          </div>

          <div className="w-3/4">
            <Skeleton className="h-12 w-full rounded-md mb-5" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-56 w-full rounded-md" />
                ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Skeleton className="h-10 w-60 rounded-md" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
