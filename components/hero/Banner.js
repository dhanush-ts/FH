// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion, useAnimation } from "framer-motion"
// import { useMediaQuery } from "@/hooks/use-media-query"
// import { Acme } from "next/font/google"
// import { ChevronDown } from "lucide-react"

// // Import Lottie components
// import Lottie from "lottie-react"

// // Import UI components
// import { Progress } from "@/components/ui/progress"
// import { Card, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// const acme = Acme({
//   weight: "400",
//   subsets: ["latin"],
//   display: "swap",
// })

// // Skill development data for visualization
// const skillDevelopmentData = [
//   { skill: "Problem Solving", before: 65, after: 92 },
//   { skill: "Teamwork", before: 70, after: 95 },
//   { skill: "Technical Skills", before: 60, after: 88 },
//   { skill: "Time Management", before: 55, after: 85 },
//   { skill: "Communication", before: 68, after: 90 },
// ]

// export default function Banner() {
//   const isMobile = useMediaQuery("(max-width: 768px)")
//   const isTablet = useMediaQuery("(max-width: 1024px)")
//   const [activeSection, setActiveSection] = useState(0)
//   const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
//   // const sectionInView = sectionRefs.map((ref) => useInView(ref, { once: false, threshold: 0.3 }))
//   const [sectionInView, setSectionInView] = useState([false, false, false, false])

//   // State for interactive elements
//   const [selectedHackathon, setSelectedHackathon] = useState(1)
//   const [progressValues, setProgressValues] = useState(skillDevelopmentData.map((item) => item.before))
//   const [showAfterValues, setShowAfterValues] = useState(false)

//   // Animation controls for each section
//   const controls = [useAnimation(), useAnimation(), useAnimation(), useAnimation()]

//   // Update active section based on scroll position
//   // useEffect(() => {
//   //   sectionInView.forEach((inView, index) => {
//   //     if (inView) {
//   //       setActiveSection(index)
//   //       controls[index].start("visible")
//   //     }
//   //   })
//   // }, [sectionInView])

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const newSectionInView = [...sectionInView]
//         entries.forEach((entry, index) => {
//           if (sectionRefs.some((ref) => ref.current === entry.target)) {
//             const sectionIndex = sectionRefs.findIndex((ref) => ref.current === entry.target)
//             newSectionInView[sectionIndex] = entry.isIntersecting
//           }
//         })
//         setSectionInView(newSectionInView)
//       },
//       {
//         threshold: 0.3,
//       },
//     )

//     sectionRefs.forEach((ref) => {
//       if (ref.current) {
//         observer.observe(ref.current)
//       }
//     })

//     return () => observer.disconnect()
//   }, [])

//   useEffect(() => {
//     sectionInView.forEach((inView, index) => {
//       if (inView) {
//         setActiveSection(index)
//         controls[index].start("visible")
//       }
//     })
//   }, [sectionInView, controls])

//   // Animate progress bars when section 3 is in view
//   useEffect(() => {
//     if (activeSection === 2 && !showAfterValues) {
//       setTimeout(() => {
//         setShowAfterValues(true)
//         setProgressValues(skillDevelopmentData.map((item) => item.after))
//       }, 1000)
//     } else if (activeSection !== 2 && showAfterValues) {
//       setShowAfterValues(false)
//       setProgressValues(skillDevelopmentData.map((item) => item.before))
//     }
//   }, [activeSection, showAfterValues])

//   // Scroll to next section
//   const scrollToNextSection = (index) => {
//     const nextIndex = index + 1
//     if (nextIndex < sectionRefs.length) {
//       sectionRefs[nextIndex].current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       })
//     }
//   }

//   // Animation variants
//   const fadeIn = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.8,
//         staggerChildren: 0.2,
//       },
//     },
//   }

//   const fadeInFromLeft = {
//     hidden: { opacity: 0, x: -50 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.8,
//         staggerChildren: 0.2,
//       },
//     },
//   }

//   const fadeInFromRight = {
//     hidden: { opacity: 0, x: 50 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       transition: {
//         duration: 0.8,
//         staggerChildren: 0.2,
//       },
//     },
//   }

//   const childVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.5 },
//     },
//   }

//   const timelineVariants = {
//     hidden: { width: 0 },
//     visible: {
//       width: "100%",
//       transition: { duration: 1.5, ease: "easeInOut" },
//     },
//   }

