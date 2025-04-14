"use client"

import { forwardRef, useEffect, useState, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { SkillProgress } from "@/components/ui/skill-progress"
import Lottie from "lottie-react"
import OptimizedLottie from "../ui/display-lottie"

const skillDevelopmentData = [
  { skill: "Problem Solving", before: 65, after: 92 },
  { skill: "Teamwork", before: 70, after: 95 },
  { skill: "Technical Skills", before: 60, after: 88 },
  { skill: "Time Management", before: 55, after: 85 },
  { skill: "Communication", before: 68, after: 90 },
]

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
}

const fadeInFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
}

const fadeInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, staggerChildren: 0.2 },
  },
}

export const CodingSection = forwardRef(({ scrollToNextSection }, ref) => {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const controls = useAnimation()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true })

  const [progressValues, setProgressValues] = useState(skillDevelopmentData.map((item) => item.before))

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
      const timer = setTimeout(() => {
        setProgressValues(skillDevelopmentData.map((item) => item.after))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, controls])

  const Animation = () => (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]" aria-label="Coding journey animation">
      <OptimizedLottie
        animationData={require("@/app/assests/build.json")}
        loop={true}
        className="w-full h-full object-contain"
        aria-hidden="true"
      />
    </div>
  )

  const SectionBadge = () => (
    <motion.span className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm" aria-label="Coding Journey Badge">
      The Coding Journey
    </motion.span>
  )

  const SectionHeading = () => (
    <motion.h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug" id="coding-section-title">
      Your Resume Speaks{" "}
      <span className="relative">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Louder</span>
        <svg
          className="absolute -bottom-2 left-0 w-full"
          viewBox="0 0 150 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
          aria-hidden="true"
        >
          <path d="M1 5.5C30 2.5 50 7.5 149 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </span>{" "}
      Than Your Degree!
    </motion.h1>
  )

  const SectionDescription = () => (
    <motion.p className="text-lg text-slate-700 max-w-2xl" aria-label="Coding section description">
      Degrees open doors, but real-world coding skills, hackathon experiences, and problem-solving abilities set you apart.
      Let your projects and hands-on contributions shine brighter on your resume.
    </motion.p>
  )

  const BenefitsList = () => (
    <motion.ul className="space-y-4 list-none" role="list" aria-label="Benefits of coding experience">
      {[
        "Learn by doing, not just watching",
        "Embrace failures as stepping stones",
        "Collaborate to elevate your skills"
      ].map((benefit, i) => (
        <li key={i} className="flex items-center space-x-3" role="listitem">
          <div className="bg-green-500 rounded-full p-1">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-700">{benefit}</p>
        </li>
      ))}
    </motion.ul>
  )

  const ProjectImpact = () => (
    <motion.article className="bg-white p-6 rounded-xl shadow-md border-l-4 border-b-4 border-green-500 mt-4" aria-labelledby="project-impact-title">
      <h2 className="text-lg font-bold mb-4 text-green-600" id="project-impact-title">Project Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: "Resume Enhancement", value: 92 },
          { label: "Portfolio Growth", value: 88 },
          { label: "Interview Success", value: 78 },
          { label: "Job Offers", value: 65 },
        ].map(({ label, value }, i) => (
          <div className="space-y-2" key={i}>
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-medium">{value}%</span>
            </div>
            <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4 text-center">Based on survey of 500+ hackathon participants</p>
    </motion.article>
  )

  const Footer = () => (
    <footer className="relative mt-12 mb-8 h-16 flex flex-col items-center" aria-label="Section Footer">
      <div className="w-[1px] h-16 bg-green-300" />
      <div className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium mt-2">
        Elevate your digital presence
      </div>
    </footer>
  )

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full relative flex flex-col justify-center items-center py-16 md:py-24"
      aria-labelledby="coding-section-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isMobile ? (
          <motion.div initial="hidden" animate={controls} variants={fadeIn} className="flex flex-col items-center text-center space-y-8">
            <SectionBadge />
            <SectionHeading />
            <SectionDescription />
            <BenefitsList />
            <SkillProgress data={skillDevelopmentData} />
            <Animation />
            <ProjectImpact />
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div initial="hidden" animate={controls} variants={fadeInFromLeft} className="space-y-6 text-left">
              <SectionBadge />
              <SectionHeading />
              <SectionDescription />
              <BenefitsList />
              <SkillProgress data={skillDevelopmentData} />
            </motion.div>
            <motion.div initial="hidden" animate={controls} variants={fadeInFromRight} className="flex flex-col h-full justify-between">
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
          onClick={() => scrollToNextSection && scrollToNextSection()}
          aria-label="Scroll to next section"
        >
          <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  )
})

CodingSection.displayName = "CodingSection"
