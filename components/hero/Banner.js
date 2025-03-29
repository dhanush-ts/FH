// "use client"
// import { useEffect, useRef, useState } from "react"
// import { DotLottieReact } from "@lottiefiles/dotlottie-react"
// import RotatingText from "../ui/RotatingText/RotatingText"
// import Btn09 from "../ui/get-started-button"
// import { motion } from "framer-motion"
// import { useMediaQuery } from "@/hooks/use-media-query"
// import { Acme } from "next/font/google"
// import build from "@/app/assests/landingPerson.json"
// import DisplayLottie from "../ui/display-lottie"

// const acme = Acme({
//   weight: "400", // Acme has only one weight
//   subsets: ["latin"],
//   display: "swap",
// })

// export default function Banner() {
//   const isMobile = useMediaQuery("(max-width: 768px)")
//   const [isLoaded, setIsLoaded] = useState(false)
//   const containerRef = useRef(null)

//   useEffect(() => {
//     setIsLoaded(true)
//   }, [])

//   return (
//     <div
//       ref={containerRef}
//       className="relative w-full bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 overflow-hidden"
//     >
//       {/* Mobile-only animated background elements */}
//       {isMobile && isLoaded && (
//         <>
//           <motion.div
//             className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-400/80 z-0"
//             initial={{ scale: 0, x: -50, y: -50 }}
//             animate={{
//               scale: [0, 1.2, 1],
//               x: [-50, -30],
//               y: [-50, -20],
//             }}
//             transition={{ duration: 1.5, ease: "easeOut" }}
//           />

//           <motion.div
//             className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-blue-400/80 z-0"
//             initial={{ scale: 0, x: 100 }}
//             animate={{
//               scale: [0, 1.2, 1],
//               x: [100, 40],
//             }}
//             transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
//           />

//           <motion.div
//             className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-cyan-400/80 z-0"
//             initial={{ scale: 0 }}
//             animate={{
//               scale: [0, 1.2, 1],
//               y: [0, -10, 0, 10, 0],
//             }}
//             transition={{
//               scale: { duration: 1, delay: 0.6, ease: "easeOut" },
//               y: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" },
//             }}
//           />

//           <motion.div
//             className="absolute bottom-40 left-10 w-20 h-20 rounded-full bg-purple-400/80 z-0"
//             initial={{ scale: 0 }}
//             animate={{
//               scale: [0, 1.2, 1],
//               y: [0, 10, 0, -10, 0],
//             }}
//             transition={{
//               scale: { duration: 1, delay: 0.9, ease: "easeOut" },
//               y: { repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" },
//             }}
//           />

//           {/* Animated slicing lines */}
//           {/* <motion.div
//             className="absolute inset-0 z-0 overflow-hidden"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 1, delay: 1.2 }}
//           >
//             {[...Array(5)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
//                 style={{ top: `${20 + i * 15}%` }}
//                 initial={{ x: "-100%" }}
//                 animate={{ x: ["100%", "-100%"] }}
//                 transition={{
//                   duration: 8 + i * 2,
//                   repeat: Number.POSITIVE_INFINITY,
//                   ease: "linear",
//                   delay: i * 0.5,
//                 }}
//               />
//             ))}
//           </motion.div> */}

//           {/* Mobile Lottie animation */}
//           {/* <motion.div
//             className="absolute -bottom-10 right-0 w-full h-64 md:hidden z-0 opacity-60"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 0.6, y: 0 }}
//             transition={{ duration: 1, delay: 0.5 }}
//           >
//             <DotLottieReact
//               src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
//               loop
//               autoplay
//               className="w-full h-full object-contain"
//             />
//           </motion.div> */}
//         </>
//       )}

