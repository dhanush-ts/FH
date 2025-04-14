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

export default function EventPage({ id }) {
  const [activeSection, setActiveSection] = useState("overview")
  const [isScrolled, setIsScrolled] = useState(false)
  const [openFaqId, setOpenFaqId] = useState(null)

  const sectionRefs = {
    overview: useRef(null),
    schedule: useRef(null),
    sponsors: useRef(null),
    venue: useRef(null),
    prizes: useRef(null),
    faq: useRef(null),
    contact: useRef(null),
  }

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
    })
    setActiveSection(sectionId)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -40% 0px",
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

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
  }, [])

  // Event data
  const eventData = {
    title: "basic details sdafsadf dsafsd",
    logo: "http://127.0.0.1:8000/media/event/logo/cropped_image_1_zWJHtwA.png",
    short_description: "nice event this is going to be",
    banner: "http://127.0.0.1:8000/media/event/banner/banner_i0fGzju.webp",
    about_event:
      "<p>fsafsa f<strong>dsafdsf dasff</strong><strong><em>dsaf sadfdsaf sdfa</em></strong></p>\r\n<p><strong><em>fdksahfjsk afh</em></strong></p>\r\n<p><strong><em>dsfasdaf</em></strong><em>dfafsdf af</em></p>\r\n<p><strong>lkfjdlsdaf</strong><strong><em>lkdfjlasdf</em></strong></p>\r\n<p><em> fasdfasdf sdafsdaf seafsdffdsfadasf sdafsdfa dsafdsaf dsafsdf asdfdf sdafdfadafsdaf</em></p>\r\n<p><em>update</em></p>",
    mode: "Online",
    start_date: "2025-04-17T07:30:00+05:30",
    end_date: "2025-04-18T00:00:00+05:30",
    registration_end_date: "2025-04-10T10:45:00+05:30",
    sponsors: [
      {
        id: "ba094040-6190-4844-b6dd-19a71c2d1f21",
        name: "fdasfdsaf",
        logo: "http://127.0.0.1:8000/media/event/sponser/cropped_image_qMzPqGJ.png",
        priority: 17,
      },
      {
        id: "e0b379a7-3d4a-421f-bc17-ec3551214585",
        name: "now",
        logo: "http://127.0.0.1:8000/media/event/sponser/cropped-1x1_icon_logo_1.jpg",
        priority: 5,
      },
      {
        id: "83ac3aee-2801-49b6-b1f4-65ed7502ed34",
        name: "new sponsor",
        logo: "http://127.0.0.1:8000/media/event/sponser/cropped-1x1_icon_logo_1_P1fT192.jpg",
        priority: 4,
      },
      {
        id: "b9ffe4e1-8864-4bca-8e34-3763ec6bc590",
        name: "old name",
        logo: "http://127.0.0.1:8000/media/event/sponser/hogwarts_1_eSQ0ABT.jpg",
        priority: 3,
      },
      {
        id: "24116c08-8676-462a-b41e-fd85f7f51767",
        name: "sdfaf",
        logo: "http://127.0.0.1:8000/media/event/sponser/cropped_image_1_8LkvX5d.png",
        priority: 2,
      },
    ],
    venue: {
      place: "VR Mall da",
      address: "Anna Nagar (near Koyambedu), Chennai thandalam",
      gmaps_link: "https://maps.app.goo.gl/dWrEadupcXdxHFKZ6edfsdfad",
    },
    registration: {
      url: "https://designali.in",
      team_min_size: 1,
      team_max_size: 4,
      registration_cost: 2000,
    },
    schedule: [
      {
        id: "93381f4e-5089-4ca4-b10f-6ea133942f90",
        title: "fdgdfg",
        description: "fdsfa sfsafsda fsad",
        start_at: "2025-04-11T00:00:10.348000+05:30",
        end_at: "2025-04-11T08:45:10.348000+05:30",
      },
      {
        id: "b668ae84-35f9-461b-b76f-1a831fe0a9c9",
        title: "dsafdsa f",
        description: "dfs daf",
        start_at: "2025-04-11T00:00:59.820000+05:30",
        end_at: "2025-04-11T14:25:59.820000+05:30",
      },
      {
        id: "67d11dbb-7391-499e-a42c-947808c511e0",
        title: "new event",
        description: "neeww devent",
        start_at: "2025-04-12T00:00:51.393000+05:30",
        end_at: "2025-04-12T14:45:51.393000+05:30",
      },
    ],
    contact: {
      email: "myemail@gmail.com",
      phone: "7200281984",
      instagram_url: "http://127.0.0.1:3000/host/create/d0f19a9d-e853-4550-b6e7-1656b54e0a3c/contact",
      other_url: "http://127.0.0.1:3000/host/create/d0f19a9d-e853-4550-b6e7-1656b54e0a3c/contact",
    },
    faqs: [
      {
        id: "2ae41404-0914-4968-8f58-8ed62a310845",
        question: "sdfsdafas dsfasdasdf",
        answer: "sdfsd afasdf",
        priority: 0,
      },
      {
        id: "95293f92-488b-4b41-9d31-ad79dc453ff3",
        question: "sdfsdafas",
        answer: "sdfsd afasdf",
        priority: 0,
      },
      {
        id: "3d391ca9-5a38-4b97-bae4-671cc0ff9442",
        question: "sdaf safd",
        answer: "dsaf sadf",
        priority: 0,
      },
    ],
    prizes: [
      {
        id: "614998ea-087c-4f84-9d95-ff5638c2bf89",
        title: "2ndd",
        description: "Maasa 2ned prizedd",
        amount: 200002,
        image: "http://127.0.0.1:8000/media/event/sponser/hogwarts_1_eSQ0ABT.jpg",
        priority: 0,
      },
      {
        id: "614998ea-087c-4f8fdas4-9d95-ff5638c2bf89",
        title: "2ndd",
        description: "Maasa 2ned prizedd",
        amount: 200002,
        image: "http://127.0.0.1:8000/media/event/sponser/hogwarts_1_eSQ0ABT.jpg",
        priority: 0,
      },
      {
        id: "504a2643-f4ad-4c67-a10d-eb70cb24caa9",
        title: "another prize",
        description: "vaada maapula vala palam thoupula",
        amount: 323232,
        image: null,
        priority: 0,
      },
    ],
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
  const scheduleByDate = eventData.schedule?.reduce((acc, event) => {
    const date = format(new Date(event.start_at), "yyyy-MM-dd")
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {})

  // Sort sponsors by priority
  const sortedSponsors = [...(eventData.sponsors || [])].sort((a, b) => b.priority - a.priority)

  // Check if sections have data
  const hasSchedule = eventData.schedule && eventData.schedule.length > 0
  const hasSponsors = eventData.sponsors && eventData.sponsors.length > 0
  const hasVenue = eventData.venue && (eventData.venue.place || eventData.venue.address || eventData.venue.gmaps_link)
  const hasPrizes = eventData.prizes && eventData.prizes.length > 0
  const hasFaqs = eventData.faqs && eventData.faqs.length > 0
  const hasContact =
    eventData.contact &&
    (eventData.contact.email ||
      eventData.contact.phone ||
      eventData.contact.instagram_url ||
      eventData.contact.other_url)

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section - Full width banner */}
      <div className="relative  m-auto w-full overflow-hidden">
        <div className="max-h-screen inset-0">
          <Image
            src={eventData.banner || "/placeholder.svg?height=600&width=1200"}
            alt={eventData.title}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            priority
          />
        </div>
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
          {eventData.start_date && eventData.end_date && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <Calendar className="h-6 w-6 text-green-200" />
              <div>
                <p className="text-sm text-green-200">Date</p>
                <p className="font-medium">
                  {format(new Date(eventData.start_date), "MMM dd")} -{" "}
                  {format(new Date(eventData.end_date), "MMM dd, yyyy")}
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
              <Clock className="h-6 w-6 text-green-200" />
              <div>
                <p className="text-sm text-green-200">Mode</p>
                <p className="font-medium">{eventData.mode}</p>
              </div>
            </motion.div>
          )}

          {eventData.venue && eventData.venue.place && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <MapPin className="h-6 w-6 text-green-200" />
              <div>
                <p className="text-sm text-green-200">Location</p>
                <p className="font-medium">{eventData.venue.place}</p>
              </div>
            </motion.div>
          )}

          {eventData.registration && eventData.registration.team_min_size && eventData.registration.team_max_size && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3"
            >
              <Users className="h-6 w-6 text-green-200" />
              <div>
                <p className="text-sm text-green-200">Team Size</p>
                <p className="font-medium">
                  {eventData.registration.team_min_size} - {eventData.registration.team_max_size} Members
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
                <nav className="flex flex-col gap-2">
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
                      >
                        <span className="relative capitalize">{section}</span>
                        <ChevronRight
                          className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                            activeSection === section ? "text-white" : "text-gray-400 group-hover:text-green-600"
                          }`}
                        />
                      </motion.button>
                    )
                  })}
                </nav>
              </div>

              {eventData.registration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-2 rounded-xl border border-green-200 bg-white p-4 shadow-lg"
                >
                  <h3 className="mb-2 text-lg font-semibold text-green-800">Registration</h3>
                  <div className="space-y-3">
                    {eventData.registration_end_date && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </span>
                        Registration ends: {formatDate(eventData.registration_end_date)}
                      </p>
                    )}

                    {eventData.mode && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Clock className="h-4 w-4 text-green-600" />
                        </span>
                        Event type: {eventData.mode}
                      </p>
                    )}

                    {eventData.registration.team_min_size && eventData.registration.team_max_size && (
                      <p className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="rounded-full bg-green-100 p-1">
                          <Users className="h-4 w-4 text-green-600" />
                        </span>
                        Team size: {eventData.registration.team_min_size} - {eventData.registration.team_max_size}{" "}
                        members
                      </p>
                    )}

                    {eventData.registration.registration_cost && (
                      <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
                        <span className="rounded-full bg-green-100 p-1">
                          <Calendar className="h-4 w-4 text-green-600" />
                        </span>
                        Registration fee: ₹{eventData.registration.registration_cost}
                      </p>
                    )}
                  </div>

                  {eventData.registration.url && (
                    <a
                      href={eventData.registration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                      Register Now
                      <ExternalLink className="h-4 w-4" />
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
                <h2 className="mb-6 inline-block border-b-2 border-green-500 pb-2 text-3xl font-bold text-green-800">
                  Overview
                </h2>
                <div className="space-y-6 rounded-xl border border-green-100 bg-white p-6 shadow-lg">
                  {/* Logo and basic details */}
                  <div className="flex flex-col items-center gap-4 md:flex-row">
                    {eventData.logo && (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-white p-1 shadow-md">
                        <Image
                          src={eventData.logo || "/placeholder.svg"}
                          alt="Event Logo"
                          width={96}
                          height={96}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">{eventData.title}</h3>
                      {eventData.short_description && <p className="text-gray-600">{eventData.short_description}</p>}
                    </div>
                  </div>

                  {/* About event content */}
                  {eventData.about_event && (
                    <div
                      className="prose prose-green max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: eventData.about_event }}
                    />
                  )}
                </div>
              </motion.section>

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
                              src={sponsor.logo || "/placeholder.svg"}
                              alt={sponsor.name || "Sponsor"}
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
                    {eventData.venue.gmaps_link && (
                      <div className="aspect-video w-full bg-green-100">
                        <iframe
                          src={eventData.venue.gmaps_link}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="h-full w-full"
                        ></iframe>
                      </div>
                    )}
                    <div className="p-6">
                      {eventData.venue.place && (
                        <h3 className="mb-2 text-xl font-semibold text-green-800">{eventData.venue.place}</h3>
                      )}
                      {eventData.venue.address && <p className="mb-4 text-gray-700">{eventData.venue.address}</p>}
                      {eventData.venue.gmaps_link && (
                        <div className="mb-6 space-y-2">
                          <a
                            href={eventData.venue.gmaps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                          >
                            <span>View on Google Maps</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}

              {/* Prizes Section */}
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
                              src={prize.image || "/placeholder.svg"}
                              alt={prize.title || "Prize"}
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
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`h-5 w-5 text-green-600 transition-transform duration-200 ${
                                openFaqId === faq.id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {openFaqId === faq.id && (
                              <motion.div
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
                          {eventData.contact.email && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Mail className="h-5 w-5 text-green-600" />
                              </span>
                              <a
                                href={`mailto:${eventData.contact.email}`}
                                className="text-gray-700 hover:text-green-600"
                              >
                                {eventData.contact.email}
                              </a>
                            </li>
                          )}

                          {eventData.contact.phone && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Phone className="h-5 w-5 text-green-600" />
                              </span>
                              <a href={`tel:${eventData.contact.phone}`} className="text-gray-700 hover:text-green-600">
                                {eventData.contact.phone}
                              </a>
                            </li>
                          )}

                          {eventData.contact.instagram_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Instagram className="h-5 w-5 text-green-600" />
                              </span>
                              <a
                                href={eventData.contact.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600"
                              >
                                Instagram
                              </a>
                            </li>
                          )}

                          {eventData.contact.other_url && (
                            <li className="flex items-center gap-3">
                              <span className="rounded-full bg-green-100 p-2">
                                <Globe className="h-5 w-5 text-green-600" />
                              </span>
                              <a
                                href={eventData.contact.other_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-700 hover:text-green-600"
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
                            ></textarea>
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-md bg-green-600 py-2 text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
  )
}
