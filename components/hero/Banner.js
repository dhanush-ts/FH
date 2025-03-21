"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import RotatingText from "../ui/RotatingText/RotatingText"
import Btn09 from "../ui/get-started-button"

export default function Banner() {
  return (
    <div className="relative w-full bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 overflow-hidden">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="h-[300px] max-w-7xl mx-auto md:h-[450px] relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center space-y-6 md:space-y-8 z-10 py-8 md:py-0">
              <div className="space-y-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-5xl">
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
                <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-md leading-relaxed">
                  Discover, connect, and grow. Join the innovation wave today!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="transform hover:scale-105 transition-transform duration-200">
                  <Btn09 className="text-black font-semibold text-lg sm:text-xl p-3 sm:p-4 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow duration-200">
                    Get Started !
                  </Btn09>
                </div>
              </div>
            </div>

            {/* Right side - Lottie animations */}
            <div className="hidden md:block absolute -right-24 w-[150%] md:w-[60%] lg:w-[70%] h-full">
              {/* <div className="relative h-full w-full"> */}
                {/* <div className="absolute bottom-0 right-0 w-full h-full"> */}
                  <DotLottieReact
                    src="https://lottie.host/1a152ffb-afc9-4e30-a3e2-ab79a9e67355/wqdhYEEymI.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-contain transform translate-y-[5%]"
                  />
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.1),transparent_50%)]" />
    </div>
  )
}