//       <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         <div
//           className={`${isMobile ? "flex py-24 items-center" : "h-[300px] md:h-[450px]"} max-w-7xl mx-auto relative`}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full h-full">
//             {/* Left Content */}
//             <motion.div
//               className="flex flex-col justify-center space-y-6 md:space-y-8 z-10 py-8 md:py-0"
//               initial={isMobile ? { opacity: 0, y: 20 } : {}}
//               animate={isMobile ? { opacity: 1, y: 0 } : {}}
//               transition={{ duration: 0.8, delay: 0.2 }}
//             >
//               <div className="space-y-4">
//                 {isMobile ? (
//                   <motion.h1
//                     className="font-bold tracking-tight text-slate-900 text-center text-4xl sm:text-5xl"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.8, delay: 0.4 }}
//                   >
//                     <motion.span
//                       initial={{ y: 40, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ duration: 0.6, delay: 0.5 }}
//                       className="block"
//                     >
//                       Welcome to{" "}
//                     </motion.span>
//                     <motion.span
//                       className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 block"
//                       initial={{ y: 40, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ duration: 0.6, delay: 0.7 }}
//                     >
//                     <span className={`${acme.className}  font-bold bg-gradient-to-r text-black`}>
//                       FIND<span className="text-green-600">H</span>ACKS
//                     </span>
//                     </motion.span>
//                     <motion.span
//                       initial={{ y: 40, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ duration: 0.6, delay: 0.9 }}
//                       className="block mt-2"
//                     >
//                       Your hub for{" "}
//                     </motion.span>
//                     <motion.span
//                       className="relative inline-block mt-2"
//                       initial={{ y: 40, opacity: 0 }}
//                       animate={{ y: 0, opacity: 1 }}
//                       transition={{ duration: 0.6, delay: 1.1 }}
//                     >
//                       <RotatingText
//                         texts={["Hackathons", "Symposium", "Fests"]}
//                         mainClassName="px-3 bg-green-500 text-black overflow-hidden py-1.5 justify-center rounded-lg"
//                         staggerFrom={"last"}
//                         initial={{ y: "100%" }}
//                         animate={{ y: 0 }}
//                         exit={{ y: "-120%" }}
//                         staggerDuration={0.025}
//                         splitLevelClassName="overflow-hidden pb-1"
//                         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                         rotationInterval={3000}
//                       />
//                     </motion.span>
//                   </motion.h1>
//                 ) : (
//                   <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
//                     Welcome to{" "}
//                     <span className={`${acme.className} font-bold bg-gradient-to-r text-black`}>
//                       FIND<span className="text-green-600">H</span>ACKS
//                     </span>{" "}
//                     <br />
//                     Your hub for{" "}
//                     <span className="relative inline-block">
//                       <RotatingText
//                         texts={["Hackathons", "Symposium", "Fests"]}
//                         mainClassName="px-2 sm:px-2 md:px-3 bg-green-500 text-black overflow-hidden py-0.5 sm:py-1 md:py-1.5 justify-center rounded-lg"
//                         staggerFrom={"last"}
//                         initial={{ y: "100%" }}
//                         animate={{ y: 0 }}
//                         exit={{ y: "-120%" }}
//                         staggerDuration={0.025}
//                         splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
//                         transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                         rotationInterval={3000}
//                       />
//                     </span>
//                   </h1>
//                 )}

//                 <motion.p
//                   className={isMobile?"text-black py-8 text-xl text-center font-medium w-full leading-relaxed":"text-black text-xl font-medium max-w-md leading-relaxed"}
//                   initial={isMobile ? { opacity: 0, y: 20 } : {}}
//                   animate={isMobile ? { opacity: 1, y: 0 } : {}}
//                   transition={{ duration: 0.8, delay: 1.3 }}
//                 >
//                   Discover, connect, and grow. <br /> Join the innovation wave today!
//                 </motion.p>
//               </div>

//               <motion.div
//                 className="flex flex-col sm:flex-row gap-4 pt-2"
//                 initial={isMobile ? { opacity: 0, y: 20 } : {}}
//                 animate={isMobile ? { opacity: 1, y: 0 } : {}}
//                 transition={{ duration: 0.8, delay: 1.5 }}
//               >
//                 <div
//                   className={`transform hover:scale-105 transition-transform duration-200 `}
//                 >
//                   <Btn09 className="text-black font-semibold text-lg sm:text-xl p-3 sm:p-4 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-200">
//                     Get Started !
//                   </Btn09>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* Right side - Lottie animations (desktop only) */}
//             {/* <div className="hidden md:block absolute -right-24 w-[90%] lg:w-[70%] h-full">
//               <DotLottieReact
//                 src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
//                 loop
//                 autoplay
//                 className="w-full h-full object-contain transform translate-y-[5%]"
//               />
//             </div> */}
//             <div className="max-w-2xl">
//               <DisplayLottie animationData = {build} />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Background decoration */}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10 pointer-events-none" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />

