"use client"

import { forwardRef, useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import Lottie from "lottie-react"
import Head from "next/head"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
}

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
}

const fadeInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

const timelineVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: { duration: 1.5, ease: "easeInOut" },
  },
}

export const WhySection = forwardRef(({ scrollToNextSection }, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const controls = useAnimation()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const SectionBadge = () => (
    <motion.div
      className="inline-block w-fit bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
    >
      Why Are We Here?
    </motion.div>
  )

  const SectionHeading = () => (
    <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
      Why College Events are a {" "}
      <span className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
          Game-Changers !
        </span>
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 300 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 5.5C60 1.5 120 7.5 299 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>
    </motion.h2>
  )

  const SectionDescription = () => (
    <motion.p className="text-lg text-slate-700">
      College events aren’t just about fun—they’re launchpads for skills, connections, and opportunities. Whether it’s a
      hackathon, a cultural fest, or a meetup, every event helps you network, showcase talent, and build your resume.
      <br />
      <br />
      Step in, stand out, and make your mark!
    </motion.p>
  )

  const BenefitCards = () => (
    <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col justify-between">
        <h3 className="font-bold text-lg text-green-600 mb-2">Community</h3>
        <p className="text-slate-600">Connect with like-minded innovators and build lasting relationships</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col justify-between">
        <h3 className="font-bold text-lg text-green-600 mb-2">Learning</h3>
        <p className="text-slate-600">Accelerate your skills through hands-on challenges and mentorship</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col justify-between">
        <h3 className="font-bold text-lg text-green-600 mb-2">Innovation</h3>
        <p className="text-slate-600">Transform ideas into working prototypes in just 24-48 hours</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col justify-between">
        <h3 className="font-bold text-lg text-green-600 mb-2">Opportunity</h3>
        <p className="text-slate-600">Win prizes, secure funding, or even launch a startup</p>
      </div>
    </motion.div>
  )

  const Animation = () => (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]" aria-hidden="true">
      <Lottie
        animationData={require("@/app/assests/guyThinking.json")}
        loop={true}
        className="w-full h-full object-contain"
      />
    </div>
  )

  const Timeline = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-none transition-all duration-300 mt-8 border-l-4 border-b-4 border-green-500"
    >
      <h3 className="text-lg font-bold mb-4 text-green-600">Hackathon Journey</h3>
      <div className="relative">
        <motion.div
          className="absolute top-3 left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={timelineVariants}
        />
        <div className="flex justify-between relative z-10">
          {["Register", "Form Team", "Ideate", "Build", "Present"].map((label, index) => (
            <div className="flex flex-col items-center" key={label}>
              <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                <span className="text-white text-xs">{index + 1}</span>
              </div>
              <p className="text-xs font-medium text-center">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const Footer = () => (
    <div className="relative mt-12 mb-8 h-16 flex flex-col items-center">
      <div className="w-[1px] h-16 bg-green-300"></div>
      <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium mt-2">
        Crafted with precision
      </div>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full relative flex flex-col justify-center items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
      aria-label="Why College Events Matter"
    >
      <Head>
        <title>Why College Events are Game-Changers | FindHacks</title>
        <meta name="description" content="Discover the impact of college events like hackathons and meetups. Build skills, grow your network, and unlock opportunities with FindHacks." />
        <meta name="keywords" content="college events, hackathons, tech meetups, student innovation, build skills, FindHacks" />
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-6"
          >
            <SectionBadge />
            <SectionHeading />
            <SectionDescription />
            <BenefitCards />
            <Animation />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromLeft}
              className="relative h-full flex flex-col justify-between"
            >
              <Animation />
              {!isTablet && <Timeline />}
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromRight}
              className="space-y-6 md:space-y-8 h-full flex flex-col justify-center text-center lg:text-left"
            >
              <SectionBadge />
              <SectionHeading />
              <SectionDescription />
              <BenefitCards />
            </motion.div>
          </div>
        )}

        <Footer />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToNextSection && scrollToNextSection()}
        >
          <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
})

WhySection.displayName = "WhySection"