//   return (
//     <div className="w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
//       {/* Welcome Section */}
//       <section ref={sectionRefs[0]} className="min-h-screen w-full relative flex items-center py-16 md:py-8">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             <motion.div
//               initial="hidden"
//               animate={controls[0]}
//               variants={isMobile ? fadeIn : fadeInFromLeft}
//               className="space-y-6 md:space-y-8"
//             >
//               <motion.div
//                 variants={childVariants}
//                 className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
//               >
//                 READY IN SECONDS
//               </motion.div>

//               <motion.div variants={childVariants} className="space-y-2">
//                 <h1 className={`text-4xl md:text-5xl lg:text-6xl/none font-bold tracking-tighter ${acme.className}`}>
//                   Discover the{" "}
//                   <span className="relative">
//                     <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
//                       Future
//                     </span>
//                     <svg
//                       className="absolute -bottom-2 left-0 w-full"
//                       viewBox="0 0 200 8"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M1 5.5C40 1.5 60 1.5 199 5.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
//                     </svg>
//                   </span>{" "}
//                   of Innovation
//                 </h1>
//               </motion.div>

//               <motion.p variants={childVariants} className="text-lg md:text-xl text-slate-700 max-w-lg">
//                 Your ultimate platform for discovering, connecting, and participating in the world's most exciting
//                 hackathons. Level up your skills, build your network, and showcase your talent.
//               </motion.p>

//               <motion.div variants={childVariants} className="flex flex-wrap gap-4">
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   Find Hackathons
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   Create Account
//                 </Button>
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial="hidden"
//               animate={controls[0]}
//               variants={isMobile ? fadeIn : fadeInFromRight}
//               className="relative"
//             >
//               <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
//                 <Lottie
//                   animationData={require("@/app/assests/landingPerson.json")}
//                   loop={true}
//                   className="w-full h-full object-contain"
//                 />
//               </div>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5, duration: 1 }}
//             className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
//             onClick={() => scrollToNextSection(0)}
//           >
//             <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
//           </motion.div>
//         </div>
//       </section>

//       {/* Why are we here? Section */}
//       <section
//         ref={sectionRefs[1]}
//         className="min-h-screen w-full relative flex items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             {/* For desktop, we'll show Lottie on the left for this section */}
//             {!isMobile && (
//               <motion.div initial="hidden" animate={controls[1]} variants={fadeInFromLeft} className="relative">
//                 <div className="w-full h-[400px] md:h-[500px]">
//                   <Lottie
//                     animationData={require("@/app/assests/codingPerson.json")}
//                     loop={true}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>

//                 {/* Timeline - Desktop only */}
//                 {!isTablet && (
//                   <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.8, duration: 0.8 }}
//                     className="bg-white p-6 rounded-xl shadow-lg mt-8 border-l-4 border-b-4 border-green-500"
//                   >
//                     <h3 className="text-lg font-bold mb-4 text-green-600">Hackathon Journey</h3>
//                     <div className="relative">
//                       <motion.div
//                         className="absolute top-3 left-0 h-1 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
//                         variants={timelineVariants}
//                         initial="hidden"
//                         animate={controls[1]}
//                       />
//                       <div className="flex justify-between relative z-10">
//                         <div className="flex flex-col items-center">
//                           <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
//                             <span className="text-white text-xs">1</span>
//                           </div>
//                           <p className="text-xs font-medium text-center">Register</p>
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
//                             <span className="text-white text-xs">2</span>
//                           </div>
//                           <p className="text-xs font-medium text-center">Form Team</p>
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
//                             <span className="text-white text-xs">3</span>
//                           </div>
//                           <p className="text-xs font-medium text-center">Ideate</p>
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
//                             <span className="text-white text-xs">4</span>
//                           </div>
//                           <p className="text-xs font-medium text-center">Build</p>
//                         </div>
//                         <div className="flex flex-col items-center">
//                           <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
//                             <span className="text-white text-xs">5</span>
//                           </div>
//                           <p className="text-xs font-medium text-center">Present</p>
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}
//               </motion.div>
//             )}

//             <motion.div
//               initial="hidden"
//               animate={controls[1]}
//               variants={isMobile ? fadeIn : fadeInFromRight}
//               className="space-y-6 md:space-y-8"
//             >
//               <motion.div
//                 variants={childVariants}
//                 className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
//               >
//                 Why Are We Here?
//               </motion.div>

