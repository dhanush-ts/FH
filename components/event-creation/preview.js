"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Mail, Phone, Instagram, Globe, ChevronRight, ExternalLink, ChevronDown } from 'lucide-react'
// import { fetchEventData } from "@/lib/api"
import EventSkeleton from "./event-skeleton"
import { fetchWithAuth } from "@/app/api"
import MarkdownViewer from "./mdviewer"

export default function EventPage({ id }) {
  const [activeSection, setActiveSection] = useState("overview")
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaqId, setOpenFaqId] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch event data
  useEffect(() => {
    const getEventData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchWithAuth(`/event/host/preview/${id}`);
        const data = await response.json();
        setEventData(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching event data:", err)
        setError("Failed to load event data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    getEventData()
  }, [id])

  const sectionRefs = {
    overview: useRef(null),
    prizes: useRef(null),
    schedule: useRef(null),
    sponsors: useRef(null),
    venue: useRef(null),
    faq: useRef(null),
    contact: useRef(null),
  }

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
    })
    setActiveSection(sectionId)
  }

  // Improved scroll and intersection observer for better section detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    // Improved observer options for better accuracy
    const observerOptions = {
      root: null,
      // Adjusted rootMargin to better detect the current section
      rootMargin: "-10% 0px -70% 0px", 
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better accuracy
    }

    const observerCallback = (entries) => {
      // Find the most visible section
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // Sort by visibility ratio to get the most visible section
        const mostVisible = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        )
        
        setActiveSection(mostVisible.target.id)
      }
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all section refs
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    window.addEventListener("scroll", handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [sectionRefs])

  // Show loading state
  if (isLoading) {
    return <EventSkeleton />
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error Loading Event</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Show not found state
  if (!eventData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-800">Event Not Found</h2>
          <p className="mt-2 text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Format dates
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy • h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Group schedule by date
  const scheduleByDate = eventData.timelines?.reduce((acc, event) => {
    const date = format(new Date(event.start_at), "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {}) || {}

  // Sort sponsors by priority
  const sortedSponsors = [...(eventData.sponsers || [])].sort((a, b) => b.priority - a.priority)

  // Check if sections have data
  const hasSchedule = eventData.timelines && eventData.timelines.length > 0
  const hasSponsors = eventData.sponsers && eventData.sponsers.length > 0
  const hasVenue = eventData.venue_detail && (eventData.venue_detail.place || eventData.venue_detail.address || eventData.venue_detail.gmaps_link)
  const hasPrizes = eventData.prizes && eventData.prizes.length > 0
  const hasFaqs = eventData.faqs && eventData.faqs.length > 0
  const hasContact =
    eventData.contact_detail &&
    (eventData.contact_detail.email ||
      eventData.contact_detail.phone ||
      eventData.contact_detail.instagram_url ||
      eventData.contact_detail.other_url)

  // Filter out sections without data
  const availableSections = {
    overview: true, // Always show overview
    schedule: hasSchedule,
    sponsors: hasSponsors,
    venue: hasVenue,
    prizes: hasPrizes,
    faq: hasFaqs,
    contact: hasContact,
  }

  // Fix image URLs
  function fixImageUrl(url){
    if (!url) return "/placeholder.svg"
    return url.replace("localhost", "127.0.0.1")
  }

  // Get event title for SEO
  const eventTitle = eventData.base_event?.title || "Event Details"

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section - Full width banner */}
      <div className="relative m-auto w-full overflow-hidden">
        {/* <div className="max-h-screen inset-0">
          <Image
            src={fixImageUrl(eventData.event_detail?.banner) || "/placeholder.svg?height=600&width=1200"}
            alt={`${eventTitle} banner image`}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            priority
          />
        </div> */}
        <div className="absolute inset-0" />
      </div>
      {/* Event Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-700 py-6 text-white shadow-lg"
      >
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-4">
          {eventData.event_detail?.start_date && eventData.event_detail?.end_date && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <Calendar className="h-6 w-6 text-green-200" aria-hidden="true" />
              <div>
                <p className="text-sm text-green-200">Date</p>
                <p className="font-medium">
                  {format(new Date(eventData.event_detail.start_date), "MMM dd")} -{" "}
                  {format(new Date(eventData.event_detail.end_date), "MMM dd, yyyy")}
                </p>
              </div>
            </motion.div>
          )}

          {eventData.mode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Clock className="h-6 w-6 text-green-200" aria-hidden="true" />
              <div>
                <p className="text-sm text-green-200">Mode</p>
                <p className="font-medium">{eventData.mode}</p>
              </div>
            </motion.div>
          )}

          {eventData.venue_detail && eventData.venue_detail.place && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <MapPin className="h-6 w-6 text-green-200" aria-hidden="true" />
              <div>
                <p className="text-sm text-green-200">Location</p>
                <p className="font-medium">{eventData.venue_detail.place}</p>
              </div>
            </motion.div>
          )}

          {eventData.additional_event_detail && 
           eventData.additional_event_detail.team_min_size && 
           eventData.additional_event_detail.team_max_size && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Users className="h-6 w-6 text-green-200" aria-hidden="true" />
              <div>
                <p className="text-sm text-green-200">Team Size</p>
                <p className="font-medium">
                  {eventData.additional_event_detail.team_min_size} - {eventData.additional_event_detail.team_max_size} Members
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      {/* Main Content with Sidebar */}
      <div className="container px-2 py-12 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={`sticky ${isScrolled ? "top-24" : "top-8"} transition-all duration-300 ease-in-out`}
            >
              <div className="rounded-xl border border-green-200 bg-white px-4 py-2 shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
                <h3 className="ml-2 mt-1 mb-2 text-lg font-semibold text-green-800">Event Sections</h3>
                <nav className="flex flex-col gap-2" aria-label="Event navigation">
                  {Object.keys(sectionRefs).map((section) => {
                    // Skip sections without data
                    if (!availableSections[section]) return null

                    return (
                      <motion.button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`group flex cursor-pointer items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                          activeSection === section ? "bg-green-600 text-white" : "text-gray-600 hover:bg-green-50"
                        }`}
                        aria-current={activeSection === section ? "true" : "false"}
                      >
                        <span className="relative capitalize">{section}</span>
                        <ChevronRight
                          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                            activeSection === section ? "text-white" : "text-gray-400 group-hover:text-green-600"
                          }`}
                          aria-hidden="true"
                        />
                      </motion.button>
                    )
                  })}
                </nav>
              </div>

              {eventData.additional_event_detail && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-2 rounded-xl border border-green-200 bg-white p-4 shadow-lg"
                >
                  <h3 className="mb-2 text-lg font-semibold text-green-800">Registration</h3>
                  <div className="space-y-3">
                    {eventData.event_detail?.registration_end_date && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Calendar className="h-4 w-4 text-green-600" aria-hidden="true" />
                        </span>
                        Registration ends: {formatDate(eventData.event_detail.registration_end_date)}
                      </p>
                    )}

                    {eventData.event_detail.mode && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Clock className="h-4 w-4 text-green-600" aria-hidden="true" />
                        </span>
                        Event type: {eventData.event_detail.mode}
                      </p>
                    )}

                    {eventData.additional_event_detail.team_min_size && eventData.additional_event_detail.team_max_size && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
                        </span>
                        Team size: {eventData.additional_event_detail.team_min_size} - {eventData.additional_event_detail.team_max_size}{" "}
                        members
                      </p>
                    )}

                    {eventData.additional_event_detail.registration_cost && (
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <span className="rounded-full bg-green-100 p-1">
                          <Calendar className="h-4 w-4 text-green-600" aria-hidden="true" />
                        </span>
                        Registration fee: ₹{eventData.additional_event_detail.registration_cost}
                      </p>
                    )}
                  </div>

                  {eventData.additional_event_detail.url && (
                    <a
                      href={eventData.additional_event_detail.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                      aria-label={`Register for ${eventTitle}`}
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Content Sections */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-24">
              {/* Overview Section */}
              <motion.section
                id="overview"
                ref={sectionRefs.overview}
                className="scroll-mt-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6 rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                    {/* Display event banner in overview section */}
                  {/* Logo and basic details */}
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    {eventData.base_event?.logo && (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-white p-1 shadow-md">
                        <Image
                          src={fixImageUrl(eventData.base_event.logo) || "/placeholder.svg"}
                          alt={`${eventTitle} logo`}
                          width={96}
                          height={96}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">{eventData.base_event?.title}</h3>
                      {eventData.base_event?.short_description && (
                        <p className="text-gray-600">{eventData.base_event.short_description}</p>
                      )}
                    </div>
                  </div>
                    {eventData.event_detail?.banner && (
                      <div className="mt-6 overflow-hidden rounded-lg">
                        <Image
                          src={fixImageUrl(eventData.event_detail.banner) || "/placeholder.svg"}
                          alt={`${eventTitle} detailed view`}
                          width={800}
                          height={450}
                          className="w-full object-cover"
                          />
                      </div>
                    )}

                  {/* About event content */}
                  {eventData.event_detail?.about_event && (
                    // <div
                    //   className="prose prose-green max-w-none text-gray-700"
                    //   dangerouslySetInnerHTML={{ __html: eventData.event_detail.about_event }}
                    // />
                    (<MarkdownViewer content={eventData.event_detail.about_event} />) 
                  )}

                </div>
              </motion.section>

                  {hasPrizes && (
                    <motion.section
                      id="prizes"
                      ref={sectionRefs.prizes}
                      className="scroll-mt-8"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                      viewport={{ once: true }}
                    >
                      <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                        Prizes
                      </h2>
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {eventData.prizes.map((prize, index) => (
                          <motion.div
                            key={prize.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                          >
                            {prize.image ? (
                              <div className="relative h-48 w-full bg-green-100">
                                <Image
                                  src={fixImageUrl(prize.image) || "/placeholder.svg"}
                                  alt={`${prize.title || "Prize"} image`}
                                  width={400}
                                  height={200}
                                  className="h-full w-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-4 text-white">
                                  <h3 className="text-xl font-bold">{prize.title}</h3>
                                  {prize.amount && (
                                    <p className="text-lg font-semibold">₹{prize.amount.toLocaleString()}</p>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-green-50">
                                <h3 className="text-xl font-bold text-green-800">{prize.title}</h3>
                                {prize.amount && (
                                  <p className="text-lg font-semibold text-green-700">₹{prize.amount.toLocaleString()}</p>
                                )}
                              </div>
                            )}
                            <div className="p-4">
                              {prize.description && <p className="text-gray-700">{prize.description}</p>}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  )}
              {/* Schedule Section */}
              {hasSchedule && (
                <motion.section
                  id="schedule"
                  ref={sectionRefs.schedule}
                  className="scroll-mt-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                    Schedule
                  </h2>
                  <div className="space-y-8 rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                    {Object.entries(scheduleByDate).map(([date, events], dateIndex) => {
                      const formattedDate = format(new Date(date), "MMMM dd, yyyy")

                      return (
                        <motion.div
                          key={date}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: dateIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="mb-8"
                        >
                          <h3 className="mb-4 inline-block rounded-md bg-green-100 px-3 py-1 text-lg font-semibold text-green-800">
                            {formattedDate}
                          </h3>
                          <div className="space-y-4">
                            {events.map((event, eventIndex) => (
                              <div
                                key={event.id}
                                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                  <div>
                                    <h4 className="font-semibold text-green-700">{event.title}</h4>
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                  </div>
                                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                    {format(new Date(event.start_at), "h:mm a")} -{" "}
                                    {format(new Date(event.end_at), "h:mm a")}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.section>
              )}

              {/* Sponsors Section */}
              {hasSponsors && (
                <motion.section
                  id="sponsors"
                  ref={sectionRefs.sponsors}
                  className="scroll-mt-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                    Sponsors
                  </h2>
                  <div className="rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
                      {sortedSponsors.map((sponsor, index) => (
                        <motion.div
                          key={sponsor.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          whileHover={{ y: -5 }}
                          className="group relative flex h-32 items-center justify-center rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                          {sponsor.logo && (
                            <Image
                              src={fixImageUrl(sponsor.logo) || "/placeholder.svg"}
                              alt={sponsor.name || "Sponsor logo"}
                              width={120}
                              height={120}
                              className="max-h-24 w-auto max-w-full object-contain"
                            />
                          )}

                          {/* Sponsor name tooltip on hover */}
                          {sponsor.name && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-green-600/90 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <p className="text-center text-sm font-medium text-white">{sponsor.name}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Venue Section */}
              {hasVenue && (
                <motion.section
                  id="venue"
                  ref={sectionRefs.venue}
                  className="scroll-mt-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                    Venue
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-green-100 bg-white shadow-lg">
                    {eventData.venue_detail?.gmaps_link && (
                      <div className="aspect-video w-full bg-green-100">
                        <iframe
                          src={eventData.venue_detail.gmaps_link}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="h-full w-full"
                          title={`${eventData.venue_detail.place || "Event"} location map`}
                        ></iframe>
                      </div>
                    )}
                    <div className="p-6">
                      {eventData.venue_detail?.place && (
                        <h3 className="mb-2 text-xl font-semibold text-green-800">{eventData.venue_detail.place}</h3>
                      )}
                      {eventData.venue_detail?.address && (
                        <p className="mb-4 text-gray-700">{eventData.venue_detail.address}</p>
                      )}
                      {eventData.venue_detail?.gmaps_link && (
                        <div className="mb-6 space-y-2">
                          <a
                            href={eventData.venue_detail.gmaps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                            aria-label="Open venue location in Google Maps"
                          >
                            <span>View on Google Maps</span>
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Prizes Section */}

              {/* FAQ Section */}
              {hasFaqs && (
                <motion.section
                  id="faq"
                  ref={sectionRefs.faq}
                  className="scroll-mt-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                    FAQ
                  </h2>
                  <div className="rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                    <div className="space-y-4">
                      {eventData.faqs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
                        >
                          <button
                            onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                            className="flex w-full items-center justify-between p-5 text-left font-semibold text-green-800 hover:bg-green-50"
                            aria-expanded={openFaqId === faq.id ? "true" : "false"}
                            aria-controls={`faq-content-${faq.id}`}
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`h-5 w-5 text-green-600 transition-transform duration-200 ${
                                openFaqId === faq.id ? "rotate-180" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </button>

                          <AnimatePresence>
                            {openFaqId === faq.id && (
                              <motion.div
                                id={`faq-content-${faq.id}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-gray-100 p-5 text-gray-700">{faq.answer}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Contact Section */}
              {hasContact && (
                <motion.section
                  id="contact"
                  ref={sectionRefs.contact}
                  className="scroll-mt-8"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                    Contact
                  </h2>
                  <div className="rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-green-800">Get in Touch</h3>
                        <p className="text-gray-600">
                          Have questions about the event? Feel free to reach out to us using any of the contact methods
                          below.
                        </p>

                        <ul className="space-y-4">
                          {eventData.contact_detail?.email && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Mail className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={`mailto:${eventData.contact_detail.email}`}
                                className="text-gray-700 hover:text-green-600"
                                aria-label={`Email us at ${eventData.contact_detail.email}`}
                              >
                                {eventData.contact_detail.email}
                              </a>
                            </li>
                          )}

                          {eventData.contact_detail?.phone && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Phone className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={`tel:${eventData.contact_detail.phone}`}
                                className="text-gray-700 hover:text-green-600"
                                aria-label={`Call us at ${eventData.contact_detail.phone}`}
                              >
                                {eventData.contact_detail.phone}
                              </a>
                            </li>
                          )}

                          {eventData.contact_detail?.instagram_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Instagram className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={eventData.contact_detail.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600"
                                aria-label="Visit our Instagram page"
                              >
                                Instagram
                              </a>
                            </li>
                          )}

                          {eventData.contact_detail?.other_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Globe className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={eventData.contact_detail.other_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600"
                                aria-label="Visit our website"
                              >
                                Website
                              </a>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="rounded-lg bg-green-50 p-6">
                        <h3 className="mb-4 text-xl font-semibold text-green-800">Send a Message</h3>
                        <form className="space-y-4">
                          <div>
                            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Your name"
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Your email"
                              aria-required="true"
                            />
                          </div>
                          <div>
                            <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
                              Message
                            </label>
                            <textarea
                              id="message"
                              rows={4}
                              className="w-full rounded-md border border-gray-300 p-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                              placeholder="Your message"
                              aria-required="true"
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            aria-label="Send your message"
                          >
                            Send Message
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}