//       {/* Mobile-only animated particles */}
//       {isMobile && isLoaded && (
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           {[...Array(12)].map((_, i) => (
//             <motion.div
//               key={`particle-${i}`}
//               className="absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
//               style={{
//                 width: Math.random() * 10 + 5,
//                 height: Math.random() * 10 + 5,
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [0, -100],
//                 x: [0, Math.random() * 50 - 25],
//                 opacity: [0.2, 0],
//                 scale: [1, 0.5],
//               }}
//               transition={{
//                 duration: Math.random() * 5 + 5,
//                 repeat: Number.POSITIVE_INFINITY,
//                 delay: Math.random() * 5,
//                 ease: "easeOut",
//               }}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Acme } from "next/font/google"
import { ChevronDown } from "lucide-react"

// Import Lottie components
import Lottie from "lottie-react"

const acme = Acme({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export default function Banner() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const sectionInView = sectionRefs.map((ref) => useInView(ref, { once: false, threshold: 0.3 }))

  // Animation controls for each section
  const controls = [useAnimation(), useAnimation(), useAnimation(), useAnimation()]

  // Update active section based on scroll position
  useEffect(() => {
    sectionInView.forEach((inView, index) => {
      if (inView) {
        setActiveSection(index)
        controls[index].start("visible")
      }
    })
  }, [sectionInView])

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

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Welcome Section */}
      <section ref={sectionRefs[0]} className="min-h-screen w-full relative flex items-center py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate={controls[0]}
              variants={isMobile ? fadeIn : fadeInFromLeft}
              className="space-y-6 md:space-y-8"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                Welcome to the Experience
              </motion.div>

              <motion.h1
                variants={childVariants}
                className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${acme.className}`}
              >
                Discover the{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">Future</span>{" "}
                of Innovation
              </motion.h1>

              <motion.p variants={childVariants} className="text-lg md:text-xl text-slate-700 max-w-lg">
                Join us on a journey through technology, creativity, and collaboration. Explore how hackathons are
                shaping the next generation of developers.
              </motion.p>

              <motion.div variants={childVariants}>
                <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Get Started
                </button>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls[0]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="relative h-[300px] md:h-[400px] lg:h-[500px]"
            >
              <div className="w-full h-full">
                <Lottie
                  animationData={require("@/app/assests/landingPerson.json")}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToNextSection(0)}
          >
            <ChevronDown className="w-10 h-10 text-blue-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Why are we here? Section */}
      <section
        ref={sectionRefs[1]}
        className="min-h-screen w-full relative flex items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* For desktop, we'll show Lottie on the left for this section */}
            {!isMobile && (
              <motion.div
                initial="hidden"
                animate={controls[1]}
                variants={fadeInFromLeft}
                className="relative h-[300px] md:h-[400px] lg:h-[500px]"
              >
                <div className="w-full h-full">
                  <Lottie
                    animationData={require("@/app/assests/codingPerson.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial="hidden"
              animate={controls[1]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="space-y-6 md:space-y-8"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                Why Are We Here?
              </motion.div>

              <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Hackathons:{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-400">
                  Where Ideas Thrive
                </span>
              </motion.h2>

              <motion.p variants={childVariants} className="text-lg text-slate-700 max-w-lg">
                Hackathons provide a unique environment where creativity meets technical skill. They're not just
                competitions; they're incubators for innovation, collaboration, and rapid learning.
              </motion.p>

              <motion.div variants={childVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">Community</h3>
                  <p className="text-slate-600">Connect with like-minded innovators and build lasting relationships</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">Learning</h3>
                  <p className="text-slate-600">Accelerate your skills through hands-on challenges and mentorship</p>
                </div>
              </motion.div>
            </motion.div>

            {/* For mobile, we'll show Lottie after the content */}
            {isMobile && (
              <motion.div initial="hidden" animate={controls[1]} variants={fadeIn} className="relative h-[300px]">
                <div className="w-full h-full">
                  <Lottie
                    animationData={require("@/app/assests/codingPerson.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToNextSection(1)}
          >
            <ChevronDown className="w-10 h-10 text-blue-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Coding Section */}
      <section ref={sectionRefs[2]} className="min-h-screen w-full relative flex items-center py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate={controls[2]}
              variants={isMobile ? fadeIn : fadeInFromLeft}
              className="space-y-6 md:space-y-8"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                The Coding Journey
              </motion.div>

              <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Embrace the{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                  Challenge
                </span>
              </motion.h2>

              <motion.p variants={childVariants} className="text-lg text-slate-700 max-w-lg">
                Coding is more than just writing lines of text—it's problem-solving, creativity, and the power to bring
                ideas to life. Every line of code is a step toward innovation.
              </motion.p>

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
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls[2]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="relative h-[300px] md:h-[400px] lg:h-[500px]"
            >
              <div className="w-full h-full">
                <Lottie
                  animationData={require("@/app/assests/email.json")}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToNextSection(2)}
          >
            <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Building a Project Section */}
      <section
        ref={sectionRefs[3]}
        className="min-h-screen w-full relative flex items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* For desktop, we'll show Lottie on the left for this section */}
            {!isMobile && (
              <motion.div
                initial="hidden"
                animate={controls[3]}
                variants={fadeInFromLeft}
                className="relative h-[300px] md:h-[400px] lg:h-[500px]"
              >
                <div className="w-full h-full">
                  <Lottie
                    animationData={require("@/app/assests/build.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}

            <motion.div
              initial="hidden"
              animate={controls[3]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="space-y-6 md:space-y-8"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                Building a Project
              </motion.div>

              <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                From{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                  Concept
                </span>{" "}
                to Reality
              </motion.h2>

              <motion.p variants={childVariants} className="text-lg text-slate-700 max-w-lg">
                Building projects isn't just about adding to your resume—it's about solving real problems, working in
                teams, and creating something meaningful that showcases your unique abilities.
              </motion.p>

              <motion.div
                variants={childVariants}
                className="bg-white p-6 rounded-xl shadow-lg border border-purple-100"
              >
                <h3 className="font-bold text-xl text-purple-600 mb-3">Project Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <div className="bg-purple-500 rounded-full p-1 mt-1">
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
                    <div className="bg-purple-500 rounded-full p-1 mt-1">
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
                    <div className="bg-purple-500 rounded-full p-1 mt-1">
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
                    <div className="bg-purple-500 rounded-full p-1 mt-1">
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
            </motion.div>

            {/* For mobile, we'll show Lottie after the content */}
            {isMobile && (
              <motion.div initial="hidden" animate={controls[3]} variants={fadeIn} className="relative h-[300px]">
                <div className="w-full h-full">
                  <Lottie
                    animationData={require("@/app/assests/build.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 text-center"
          >
            <button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Join the Community
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