//               <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
//                 Hackathons,{" "} <br />
//                 <span className="relative">
//                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
//                     Where Ideas Thrive
//                   </span>
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     viewBox="0 0 300 8"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M1 5.5C60 1.5 120 7.5 299 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                 </span>
//               </motion.h2>

//               <motion.p variants={childVariants} className="text-lg text-slate-700 w-full lg:my-12">
//                 Hackathons provide a unique environment where creativity meets technical skill. They're not just
//                 competitions; they're incubators for innovation, collaboration, and rapid learning.
//               </motion.p>

//               <motion.div variants={childVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-b-4 border-green-500">
//                   <h3 className="font-bold text-lg text-green-600 mb-2">Community</h3>
//                   <p className="text-slate-600">Connect with like-minded innovators and build lasting relationships</p>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-b-4 border-green-500">
//                   <h3 className="font-bold text-lg text-green-600 mb-2">Learning</h3>
//                   <p className="text-slate-600">Accelerate your skills through hands-on challenges and mentorship</p>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-b-4 border-green-500">
//                   <h3 className="font-bold text-lg text-green-600 mb-2">Innovation</h3>
//                   <p className="text-slate-600">Transform ideas into working prototypes in just 24-48 hours</p>
//                 </div>
//                 <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-b-4 border-green-500">
//                   <h3 className="font-bold text-lg text-green-600 mb-2">Opportunity</h3>
//                   <p className="text-slate-600">Win prizes, secure funding, or even launch a startup</p>
//                 </div>
//               </motion.div>
//             </motion.div>

//             {/* For mobile, we'll show Lottie after the content */}
//             {isMobile && (
//               <motion.div initial="hidden" animate={controls[1]} variants={fadeIn} className="relative h-[300px]">
//                 <div className="w-full h-full">
//                   <Lottie
//                     animationData={require("@/app/assests/codingPerson.json")}
//                     loop={true}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               </motion.div>
//             )}
//           </div>


//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5, duration: 1 }}
//             className="absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer"
//             onClick={() => scrollToNextSection(1)}
//           >
//             <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
//           </motion.div>
//         </div>
//       </section>

//       {/* Coding Section */}
//       <section ref={sectionRefs[2]} className="min-h-screen w-full relative flex items-center py-16 md:py-24">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             <motion.div
//               initial="hidden"
//               animate={controls[2]}
//               variants={isMobile ? fadeIn : fadeInFromLeft}
//               className="space-y-6 md:space-y-8"
//             >
//               <motion.div
//                 variants={childVariants}
//                 className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
//               >
//                 The Coding Journey
//               </motion.div>

//               <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
//                 Unleash the{" "}
//                 <span className="relative">
//                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
//                     Power
//                   </span>
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     viewBox="0 0 150 8"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M1 5.5C30 2.5 50 7.5 149 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                 </span>{" "}
//                 of Innovation
//               </motion.h2>

//               <motion.p variants={childVariants} className="text-lg text-slate-700">
//                 Coding is more than just writing lines of text—it's problem-solving, creativity, and the power to bring
//                 ideas to life. Every line of code is a step toward innovation.
//               </motion.p>

//               <motion.div variants={childVariants} className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-green-500 rounded-full p-1">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-700">Learn by doing, not just watching</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-green-500 rounded-full p-1">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-700">Embrace failures as stepping stones</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-green-500 rounded-full p-1">
//                     <svg
//                       className="w-5 h-5 text-white"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   </div>
//                   <p className="text-slate-700">Collaborate to elevate your skills</p>
//                 </div>
//               </motion.div>

//               {/* Skill Development Visualization */}
//               <motion.div variants={childVariants} className="pt-6 mt-4 m-auto bg-white border-l-4 border-b-4 border-green-500 rounded-md p-6">
//                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
//                   <span>Skill Development</span>
//                   <Badge
//                     variant={showAfterValues ? "default" : "outline"}
//                     className={showAfterValues ? "bg-green-500" : ""}
//                   >
//                     {showAfterValues ? "After Hackathons" : "Before Hackathons"}
//                   </Badge>
//                 </h3>
//                 <div className="space-y-4">
//                   {skillDevelopmentData.map((item, index) => (
//                     <div key={item.skill} className="space-y-1">
//                       <div className="flex justify-between text-sm">
//                         <span>{item.skill}</span>
//                         <span className="font-medium">{progressValues[index]}%</span>
//                       </div>
//                       <Progress
//                         value={progressValues[index]}
//                         className="h-2 bg-green-100"
//                         style={{
//                           transition: "all 1s ease-out",
//                         }}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </motion.div>
//             </motion.div>

