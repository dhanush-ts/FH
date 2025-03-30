"use client"

import { forwardRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export const ProjectSection = forwardRef((props, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const controls = useAnimation()

  // Start animation when component mounts
  useEffect(() => {
    setTimeout(() => {
      controls.start("visible")
    }, 100)
  }, [])

  // Shared components
  const SectionBadge = () => (
    <motion.div
      variants={childVariants}
      className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
    >
      Building a Project
    </motion.div>
  )

  const SectionHeading = () => (
    <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
      From{" "}
      <span className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Concept</span>
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 200 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 5.5C40 1.5 80 7.5 199 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>{" "}
      to Reality
    </motion.h2>
  )

  const SectionDescription = () => (
    <motion.p variants={childVariants} className="text-lg text-slate-700">
      Building projects isn't just about adding to your resume—it's about solving real problems, working in teams, and
      creating something meaningful that showcases your unique abilities.
    </motion.p>
  )

  const ProjectBenefits = () => (
    <motion.div
      variants={childVariants}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-none transition-all duration-300 border-l-4 border-b-4 border-green-500"
    >
      <h3 className="font-bold text-xl text-green-600 mb-3">Project Benefits</h3>
      <ul className="space-y-2">
        <li className="flex items-start space-x-2">
          <div className="bg-green-500 rounded-full p-1 mt-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700">Enhances your resume with tangible accomplishments</p>
        </li>
        <li className="flex items-start space-x-2">
          <div className="bg-green-500 rounded-full p-1 mt-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700">Develops teamwork and communication skills</p>
        </li>
        <li className="flex items-start space-x-2">
          <div className="bg-green-500 rounded-full p-1 mt-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700">Creates a portfolio that demonstrates your capabilities</p>
        </li>
        <li className="flex items-start space-x-2">
          <div className="bg-green-500 rounded-full p-1 mt-1">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700">Builds confidence in your technical abilities</p>
        </li>
      </ul>
    </motion.div>
  )

  const Animation = () => (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
      <Lottie
        animationData={require("@/app/assests/build.json")}
        loop={true}
        className="w-full h-full object-contain"
      />
    </div>
  )

  const Testimonials = () => (
    <motion.div variants={childVariants} className="mt-0">
      <h3 className="text-xl font-bold mb-4">What Participants Say</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-b-4 border-green-500 shadow-md hover:shadow-none transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <p className="italic text-slate-600 mb-4">
              "The hackathon project I built became the centerpiece of my portfolio and helped me land my dream job at a
              tech startup."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                <span className="font-bold text-green-700">JD</span>
              </div>
              <div>
                <p className="font-medium">Jamie Doe</p>
                <p className="text-xs text-slate-500">Software Engineer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-b-4 border-green-500 shadow-md hover:shadow-none transition-all duration-300 overflow-hidden">
          <CardContent className="p-4">
            <p className="italic text-slate-600 mb-4">
              "Our hackathon project evolved into a startup that just closed its first round of funding. It all started
              with a weekend of coding!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                <span className="font-bold text-green-700">AS</span>
              </div>
              <div>
                <p className="font-medium">Alex Smith</p>
                <p className="text-xs text-slate-500">Founder & CTO</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )

  const CallToAction = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="mt-16 text-center"
    >
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Hackathon Journey?</h3>
        <p className="text-slate-600 mb-6">
          Join thousands of innovators who are building the future through hackathons. Find your next event, connect
          with teammates, and showcase your skills.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className={`${isMobile ? "w-full" : ""} bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-none transition-all duration-300 transform hover:scale-105`}
          >
            Find a Hackathon
          </Button>
          <Button
            size="lg"
            variant="outline"
            className={`${isMobile ? "w-full" : ""} border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-none transition-all duration-300`}
          >
            Create Your Profile
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const Footer = () => (
    <div className="relative mt-12 mb-8 h-16 flex flex-col items-center">
      <div className="w-[1px] h-16 bg-green-300"></div>
      <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium mt-2">
        Beautiful experiences, made simple
      </div>
    </div>
  )

  return (
    <section
      ref={ref}
      className="min-h-screen w-full relative flex flex-col justify-center items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          // Mobile Layout (Single column, everything centered)
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-6"
          >
            <SectionBadge />
            <SectionHeading />
            <SectionDescription />
            <ProjectBenefits />
            <Animation />
            <CallToAction />
          </motion.div>
        ) : (
          // Desktop Layout (Original two-column grid)
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromLeft}
              className="relative flex flex-col h-full"
            >
              <Animation />
              {!isMobile && <Testimonials />}
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromRight}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <SectionBadge />
              <SectionHeading />
              <SectionDescription />
              <ProjectBenefits />
            </motion.div>
          </div>
        )}

        {!isMobile && <CallToAction />}
        <Footer />
      </div>
    </section>
  )
})

ProjectSection.displayName = "ProjectSection"

