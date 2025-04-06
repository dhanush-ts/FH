"use client"

import { useRef } from "react"
import { Acme } from "next/font/google"
import { WelcomeSection } from "./welcome-section"
import { WhySection } from "./why-section"
import { CodingSection } from "./coding-section"
import { ProjectSection } from "./project-section"
import ScrollText from "../ui/scrollText"
import ParallaxText from "../ui/scrollText"
import { cn } from "@/lib/utils"

const acme = Acme({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function Banner() {
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  // Scroll to next section
  const scrollToNextSection = (index) => {
    const nextIndex = index + 1
    if (nextIndex < sectionRefs.length) {
      sectionRefs[nextIndex].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      <WelcomeSection
        ref={sectionRefs[0]}
        scrollToNextSection={() => scrollToNextSection(0)}
        acmeFont={acme.className}
      />
      <ParallaxText className={cn(acme.className,"text-xl md:text-5xl bg-green-400 py-2")} baseVelocity={-5}>FindHacks</ParallaxText>
      <WhySection  ref={sectionRefs[1]} scrollToNextSection={() => scrollToNextSection(1)} />
      <ParallaxText className={cn(acme.className,"text-xl md:text-5xl bg-green-400 py-2")} baseVelocity={-5}>FindHacks</ParallaxText>
      <CodingSection  ref={sectionRefs[2]} scrollToNextSection={() => scrollToNextSection(2)} />
      <ParallaxText className={cn(acme.className,"text-xl md:text-5xl bg-green-400 py-2")} baseVelocity={-5}>FindHacks</ParallaxText>
      <ProjectSection ref={sectionRefs[3]} />
    </div>
  )
}

