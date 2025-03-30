"use client"

import { forwardRef, useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { SkillProgress } from "@/components/ui/skill-progress"
import Lottie from "lottie-react"

// Skill development data for visualization
const skillDevelopmentData = [
  { skill: "Problem Solving", before: 65, after: 92 },
  { skill: "Teamwork", before: 70, after: 95 },
  { skill: "Technical Skills", before: 60, after: 88 },
  { skill: "Time Management", before: 55, after: 85 },
  { skill: "Communication", before: 68, after: 90 },
]

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

export const CodingSection = forwardRef(({ scrollToNextSection }, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showAfterValues, setShowAfterValues] = useState(false)
  const [progressValues, setProgressValues] = useState(skillDevelopmentData.map((item) => item.before))
  
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true }) // Trigger only once
  const controls = useAnimation()
  // Start animation when component mounts
  useEffect(() => {
    if(isInView){
      controls.start("visible")
    }
  }, [isInView, controls])

  // Shared components
  const SectionBadge = () => (
    <motion.div
      variants={childVariants}
      className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
    >
      The Coding Journey
    </motion.div>
  )

  const SectionHeading = () => (
    <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
      Unleash the{" "}
      <span className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Power</span>
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 150 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 5.5C30 2.5 50 7.5 149 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>{" "}
      of Innovation
    </motion.h2>
  )

  const SectionDescription = () => (
    <motion.p variants={childVariants} className="text-lg text-slate-700">
      Coding is more than just writing lines of text—it's problem-solving, creativity, and the power to bring ideas to
      life. Every line of code is a step toward innovation.
    </motion.p>
  )

  const BenefitsList = () => (
    <motion.div variants={childVariants} className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="bg-green-500 rounded-full p-1">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-700">Learn by doing, not just watching</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="bg-green-500 rounded-full p-1">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-700">Embrace failures as stepping stones</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="bg-green-500 rounded-full p-1">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-slate-700">Collaborate to elevate your skills</p>
      </div>
    </motion.div>
  )

  const Animation = () => (
    <div className="w-full h-[300px] md:h-[400px]">
      <Lottie
        animationData={require("@/app/assests/email.json")}
        loop={true}
        className="w-full h-full object-contain"
      />
    </div>
  )

  const ProjectImpact = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-none transition-all duration-300 mt-4 border-l-4 border-b-4 border-green-500"
    >
      <h3 className="text-lg font-bold mb-4 text-green-600">Project Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Resume Enhancement</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "92%" }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Portfolio Growth</span>
            <span className="font-medium">88%</span>
          </div>
          <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "88%" }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Interview Success</span>
            <span className="font-medium">78%</span>
          </div>
          <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "78%" }} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Job Offers</span>
            <span className="font-medium">65%</span>
          </div>
          <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-600 rounded-full" style={{ width: "65%" }} />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4 text-center">Based on survey of 500+ hackathon participants</p>
    </motion.div>
  )

  const Footer = () => (
    <div className="relative mt-12 mb-8 h-16 flex flex-col items-center">
      <div className="w-[1px] h-16 bg-green-300"></div>
      <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium mt-2">
        Elevate your digital presence
      </div>
    </div>
  )

  return (
    <section
      ref={ref}
      className="min-h-screen w-full relative flex flex-col justify-center items-center py-16 md:py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          // Mobile Layout (Single column, everything centered)
          <motion.div
            initial="hidden"
            animate={controls}
            variants={fadeIn}
            className="flex flex-col items-center text-center space-y-8"
          >
            <div className="space-y-4">
              <SectionBadge />
              <SectionHeading />
              <SectionDescription />
            </div>
            <BenefitsList />
            <SkillProgress data={skillDevelopmentData} />
            <Animation />
            <ProjectImpact />
          </motion.div>
        ) : (
          // Desktop Layout (Original two-column grid)
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromLeft}
              className="space-y-6 md:space-y-8 text-center lg:text-left"
            >
              <SectionBadge />
              <SectionHeading />
              <SectionDescription />
              <BenefitsList />
              <SkillProgress data={skillDevelopmentData} />
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls}
              variants={fadeInFromRight}
              className="relative flex flex-col h-full justify-between"
            >
              <Animation />
              <ProjectImpact />
            </motion.div>
          </div>
        )}

        <Footer />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToNextSection}
        >
          <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
        </motion.div>
      </div>
    </section>
  )
})

CodingSection.displayName = "CodingSection"

