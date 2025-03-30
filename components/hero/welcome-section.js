"use client"

import { forwardRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { ChevronDown } from 'lucide-react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import Lottie from "lottie-react"

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

export const WelcomeSection = forwardRef(({ scrollToNextSection, acmeFont }, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const controls = useAnimation()

  // Start animation when component mounts
  useEffect(() => {
    setTimeout(() => {
      controls.start("visible")
    }, 100)
  }, [])

  // Shared components
  const ReadyBadge = () => (
    <motion.div
      variants={childVariants}
      className="bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
    >
      READY IN SECONDS
    </motion.div>
  )

  const Heading = () => (
    <motion.div variants={childVariants} className="space-y-2">
      <h1 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter ${acmeFont}`}>
        Discover the{" "}
        <span className="relative">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
            Future
          </span>
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 200 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 5.5C40 1.5 60 1.5 199 5.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>{" "}
        of Innovation
      </h1>
    </motion.div>
  )

  const Description = () => (
    <motion.p 
      variants={childVariants} 
      className="text-base md:text-xl text-slate-700 max-w-md"
    >
      Your ultimate platform for discovering, connecting, and participating in the world's most exciting
      hackathons. Level up your skills, build your network, and showcase your talent.
    </motion.p>
  )

  const ActionButtons = () => (
    <motion.div 
      variants={childVariants} 
      className={isMobile ? "flex flex-col gap-3 w-full" : "flex flex-wrap gap-4 justify-center lg:justify-start"}
    >
      <Button
        size="lg"
        className={`${isMobile ? "w-full" : ""} bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-none transition-all duration-300 transform hover:scale-105`}
      >
        Find Hackathons
      </Button>
      <Button
        size="lg"
        variant="outline"
        className={`${isMobile ? "w-full" : ""} border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-none transition-all duration-300`}
      >
        Create Account
      </Button>
    </motion.div>
  )

  const Animation = () => (
    <div className={`w-full ${isMobile ? "h-80" : "h-[400px] md:h-[500px] lg:h-[600px]"}`}>
      <Lottie
        animationData={require("@/app/assests/landingPerson.json")}
        loop={true}
        className="w-full h-full object-contain"
      />
    </div>
  )

  const Footer = () => (
    <div className="relative mt-8 md:mt-12 mb-6 md:mb-8 h-16 flex flex-col items-center">
      <div className="w-[1px] h-12 md:h-16 bg-green-300"></div>
      <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium mt-2">
        Breaking boundaries since 2024
      </div>
    </div>
  )

  // Render different layouts based on screen size
  return (
    <section
      ref={ref}
      className="min-h-screen w-full relative flex flex-col justify-center items-center py-8 md:py-8 lg:py-0"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 md:pt-0">
        {isMobile ? (
          // Mobile Layout (Single column, everything centered)
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-6"
          >
            <ReadyBadge />
            <Heading />
            <Description />
            <ActionButtons />
            <div className="h-6"></div> {/* Spacer */}
            <Animation />
          </motion.div>
        ) : (
          // Desktop Layout (Original two-column grid)
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-center">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromLeft}
              className="space-y-6 md:space-y-8 pt-8 md:pt-0 text-center lg:text-left"
            >
              <ReadyBadge />
              <Heading />
              <Description />
              <ActionButtons />
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromRight}
              className="relative h-full flex items-center justify-center"
            >
              <Animation />
            </motion.div>
          </div>
        )}

        <Footer />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-green-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
})

WelcomeSection.displayName = "WelcomeSection"