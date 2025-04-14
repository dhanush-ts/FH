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
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react"

export default function EventPage() {
  const [activeSection, setActiveSection] = useState("overview")
  const [isScrolled, setIsScrolled] = useState(false)

  const sectionRefs = {
    overview: useRef(null),
    schedule: useRef(null),
    sponsors: useRef(null),
    venue: useRef(null),
    prizes: useRef(null),
    registration: useRef(null),
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
    banner: "http://127.0.0.1:8000/media/event/sponser/hogwarts_1_eSQ0ABT.jpg",
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
        image: "http://127.0.0.1:8000/media/event/prize/cropped_image_1.png",
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

  // Sort sponsors by priority
  const sortedSponsors = [...eventData.sponsors].sort((a, b) => b.priority - a.priority)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-green-900">
          <Image
            src={eventData.banner || "/placeholder.svg?height=600&width=1200"}
            alt={eventData.title}
            width={1200}
            height={600}
            className="h-full w-full object-cover opacity-40"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 to-green-900/90" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center px-4 text-center"
        >
          <div className="mb-6 h-20 w-20 overflow-hidden rounded-full bg-white p-1 shadow-lg">
            <Image
              src={eventData.logo || "/placeholder.svg?height=80&width=80"}
              alt="Event Logo"
              width={80}
              height={80}
              className="h-full w-full object-contain"
            />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          >
            {eventData.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-6 max-w-2xl text-lg text-white/90"
          >
            {eventData.short_description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href={eventData.registration.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-md bg-green-600 px-8 py-3 font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <span className="relative z-10">Register Now</span>
              <span className="absolute inset-0 -translate-x-full bg-green-500 transition-transform duration-300 ease-out group-hover:translate-x-0"></span>
            </a>
            <button
              onClick={() => scrollToSection("overview")}
              className="group relative overflow-hidden rounded-md border border-white bg-transparent px-8 py-3 font-medium text-white transition-all hover:bg-white/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              <span className="relative z-10">Learn More</span>
              <span className="absolute inset-0 -translate-y-full bg-white/20 transition-transform duration-300 ease-out group-hover:translate-y-0"></span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Event Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-green-700 py-6 text-white shadow-lg"
      >
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-4">
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
        </div>
      </motion.div>

      {/* Main Content with Sidebar */}
      <div className="container px-2 md:px-8 py-12">
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
                    if (section === "registration") return null // Skip overview since it's the default section
                    else{
                        return(
                            <motion.button
                            key={section}
                      onClick={() => scrollToSection(section)}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group flex items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                        activeSection === section ? "bg-green-100 text-green-800" : "text-gray-600 hover:bg-green-50"
                      }`}
                    >
                      <span className="relative capitalize">
                        {section}
                        {activeSection === section && (
                          <motion.span
                            layoutId="activeSection"
                            className="absolute -left-2 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-green-600"
                          />
                        )}
                      </span>
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                            activeSection === section ? "text-green-600" : "text-gray-400 group-hover:text-green-600"
                            }`}
                            />
                    </motion.button>
                  )}
                })}
                </nav>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-2 rounded-xl border border-green-200 bg-white p-4 shadow-lg"
              >
                <h3 className="mb-2 text-lg font-semibold text-green-800">Registration</h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="rounded-full bg-green-100 p-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </span>
                    Registration ends: {formatDate(eventData.registration_end_date)}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="rounded-full bg-green-100 p-1">
                      <Users className="h-4 w-4 text-green-600" />
                    </span>
                    Team size: {eventData.registration.team_min_size} - {eventData.registration.team_max_size} members
                  </p>
                  <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <span className="rounded-full bg-green-100 p-1">
                      <Award className="h-4 w-4 text-green-600" />
                    </span>
                    Registration fee: ₹{eventData.registration.registration_cost}
                  </p>
                </div>
                <a
                  href={eventData.registration.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Register Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
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
                  <div
                    className="prose prose-green max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: eventData.about_event }}
                  />

                  <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="rounded-lg bg-green-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <h3 className="mb-2 font-semibold text-green-800">Event Mode</h3>
                      <p className="text-sm text-gray-600">
                        {eventData.mode} event with interactive sessions and networking opportunities.
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="rounded-lg bg-green-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <h3 className="mb-2 font-semibold text-green-800">Duration</h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(eventData.start_date), "MMM dd")} -{" "}
                        {format(new Date(eventData.end_date), "MMM dd, yyyy")}
                      </p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="rounded-lg bg-green-50 p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                      <h3 className="mb-2 font-semibold text-green-800">Registration</h3>
                      <p className="text-sm text-gray-600">
                        Register before {format(new Date(eventData.registration_end_date), "MMM dd, yyyy")}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.section>

              {/* Schedule Section */}
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
                  {eventData.schedule.map((event, index) => {
                    const eventDate = new Date(event.start_at)
                    const formattedDate = format(eventDate, "MMMM dd, yyyy")

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <h3 className="mb-4 inline-block rounded-md bg-green-100 px-3 py-1 text-lg font-semibold text-green-800">
                          {formattedDate}
                        </h3>
                        <div className="relative ml-6 border-l-2 border-green-200 pl-6">
                          <div className="absolute -left-2.5 top-6 h-5 w-5 rounded-full border-2 border-green-200 bg-white"></div>
                          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
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
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.section>

              {/* Sponsors Section */}
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
                        className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                      >
                        <div className="mb-3 overflow-hidden">
                          <Image
                            src={sponsor.logo || "/placeholder.svg?height=64&width=64"}
                            alt={sponsor.name}
                            width={128}
                            height={128}
                            // className="w-16 h-auto object-contain"
                          />
                        </div>
                        <p className="text-center text-sm font-medium text-gray-700">{sponsor.name}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Venue Section */}
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
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-semibold text-green-800">{eventData.venue.place}</h3>
                    <p className="mb-4 text-gray-700">{eventData.venue.address}</p>
                    <div className="mb-6 space-y-2">
                      <p className="flex items-center gap-2 text-gray-700">
                        <MapPin className="h-5 w-5 text-green-600" />
                        <span>Located in Anna Nagar, easily accessible by public transportation</span>
                      </p>
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
                  </div>
                </div>
              </motion.section>

              {/* Prizes Section */}
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                      <div className="relative h-48 w-full bg-green-100">
                        {prize.image ? (
                          <Image
                            src={prize.image || "/placeholder.svg"}
                            alt={prize.title}
                            width={400}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-green-100">
                            <Award className="h-16 w-16 text-green-500" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-900/80 to-transparent p-4 text-white">
                          <h3 className="text-xl font-bold">{prize.title}</h3>
                          <p className="text-lg font-semibold">₹{prize.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700">{prize.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* FAQ Section */}
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
                    <AnimatePresence>
                      {eventData.faqs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
                        >
                          <h3 className="mb-2 font-semibold text-green-800">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.section>

              {/* Contact Section */}
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
                        <li className="flex items-center gap-3">
                          <span className="rounded-full bg-green-100 p-2">
                            <Mail className="h-5 w-5 text-green-600" />
                          </span>
                          <a href={`mailto:${eventData.contact.email}`} className="text-gray-700 hover:text-green-600">
                            {eventData.contact.email}
                          </a>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="rounded-full bg-green-100 p-2">
                            <Phone className="h-5 w-5 text-green-600" />
                          </span>
                          <a href={`tel:${eventData.contact.phone}`} className="text-gray-700 hover:text-green-600">
                            {eventData.contact.phone}
                          </a>
                        </li>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