//             <motion.div
//               initial="hidden"
//               animate={controls[2]}
//               variants={isMobile ? fadeIn : fadeInFromRight}
//               className="relative"
//             >
//               <div className="w-full h-[200px] md:h-[500px]">
//                 <Lottie
//                   animationData={require("@/app/assests/email.json")}
//                   loop={true}
//                   className="w-full h-full object-contain"
//                 />
//               </div>

//               {/* Project Impact - Now under email lottie */}
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.8, duration: 0.8 }}
//                 className="bg-white p-6 max-w-xl rounded-xl mx-auto shadow-lg mt-2 border-l-4 border-b-4 border-green-500"
//               >
//                 <h3 className="text-lg font-bold mb-4 text-green-600">Project Impact</h3>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="space-y-1">
//                     <div className="flex justify-between text-sm">
//                       <span>Resume Enhancement</span>
//                       <span className="font-medium">92%</span>
//                     </div>
//                     <Progress value={92} className="h-2 bg-green-100">
//                       <div className="h-full bg-green-600 rounded-full" />
//                     </Progress>
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex justify-between text-sm">
//                       <span>Portfolio Growth</span>
//                       <span className="font-medium">88%</span>
//                     </div>
//                     <Progress value={88} className="h-2 bg-green-100">
//                       <div className="h-full bg-green-600 rounded-full" />
//                     </Progress>
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex justify-between text-sm">
//                       <span>Interview Success</span>
//                       <span className="font-medium">78%</span>
//                     </div>
//                     <Progress value={78} className="h-2 bg-green-100">
//                       <div className="h-full bg-green-600 rounded-full" />
//                     </Progress>
//                   </div>
//                   <div className="space-y-1">
//                     <div className="flex justify-between text-sm">
//                       <span>Job Offers</span>
//                       <span className="font-medium">65%</span>
//                     </div>
//                     <Progress value={65} className="h-2 bg-green-100">
//                       <div className="h-full bg-green-600 rounded-full" />
//                     </Progress>
//                   </div>
//                 </div>
//                 <p className="text-xs text-slate-500 mt-4 text-center">
//                   Based on survey of 500+ hackathon participants
//                 </p>
//               </motion.div>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5, duration: 1 }}
//             className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
//             onClick={() => scrollToNextSection(2)}
//           >
//             <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
//           </motion.div>
//         </div>
//       </section>

//       {/* Building a Project Section */}
//       <section
//         ref={sectionRefs[3]}
//         className="min-h-screen w-full relative flex items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
//       >
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//             {/* For desktop, we'll show Lottie on the left for this section */}
//             {!isMobile && (
//               <motion.div initial="hidden" animate={controls[3]} variants={fadeInFromLeft} className="relative">
//                 <div className="w-full h-[400px] md:h-[500px]">
//                   <Lottie
//                     animationData={require("@/app/assests/build.json")}
//                     loop={true}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>

//                 {/* Interactive Project Stats - Desktop Only */}
//                 {!isTablet && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: 0.8, duration: 0.8 }}
//                     className="bg-white p-6 rounded-xl shadow-lg mt-8 border-l-4 border-b-4 border-green-500"
//                   >
//                     <h3 className="text-lg font-bold mb-4 text-green-600">Project Impact</h3>
//                     <div className="grid grid-cols-2 gap-6">
//                       <div className="space-y-1">
//                         <div className="flex justify-between text-sm">
//                           <span>Resume Enhancement</span>
//                           <span className="font-medium">92%</span>
//                         </div>
//                         <Progress value={92} className="h-2 bg-green-100">
//                           <div className="h-full bg-green-600 rounded-full" />
//                         </Progress>
//                       </div>
//                       <div className="space-y-1">
//                         <div className="flex justify-between text-sm">
//                           <span>Portfolio Growth</span>
//                           <span className="font-medium">88%</span>
//                         </div>
//                         <Progress value={88} className="h-2 bg-green-100">
//                           <div className="h-full bg-green-600 rounded-full" />
//                         </Progress>
//                       </div>
//                       <div className="space-y-1">
//                         <div className="flex justify-between text-sm">
//                           <span>Interview Success</span>
//                           <span className="font-medium">78%</span>
//                         </div>
//                         <Progress value={78} className="h-2 bg-green-100">
//                           <div className="h-full bg-green-600 rounded-full" />
//                         </Progress>
//                       </div>
//                       <div className="space-y-1">
//                         <div className="flex justify-between text-sm">
//                           <span>Job Offers</span>
//                           <span className="font-medium">65%</span>
//                         </div>
//                         <Progress value={65} className="h-2 bg-green-100">
//                           <div className="h-full bg-green-600 rounded-full" />
//                         </Progress>
//                       </div>
//                     </div>
//                     <p className="text-xs text-slate-500 mt-4 text-center">
//                       Based on survey of 500+ hackathon participants
//                     </p>
//                   </motion.div>
//                 )}
//               </motion.div>
//             )}

