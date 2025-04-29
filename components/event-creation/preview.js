"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  Instagram,
  Globe,
  ChevronRight,
  ExternalLink,
  ChevronDown,
} from "lucide-react"
// import { fetchEventData } from "@/lib/api"
import EventSkeleton from "./event-skeleton"
import { fetchWithAuth } from "@/app/api"
import MarkdownViewer from "./mdviewer"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function EventPage({ plin }) {
  const [activeSection, setActiveSection] = useState("overview")
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaqId, setOpenFaqId] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Define media query breakpoints outside the component
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Fetch event data
  useEffect(() => {
    const getEventData = async () => {
      try {
        setIsLoading(true)
        const response = await fetchWithAuth(plin)
        const data = await response.json();
        // const data = {
        //   base_event: {
        //     id: "da0c0997-fade-43ba-99d2-78580cea12de",
        //     is_promoted: true,
        //     title: "Smart India Hackathon",
        //     logo: "http://localhost:8000/media/event/logo/images_ZF2EoKh.jpeg",
        //     type: "Hackathon",
        //     slug: "smart-india-hackathon",
        //     short_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
        //   },
        //   event_detail: {
        //     banner: "http://localhost:8000/media/event/banner/images_Zema3oL.jpeg",
        //     about_event:
        //       '<div><p><span>A unique case study competition where participants analyze a founder’s company website and propose innovative new product lines. Get a chance to present your ideas to a renowned founder!</span></p>\r\n<p><span>InnovQuest is a case study competition aimed at fostering innovation, creativity, and entrepreneurship among students.</span><span><br></span><span> Students will form teams of </span>2-4 members (cross-college teams allowed) and analyze the website of a company founded by a renowned entrepreneur. They will identify potential new product lines and submit a 8-slide presentation explaining their ideas. Shortlisted teams will present their proposals in person to the founder.</p>\r\n<p><strong>Guidelines:</strong></p>\r\n<ul>\r\n<li>Open to undergraduate students from any institution.</li>\r\n<li>Teams of 2-4 members.</li>\r\n<li><span>Cross-college teams are allowed.</span></li>\r\n<li>The final round will be conducted on campus.</li>\r\n<li><strong>Note:</strong> Once the first round goes live, the name of the founder and their startup will be revealed in the "About" section of the competition.</li>\r\n<li>After the founder and startup are revealed, teams can begin working on their presentation (PPT) and must upload it before the submission deadline.</li>\r\n</ul>\r\n<p><strong>Rules:</strong></p>\r\n<ul>\r\n<li><span>All teams are requested to carry their college ID cards on the day of the event.</span></li>\r\n<li><span>Adherence to time limits and event rules is mandatory.</span></li>\r\n<li><span>Exciting prizes and certificates for top-performing teams.</span></li>\r\n<li><span>Judging will be solely based on panel evaluation.</span></li>\r\n<li><span>Selected teams will be informed via phone call or email.</span></li>\r\n<li>Dress code for the offline rounds is Business Casuals or Smart Casuals.</li>\r\n</ul>\r\n<p><strong>Important Dates:</strong></p>\r\n<ul>\r\n<li>Prelims: 18th April 2025 (Online)</li>\r\n<li>Finals: 22nd April 2025 (On-Campus)[tentative]</li>\r\n</ul>\r\n<p><strong>Submission Format</strong></p>\r\n<ul>\r\n<li><span>File type: .PPTX or PDF</span></li>\r\n<li><span>Must include: Introduction slide and Thank You slide</span></li>\r\n<li><span>Max slides: 8</span></li>\r\n<li><span>Naming convention: TeamName_CollegeName</span></li>\r\n</ul></div>',
        //     mode: "Online",
        //     start_date: "2025-05-10T00:00:00+05:30",
        //     end_date: "2025-05-11T00:00:00+05:30",
        //     registration_start_date: "2025-04-15T20:56:02+05:30",
        //     registration_end_date: "2025-04-20T00:00:00+05:30",
        //   },
        //   sponsers: [
        //     {
        //       name: "Google",
        //       logo: "http://localhost:8000/media/event/sponser/first_prize.png",
        //       priority: 10,
        //     },
        //   ],
        //   venue_detail: null,
        //   additional_event_detail: {
        //     url: null,
        //     file: null,
        //     team_min_size: 1,
        //     team_max_size: 5,
        //     registration_cost: null,
        //   },
        //   timelines: [
        //     {
        //       title: "Round 2 - PPT",
        //       description:
        //         "lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
        //       start_at: "2025-04-11T09:30:00+05:30",
        //       end_at: "2025-04-11T10:30:00+05:30",
        //     },
        //   ],
        //   associated_with: {
        //     organization: "Aditi Vikas Ayurved Nursing Training Centre, Sikar",
        //     proof_link: null,
        //     proof: "http://localhost:8000/media/event/proof/dummy_ZjMvmwp.pdf",
        //     contact_email: "santhoshp.official@gmail.com",
        //     is_contact_email_verified: true,
        //     contact_phone: "9876543210",
        //     instagram_url: "https://www.instagram.com/mahi7781/?hl=en",
        //     other_url: null,
        //   },
        //   faqs: [
        //     {
        //       question: "What is the mode of the hackathon?",
        //       answer: "Round 1 is online and Round 2 is offline",
        //       priority: 10,
        //     },
        //   ],
        //   prizes: [
        //     {
        //       title: "Winners",
        //       description: "winner of each domain",
        //       amount: 10000,
        //       image: "http://localhost:8000/media/event/prize/first_prize_mshy8SH.png",
        //       priority: 3,
        //     },
        //   ],
        //   registration_detail: {
        //     is_eligible: false,
        //     not_eligible_reason: "Organizer can't register",
        //     is_registered: null,
        //   },
        // }
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
  }, [plin])

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
      const visibleEntries = entries.filter((entry) => entry.isIntersecting)

      if (visibleEntries.length > 0) {
        // Sort by visibility ratio to get the most visible section
        const mostVisible = visibleEntries.reduce((prev, current) =>
          prev.intersectionRatio > current.intersectionRatio ? prev : current,
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
  const scheduleByDate =
    eventData.timelines?.reduce((acc, event) => {
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
  const hasVenue =
    eventData.venue_detail &&
    (eventData.venue_detail.place || eventData.venue_detail.address || eventData.venue_detail.gmaps_link)
  const hasPrizes = eventData.prizes && eventData.prizes.length > 0
  const hasFaqs = eventData.faqs && eventData.faqs.length > 0
  const hasContact =
    eventData.associated_with &&
    (eventData.associated_with.email ||
      eventData.associated_with.phone ||
      eventData.associated_with.instagram_url ||
      eventData.associated_with.other_url)

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
  function fixImageUrl(url) {
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
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                      {eventData.additional_event_detail.team_min_size} -{" "}
                      {eventData.additional_event_detail.team_max_size} Members
                    </p>
                  </div>
                </motion.div>
              )}
          </div>
        </div>
      </motion.div>
      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-12 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar - Only visible on desktop and tablet */}
          
            <div className="w-full lg:w-1/4 md:w-1/3 hidden lg:block">
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

                      {eventData.additional_event_detail.team_min_size &&
                        eventData.additional_event_detail.team_max_size && (
                          <p className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="rounded-full bg-green-100 p-1">
                              <Users className="h-4 w-4 text-green-600" aria-hidden="true" />
                            </span>
                            Team size: {eventData.additional_event_detail.team_min_size} -{" "}
                            {eventData.additional_event_detail.team_max_size} members
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
                    <div className="relative group">
                      <button
                        href={eventData.additional_event_detail.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                          eventData.registration_detail?.is_eligible === false
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        } text-white`}
                        disabled={eventData.registration_detail?.is_eligible === false}
                        aria-label={`Register for ${eventTitle}`}
                      >
                        Register Now
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </button>
                      {eventData.registration_detail?.is_eligible === false &&
                        eventData.registration_detail?.not_eligible_reason && (
                          <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 transform rounded-md bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            {eventData.registration_detail.not_eligible_reason}
                            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 transform bg-gray-800"></div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

          {/* Content Sections - Adjust width based on screen size */}
          <div className={`w-full ${!isMobile ? "lg:w-3/4" : ""}`}>
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
                    <MarkdownViewer content={eventData.event_detail.about_event} />
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
                          key={dateIndex}
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
                          {eventData.associated_with?.email && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Mail className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={`mailto:${eventData.associated_with.email}`}
                                className="text-gray-700 hover:text-green-600"
                                aria-label={`Email us at ${eventData.associated_with.email}`}
                              >
                                {eventData.associated_with.email}
                              </a>
                            </li>
                          )}

                          {eventData.associated_with?.phone && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Phone className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={`tel:${eventData.associated_with.phone}`}
                                className="text-gray-700 hover:text-green-600"
                                aria-label={`Call us at ${eventData.associated_with.phone}`}
                              >
                                {eventData.associated_with.phone}
                              </a>
                            </li>
                          )}

                          {eventData.associated_with?.instagram_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Instagram className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={eventData.associated_with.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600"
                                aria-label="Visit our Instagram page"
                              >
                                Instagram
                              </a>
                            </li>
                          )}

                          {eventData.associated_with?.other_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Globe className="h-5 w-5 text-green-600" aria-hidden="true" />
                              </span>
                              <a
                                href={eventData.associated_with.other_url}
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
        {/* Mobile fixed registration bar */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-green-200 bg-white p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">{eventData.base_event?.title}</p>
                {eventData.event_detail?.registration_end_date && (
                  <p className="text-xs text-gray-600">
                    Reg ends: {format(new Date(eventData.event_detail.registration_end_date), "MMM dd")}
                  </p>
                )}
              </div>
              <div className="relative group">
                <button
                  className={`flex items-center justify-center gap-1 rounded-lg px-4 py-2 text-xs font-medium text-white ${
                    eventData.registration_detail?.is_eligible === false
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600"
                  }`}
                  disabled={eventData.registration_detail?.is_eligible === false}
                >
                  Register
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </button>
                {eventData.registration_detail?.is_eligible === false &&
                  eventData.registration_detail?.not_eligible_reason && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md bg-gray-800 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {eventData.registration_detail.not_eligible_reason}
                      <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 transform bg-gray-800"></div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}