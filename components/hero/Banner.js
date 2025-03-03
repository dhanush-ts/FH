"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import RotatingText from "../ui/RotatingText/RotatingText"

export default function Banner() {

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[400px] max-w-7xl m-auto md:h-[400px] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            <div className="flex flex-col justify-center space-y-4 z-10">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                Welcome to FindHacks <br /> Your hub for{" "}
                <span className="relative inline-block">
                  <RotatingText 
                  texts={['Hackathons','Symposiums', 'Fests']} 
                  mainClassName="px-2 sm:px-2 md:px-3  bg-green-500 text-black overflow-hidden py-0.5 sm:py-1 md:py-1.5 justify-center rounded-lg"
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
              <p className="text-slate-600 lg:text-nowrap max-w-md md:text-xl">
              Discover, connect, and grow. Join the innovation wave today!”
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="#organizers"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  For organizers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="#participants"
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  For participants
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right side - Lottie animations - Hidden on mobile */}
            <div className="hidden md:flex absolute -right-48 bottom-0 overflow-hidden h-full w-full justify-end">
              <div className="flex flex-row transform-gpu origin-bottom">
                {/* <div className="w-[400px] h-full overflow-y-hidden relative">
                  <DotLottieReact
                    src="https://lottie.host/504971d7-b4d8-4693-96db-3542620a5840/CCaklii2uA.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-cover bottom-0 transform translate-y-[10%]"
                  />
                </div> */}
                <div className="overflow-y-hidden relative">
                  <DotLottieReact
                    src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-cover transform translate-y-[5%]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

