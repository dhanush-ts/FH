"use client"
import { useEffect, useRef, useState } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import RotatingText from "../ui/RotatingText/RotatingText"
import Btn09 from "../ui/get-started-button"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Banner() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 overflow-hidden"
    >
      {/* Mobile-only animated background elements */}
      {isMobile && isLoaded && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-400/80 z-0"
            initial={{ scale: 0, x: -50, y: -50 }}
            animate={{
              scale: [0, 1.2, 1],
              x: [-50, -30],
              y: [-50, -20],
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <motion.div
            className="absolute bottom-0 right-0 w-56 h-56 rounded-full bg-blue-400/80 z-0"
            initial={{ scale: 0, x: 100 }}
            animate={{
              scale: [0, 1.2, 1],
              x: [100, 40],
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />

          <motion.div
            className="absolute top-1/4 right-10 w-16 h-16 rounded-full bg-cyan-400/80 z-0"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              y: [0, -10, 0, 10, 0],
            }}
            transition={{
              scale: { duration: 1, delay: 0.6, ease: "easeOut" },
              y: { repeat: Number.POSITIVE_INFINITY, duration: 3, ease: "easeInOut" },
            }}
          />

          <motion.div
            className="absolute bottom-40 left-10 w-20 h-20 rounded-full bg-purple-400/80 z-0"
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              y: [0, 10, 0, -10, 0],
            }}
            transition={{
              scale: { duration: 1, delay: 0.9, ease: "easeOut" },
              y: { repeat: Number.POSITIVE_INFINITY, duration: 4, ease: "easeInOut" },
            }}
          />

          {/* Animated slicing lines */}
          <motion.div
            className="absolute inset-0 z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                style={{ top: `${20 + i * 15}%` }}
                initial={{ x: "-100%" }}
                animate={{ x: ["100%", "-100%"] }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>

          {/* Mobile Lottie animation */}
          {/* <motion.div
            className="absolute -bottom-10 right-0 w-full h-64 md:hidden z-0 opacity-60"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <DotLottieReact
              src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
              loop
              autoplay
              className="w-full h-full object-contain"
            />
          </motion.div> */}
        </>
      )}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`${isMobile ? "flex py-24 items-center" : "h-[300px] md:h-[450px]"} max-w-7xl mx-auto relative`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Left Content */}
            <motion.div
              className="flex flex-col justify-center space-y-6 md:space-y-8 z-10 py-8 md:py-0"
              initial={isMobile ? { opacity: 0, y: 20 } : {}}
              animate={isMobile ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-4">
                {isMobile ? (
                  <motion.h1
                    className="font-bold tracking-tight text-slate-900 text-5xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <motion.span
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="block"
                    >
                      Welcome to{" "}
                    </motion.span>
                    <motion.span
                      className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 block"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      FindHacks
                    </motion.span>
                    <motion.span
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                      className="block mt-2"
                    >
                      Your hub for{" "}
                    </motion.span>
                    <motion.span
                      className="relative inline-block mt-2"
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                    >
                      <RotatingText
                        texts={["Hackathons", "Symposium", "Fests"]}
                        mainClassName="px-3 bg-green-500 text-black overflow-hidden py-1.5 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={3000}
                      />
                    </motion.span>
                  </motion.h1>
                ) : (
                  <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                    Welcome to{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                      FindHacks
                    </span>{" "}
                    <br />
                    Your hub for{" "}
                    <span className="relative inline-block">
                      <RotatingText
                        texts={["Hackathons", "Symposium", "Fests"]}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-green-500 text-black overflow-hidden py-0.5 sm:py-1 md:py-1.5 justify-center rounded-lg"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={3000}
                      />
                    </span>
                  </h1>
                )}

                <motion.p
                  className="text-black text-xl font-medium max-w-md leading-relaxed"
                  initial={isMobile ? { opacity: 0, y: 20 } : {}}
                  animate={isMobile ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.3 }}
                >
                  Discover, connect, and grow. Join the innovation wave today!
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-2"
                initial={isMobile ? { opacity: 0, y: 20 } : {}}
                animate={isMobile ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <div
                  className={`transform hover:scale-105 transition-transform duration-200 `}
                >
                  <Btn09 className="text-black font-semibold text-lg sm:text-xl p-3 sm:p-4 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-200">
                    Get Started !
                  </Btn09>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Lottie animations (desktop only) */}
            <div className="hidden md:block absolute -right-24 w-[90%] lg:w-[70%] h-full">
              <DotLottieReact
                src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
                loop
                autoplay
                className="w-full h-full object-contain transform translate-y-[5%]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />

      {/* Mobile-only animated particles */}
      {isMobile && isLoaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                x: [0, Math.random() * 50 - 25],
                opacity: [0.2, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