//             <motion.div
//               initial="hidden"
//               animate={controls[3]}
//               variants={isMobile ? fadeIn : fadeInFromRight}
//               className="space-y-6 md:space-y-8"
//             >
//               <motion.div
//                 variants={childVariants}
//                 className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
//               >
//                 Building a Project
//               </motion.div>

//               <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
//                 From{" "}
//                 <span className="relative">
//                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
//                     Concept
//                   </span>
//                   <svg
//                     className="absolute -bottom-2 left-0 w-full"
//                     viewBox="0 0 200 8"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M1 5.5C40 1.5 80 7.5 199 3.5" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
//                   </svg>
//                 </span>{" "}
//                 to Reality
//               </motion.h2>

//               <motion.p variants={childVariants} className="text-lg text-slate-700 max-w-2xl">
//                 Building projects isn't just about adding to your resume—it's about solving real problems, working in
//                 teams, and creating something meaningful that showcases your unique abilities.
//               </motion.p>

//               <motion.div
//                 variants={childVariants}
//                 className="bg-white p-6 rounded-xl shadow-lg border border-green-100 border-l-4 border-b-4 border-green-500"
//               >
//                 <h3 className="font-bold text-xl text-green-600 mb-3">Project Benefits</h3>
//                 <ul className="space-y-2">
//                   <li className="flex items-start space-x-2">
//                     <div className="bg-green-500 rounded-full p-1 mt-1">
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <p className="text-slate-700">Enhances your resume with tangible accomplishments</p>
//                   </li>
//                   <li className="flex items-start space-x-2">
//                     <div className="bg-green-500 rounded-full p-1 mt-1">
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <p className="text-slate-700">Develops teamwork and communication skills</p>
//                   </li>
//                   <li className="flex items-start space-x-2">
//                     <div className="bg-green-500 rounded-full p-1 mt-1">
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <p className="text-slate-700">Creates a portfolio that demonstrates your capabilities</p>
//                   </li>
//                   <li className="flex items-start space-x-2">
//                     <div className="bg-green-500 rounded-full p-1 mt-1">
//                       <svg
//                         className="w-4 h-4 text-white"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                       </svg>
//                     </div>
//                     <p className="text-slate-700">Builds confidence in your technical abilities</p>
//                   </li>
//                 </ul>
//               </motion.div>

//               {/* Testimonials - Desktop Only */}
//               {!isMobile && (
//                 <motion.div variants={childVariants} className="mt-8">
//                   <h3 className="text-xl font-bold mb-4">What Participants Say</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <Card className="bg-gradient-to-br from-green-50 border-l-4 border-b-4 border-green-500 to-white">
//                       <CardContent className="">
//                         <p className="italic text-slate-600 mb-4">
//                           "The hackathon project I built became the centerpiece of my portfolio and helped me land my
//                           dream job at a tech startup."
//                         </p>
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
//                             <span className="font-bold text-green-700">JD</span>
//                           </div>
//                           <div>
//                             <p className="font-medium">Jamie Doe</p>
//                             <p className="text-xs text-slate-500">Software Engineer</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                     <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-b-4 border-green-500">
//                       <CardContent className="">
//                         <p className="italic text-slate-600 mb-4">
//                           "Our hackathon project evolved into a startup that just closed its first round of funding. It
//                           all started with a weekend of coding!"
//                         </p>
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
//                             <span className="font-bold text-green-700">AS</span>
//                           </div>
//                           <div>
//                             <p className="font-medium">Alex Smith</p>
//                             <p className="text-xs text-slate-500">Founder & CTO</p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>
//                 </motion.div>
//               )}
//             </motion.div>

