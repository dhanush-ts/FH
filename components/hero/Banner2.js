"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { fetchData } from "@/lib/api"


export default function Banner2() {
  const [profileData, setProfileData] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cookies = document?.cookie ? document?.cookie?.split("; ") : []
    const jwtCookie = cookies.find((row) => row.startsWith("jwt=")).split("=")[1]
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        const basicData = await fetchData("user/basic-profile/")
        const additionalData = await fetchData("user/additional-info/")

        setProfileData(basicData)
        setAdditionalInfo(additionalData)
      } catch (error) {
        console.error("Failed to fetch profile data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  return (
    <div className="relative bg-gradient-to-r from-primary/90 to-primary/70 text-white">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="container mx-auto px-4 py-16 relative">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/80 shadow-xl">
              {loading ? (
                <div className="h-full w-full bg-gray-300 animate-pulse"></div>
              ) : (
                <img
                  src={additionalInfo?.profile_photo || "/placeholder.svg?height=160&width=160"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-left"
          >
            {loading ? (
              <div className="space-y-3">
                <div className="h-8 w-48 bg-white/20 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-white/20 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {profileData?.first_name} {profileData?.last_name}
                </h1>
                <p className="text-white/80 mt-2">{profileData?.email}</p>

                {additionalInfo?.skills && additionalInfo.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    {additionalInfo.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                        {skill}
                      </span>
                    ))}
                    {additionalInfo.skills.length > 4 && (
                      <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                        +{additionalInfo.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

