// "use client"

// import { CodingSection } from "@/components/hero/coding-section"
// import { ProjectSection } from "@/components/hero/project-section"
// import { WelcomeSection } from "@/components/hero/welcome-section"
// import { WhySection } from "@/components/hero/why-section"
// import { motion, useScroll, useSpring, useTransform } from "motion/react"
// import { useRef } from "react"

// function useParallax(value, distance) {
//   return useTransform(value, [0, 1], [-distance, distance])
// }

// function Image({ id }) {
//   const ref = useRef(null)
//   const { scrollYProgress } = useScroll({ target: ref })
//   const y = useParallax(scrollYProgress, 300)

//   return (
//     <section className="img-container">
//       <div ref={ref}>
//         <img src={`/photos/cityscape/${id}.jpg`} alt="A London skyscraper" />
//       </div>
//       <motion.h2
//         initial={{ visibility: "hidden" }}
//         animate={{ visibility: "visible" }}
//         style={{ y }}
//       >{`#00${id}`}</motion.h2>
//     </section>
//   )
// }

// export default function Parallax() {
//   const { scrollYProgress } = useScroll()
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001,
//   })

//   return (
//     <div id="example" className="parallax-container">
//       {/* {[1, 2, 3, 4, 5].map((image) => (
//         <Image key={image} id={image} />
//       ))} */}
//       <WelcomeSection />
//       <ProjectSection />
//       <CodingSection />
//       <WhySection />
//       <StyleSheet />
//     </div>
//   )
// }

// /**
//  * ==============   Styles   ================
//  */

// function StyleSheet() {
//   return (
//     <style>{`
//         /* Changed from html to .parallax-container */
//         .parallax-container {
//             scroll-snap-type: y mandatory;
//             height: 100vh;
//             overflow-y: auto;
//             position: relative;
//         }

//         .img-container {
//             height: 100vh;
//             scroll-snap-align: start;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             position: relative;
//         }

//         .img-container > div {
//             width: 300px;
//             height: 400px;
//             margin: 20px;
//             background: #f5f5f5;
//             overflow: hidden;
//         }

//         .img-container img {
//             width: 300px;
//             height: 400px;
//         }

//         @media (max-width: 500px) {
//             .img-container > div {
//                 width: 150px;
//                 height: 200px;
//             }

//             .img-container img {
//                 width: 150px;
//                 height: 200px;
//             }
//         }

//         .img-container h2 {
//             color: #4ff0b7;
//             margin: 0;
//             font-family: "Azeret Mono", monospace;
//             font-size: 50px;
//             font-weight: 700;
//             letter-spacing: -3px;
//             line-height: 1.2;
//             position: absolute;
//             display: inline-block;
//             top: calc(50% - 25px);
//             left: calc(50% + 120px);
//         }

//         .progress {
//             position: fixed;
//             left: 0;
//             right: 0;
//             height: 5px;
//             background: #4ff0b7;
//             bottom: 50px;
//             transform: scaleX(0);
//         }
//     `}</style>
//   )
// }

"use client"

import { CodingSection } from "@/components/hero/coding-section"
import { ProjectSection } from "@/components/hero/project-section"
import { WelcomeSection } from "@/components/hero/welcome-section"
import { WhySection } from "@/components/hero/why-section"
import { useEffect, useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import ScrollText from "@/components/ui/scrollText"

export default function Parallax() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const sectionRefs = useRef([])
  const scrolling = useRef(false)

  useEffect(() => {
    const handleWheel = (e) => {
      if (scrolling.current) return

      const index = sectionRefs.current.findIndex((ref) => {
        const rect = ref?.getBoundingClientRect()
        return rect && rect.top >= -50 && rect.top <= 50
      })

      if (index === -1) return

      scrolling.current = true
      let targetIndex = index

      if (e.deltaY > 10 && index < sectionRefs.current.length - 1) {
        targetIndex = index + 1
      } else if (e.deltaY < -10 && index > 0) {
        targetIndex = index - 1
      }

      const targetRef = sectionRefs.current[targetIndex]
      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth" })
        setTimeout(() => {
          scrolling.current = false
        }, 1000)
      } else {
        scrolling.current = false
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    return () => window.removeEventListener("wheel", handleWheel)
  }, [])

  return (
    <div id="example" className="parallax-container">
      {[WelcomeSection, ProjectSection, CodingSection, WhySection].map((Section, i) => (
        <div
          key={i}
          className="snap-section"
          ref={(el) => (sectionRefs.current[i] = el)}
        >
          <Section />
        </div>
      ))}
      <motion.div className="progress" style={{ scaleX }} />
      <StyleSheet />
    </div>
  )
}

function StyleSheet() {
  return (
    <style>{`
      .parallax-container {
        scroll-snap-type: y mandatory;
        height: 100vh;
        overflow-y: auto;
        position: relative;
      }

      .snap-section {
        scroll-snap-align: start;
        height: 100vh;
      }

      .progress {
        position: fixed;
        left: 0;
        right: 0;
        height: 5px;
        background: #4ff0b7;
        bottom: 50px;
        transform: scaleX(0);
        transform-origin: left;
        z-index: 50;
      }
    `}</style>
  )
}