//             {/* For mobile, we'll show Lottie after the content */}
//             {isMobile && (
//               <motion.div initial="hidden" animate={controls[3]} variants={fadeIn} className="relative h-[300px]">
//                 <div className="w-full h-full">
//                   <Lottie
//                     animationData={require("@/app/assests/build.json")}
//                     loop={true}
//                     className="w-full h-full object-contain"
//                   />
//                 </div>
//               </motion.div>
//             )}
//           </div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1.5, duration: 1 }}
//             className="mt-16 text-center"
//           >
//             <div className="max-w-2xl mx-auto">
//               <h3 className="text-2xl font-bold mb-4">Ready to Start Your Hackathon Journey?</h3>
//               <p className="text-slate-600 mb-6">
//                 Join thousands of innovators who are building the future through hackathons. Find your next event,
//                 connect with teammates, and showcase your skills.
//               </p>
//               <div className="flex flex-wrap justify-center gap-4">
//                 <Button
//                   size="lg"
//                   className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
//                 >
//                   Find a Hackathon
//                 </Button>
//                 <Button
//                   size="lg"
//                   variant="outline"
//                   className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   Create Your Profile
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
//     </div>
//   )
// }

"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Acme } from "next/font/google"
import { ChevronDown } from "lucide-react"

// Import Lottie components
import Lottie from "lottie-react"

// Import UI components
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const acme = Acme({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

// Skill development data for visualization
const skillDevelopmentData = [
  { skill: "Problem Solving", before: 65, after: 92 },
  { skill: "Teamwork", before: 70, after: 95 },
  { skill: "Technical Skills", before: 60, after: 88 },
  { skill: "Time Management", before: 55, after: 85 },
  { skill: "Communication", before: 68, after: 90 },
]

export default function Banner() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const [sectionInView, setSectionInView] = useState([false, false, false, false])

  // State for interactive elements
  const [selectedHackathon, setSelectedHackathon] = useState(1)
  const [progressValues, setProgressValues] = useState(skillDevelopmentData.map((item) => item.before))
  const [showAfterValues, setShowAfterValues] = useState(false)

  // Animation controls for each section
  const controls = [useAnimation(), useAnimation(), useAnimation(), useAnimation()]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newSectionInView = [...sectionInView]
        entries.forEach((entry) => {
          if (sectionRefs.some((ref) => ref.current === entry.target)) {
            const sectionIndex = sectionRefs.findIndex((ref) => ref.current === entry.target)
            newSectionInView[sectionIndex] = entry.isIntersecting
          }
        })
        setSectionInView(newSectionInView)
      },
      {
        threshold: 0.3,
      },
    )

    sectionRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    sectionInView.forEach((inView, index) => {
      if (inView) {
        setActiveSection(index)
        controls[index].start("visible")
      }
    })
  }, [sectionInView])

  // Animate progress bars when section 3 is in view
  useEffect(() => {
    if (activeSection === 2 && !showAfterValues) {
      setTimeout(() => {
        setShowAfterValues(true)
        setProgressValues(skillDevelopmentData.map((item) => item.after))
      }, 1000)
    } else if (activeSection !== 2 && showAfterValues) {
      setShowAfterValues(false)
      setProgressValues(skillDevelopmentData.map((item) => item.before))
    }
  }, [activeSection, showAfterValues])

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

  const timelineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  }

  return (
    <div className="w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Welcome Section */}
      <section
        ref={sectionRefs[0]}
        className="min-h-screen w-full relative flex items-start md:items-center py-16 md:py-8 lg:py-0"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial="hidden"
              animate={controls[0]}
              variants={isMobile ? fadeIn : fadeInFromLeft}
              className="space-y-6 md:space-y-8 pt-8 md:pt-0"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                READY IN SECONDS
              </motion.div>

              <motion.div variants={childVariants} className="space-y-2">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl/none font-bold tracking-tighter ${acme.className}`}>
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

              <motion.p variants={childVariants} className="text-lg md:text-xl text-slate-700 max-w-lg">
                Your ultimate platform for discovering, connecting, and participating in the world's most exciting
                hackathons. Level up your skills, build your network, and showcase your talent.
              </motion.p>

              <motion.div variants={childVariants} className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-none transition-all duration-300 transform hover:scale-105"
                >
                  Find Hackathons
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-none transition-all duration-300"
                >
                  Create Account
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls[0]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="relative h-full flex items-center justify-center"
            >
              <div className="w-full h-[400px] md:h-[500px] lg:h-[600px]">
                <Lottie
                  animationData={require("@/app/assests/landingPerson.json")}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>

          <div className="relative mt-12 mb-8 h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-16 bg-green-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium">
              Breaking boundaries since 2024
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToNextSection(0)}
          >
            <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Why are we here? Section */}
      <section
        ref={sectionRefs[1]}
        className="min-h-screen w-full relative flex items-center py-16 md:py-24 bg-gradient-to-br from-slate-100 to-slate-200"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* For desktop, we'll show Lottie on the left for this section */}
            {!isMobile && (
              <motion.div
                initial="hidden"
                animate={controls[1]}
                variants={fadeInFromLeft}
                className="relative h-full flex flex-col justify-between"
              >
                <div className="w-full h-[400px] md:h-[500px]">
                  <Lottie
                    animationData={require("@/app/assests/codingPerson.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Timeline - Desktop only */}
                {!isTablet && (
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
                        variants={timelineVariants}
                        initial="hidden"
                        animate={controls[1]}
                      />
                      <div className="flex justify-between relative z-10">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">1</span>
                          </div>
                          <p className="text-xs font-medium text-center">Register</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">2</span>
                          </div>
                          <p className="text-xs font-medium text-center">Form Team</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">3</span>
                          </div>
                          <p className="text-xs font-medium text-center">Ideate</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">4</span>
                          </div>
                          <p className="text-xs font-medium text-center">Build</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-green-500 mb-2 flex items-center justify-center">
                            <span className="text-white text-xs">5</span>
                          </div>
                          <p className="text-xs font-medium text-center">Present</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            <motion.div
              initial="hidden"
              animate={controls[1]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="space-y-6 md:space-y-8 h-full flex flex-col justify-center"
            >
              <motion.div
                variants={childVariants}
                className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                Why Are We Here?
              </motion.div>

              <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Hackathons, <br />
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                    Where Ideas Thrive
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

              <motion.p variants={childVariants} className="text-lg text-slate-700 w-full lg:my-8">
                Hackathons provide a unique environment where creativity meets technical skill. They're not just
                competitions; they're incubators for innovation, collaboration, and rapid learning.
              </motion.p>

              <motion.div variants={childVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col">
                  <h3 className="font-bold text-lg text-green-600 mb-2">Community</h3>
                  <p className="text-slate-600">Connect with like-minded innovators and build lasting relationships</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col">
                  <h3 className="font-bold text-lg text-green-600 mb-2">Learning</h3>
                  <p className="text-slate-600">Accelerate your skills through hands-on challenges and mentorship</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col">
                  <h3 className="font-bold text-lg text-green-600 mb-2">Innovation</h3>
                  <p className="text-slate-600">Transform ideas into working prototypes in just 24-48 hours</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-none transition-shadow duration-300 border-l-4 border-b-4 border-green-500 h-full flex flex-col">
                  <h3 className="font-bold text-lg text-green-600 mb-2">Opportunity</h3>
                  <p className="text-slate-600">Win prizes, secure funding, or even launch a startup</p>
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

          <div className="relative mt-12 mb-8 h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-16 bg-green-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium">
              Crafted with precision
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => scrollToNextSection(1)}
          >
            <ChevronDown className="w-10 h-10 text-green-500 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* Coding Section */}
      <section ref={sectionRefs[2]} className="min-h-screen w-full relative flex items-center py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                Unleash the{" "}
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                    Power
                  </span>
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

              <motion.p variants={childVariants} className="text-lg text-slate-700">
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

              {/* Skill Development Visualization */}
              <motion.div
                variants={childVariants}
                className="pt-6 mt-4 bg-white border-l-4 border-b-4 border-green-500 rounded-md p-6 shadow-md hover:shadow-none transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>Skill Development</span>
                  <Badge
                    variant={showAfterValues ? "default" : "outline"}
                    className={showAfterValues ? "bg-green-500" : ""}
                  >
                    {showAfterValues ? "After Hackathons" : "Before Hackathons"}
                  </Badge>
                </h3>
                <div className="space-y-4">
                  {skillDevelopmentData.map((item, index) => (
                    <div key={item.skill} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.skill}</span>
                        <span className="font-medium">{progressValues[index]}%</span>
                      </div>
                      <Progress
                        value={progressValues[index]}
                        className="h-2 bg-green-100"
                        style={{
                          transition: "all 1s ease-out",
                        }}
                      >
                        <div className="h-full bg-green-600 rounded-full" />
                      </Progress>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate={controls[2]}
              variants={isMobile ? fadeIn : fadeInFromRight}
              className="relative flex flex-col h-full justify-between"
            >
              <div className="w-full h-[300px] md:h-[400px]">
                <Lottie
                  animationData={require("@/app/assests/email.json")}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Project Impact - Now under email lottie */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-none transition-all duration-300 mt-4 border-l-4 border-b-4 border-green-500"
              >
                <h3 className="text-lg font-bold mb-4 text-green-600">Project Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Resume Enhancement</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2 bg-green-100">
                      <div className="h-full bg-green-600 rounded-full" />
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Portfolio Growth</span>
                      <span className="font-medium">88%</span>
                    </div>
                    <Progress value={88} className="h-2 bg-green-100">
                      <div className="h-full bg-green-600 rounded-full" />
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Interview Success</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2 bg-green-100">
                      <div className="h-full bg-green-600 rounded-full" />
                    </Progress>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Job Offers</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-green-100">
                      <div className="h-full bg-green-600 rounded-full" />
                    </Progress>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">
                  Based on survey of 500+ hackathon participants
                </p>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative mt-12 mb-8 h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-16 bg-green-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium">
              Elevate your digital presence
            </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* For desktop, we'll show Lottie on the left for this section */}
            {!isMobile && (
              <motion.div
                initial="hidden"
                animate={controls[3]}
                variants={fadeInFromLeft}
                className="relative flex flex-col h-full"
              >
                <div className="w-full h-[400px] md:h-[500px]">
                  <Lottie
                    animationData={require("@/app/assests/build.json")}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Interactive Project Stats - Desktop Only */}
                {!isTablet && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-none transition-all duration-300 mt-8 border-l-4 border-b-4 border-green-500"
                  >
                    <h3 className="text-lg font-bold mb-4 text-green-600">Project Impact</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resume Enhancement</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2 bg-green-100">
                          <div className="h-full bg-green-600 rounded-full" />
                        </Progress>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Portfolio Growth</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <Progress value={88} className="h-2 bg-green-100">
                          <div className="h-full bg-green-600 rounded-full" />
                        </Progress>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Interview Success</span>
                          <span className="font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2 bg-green-100">
                          <div className="h-full bg-green-600 rounded-full" />
                        </Progress>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Job Offers</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2 bg-green-100">
                          <div className="h-full bg-green-600 rounded-full" />
                        </Progress>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 text-center">
                      Based on survey of 500+ hackathon participants
                    </p>
                  </motion.div>
                )}
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
                className="inline-block bg-green-100 text-green-600 px-4 py-1 rounded-full font-medium text-sm"
              >
                Building a Project
              </motion.div>

              <motion.h2 variants={childVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                From{" "}
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">
                    Concept
                  </span>
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

              <motion.p variants={childVariants} className="text-lg text-slate-700 max-w-2xl">
                Building projects isn't just about adding to your resume—it's about solving real problems, working in
                teams, and creating something meaningful that showcases your unique abilities.
              </motion.p>

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

              {/* Testimonials - Desktop Only */}
              {!isMobile && (
                <motion.div variants={childVariants} className="mt-8">
                  <h3 className="text-xl font-bold mb-4">What Participants Say</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-b-4 border-green-500 shadow-md hover:shadow-none transition-all duration-300">
                      <CardContent className="pt-6">
                        <p className="italic text-slate-600 mb-4">
                          "The hackathon project I built became the centerpiece of my portfolio and helped me land my
                          dream job at a tech startup."
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
                    <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-b-4 border-green-500 shadow-md hover:shadow-none transition-all duration-300">
                      <CardContent className="pt-6">
                        <p className="italic text-slate-600 mb-4">
                          "Our hackathon project evolved into a startup that just closed its first round of funding. It
                          all started with a weekend of coding!"
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
              )}
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

          <div className="relative mt-12 mb-8 h-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-16 bg-green-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 top-16 bg-green-100 text-green-600 px-4 py-1 rounded-full whitespace-nowrap text-sm font-medium">
              Beautiful experiences, made simple
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-16 text-center"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Hackathon Journey?</h3>
              <p className="text-slate-600 mb-6">
                Join thousands of innovators who are building the future through hackathons. Find your next event,
                connect with teammates, and showcase your skills.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium px-8 py-6 rounded-lg shadow-lg hover:shadow-none transition-all duration-300 transform hover:scale-105"
                >
                  Find a Hackathon
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-6 rounded-lg shadow-md hover:shadow-none transition-all duration-300"
                >
                  Create Your Profile
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

