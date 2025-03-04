"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { getCookie } from "cookies-next"
import { MapPin, Github, Linkedin, ExternalLink } from 'lucide-react'
import { fetchData } from "@/lib/api"

export default function Banner2() {
  const [profileData, setProfileData] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    <div className="relative overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-300 overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: 1.15,
            x: [0, 10, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            scale: { duration: 10, repeat: Infinity, repeatType: "reverse" },
            x: { duration: 20, repeat: Infinity, repeatType: "reverse" },
            y: { duration: 15, repeat: Infinity, repeatType: "reverse" }
          }}
          style={{
            backgroundImage: "url('/placeholder.svg?height=400&width=1200')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 + 0.2
              }}
              animate={{ 
                y: ["-10%", "110%"],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 20
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full overflow-hidden border-4 border-white/80 shadow-xl transform hover:scale-105 transition-transform duration-300">
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
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            />
            <motion.div 
              className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-blue-400 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            />
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
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {profileData?.first_name} {profileData?.last_name}
                </h1>
                <p className="text-white/80 mt-2">{profileData?.email}</p>
                
                {/* Location with animation */}
                <motion.div 
                  className="flex items-center justify-center md:justify-start mt-2 text-white/90"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Chennai, India</span>
                </motion.div>
                
                {/* Social links */}
                <div className="flex space-x-3 mt-4 justify-center md:justify-start">
                  {additionalInfo?.github_url && (
                    <motion.a
                      href={additionalInfo.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Github className="h-5 w-5 text-white" />
                    </motion.a>
                  )}
                  
                  {additionalInfo?.linkedin_url && (
                    <motion.a
                      href={additionalInfo.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Linkedin className="h-5 w-5 text-white" />
                    </motion.a>
                  )}
                  
                  {additionalInfo?.website_url && (
                    <motion.a
                      href={additionalInfo.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <ExternalLink className="h-5 w-5 text-white" />
                    </motion.a>
                  )}
                </div>
                
                {additionalInfo?.skills && additionalInfo.skills.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                    {additionalInfo.skills.slice(0, 4).map((skill, index) => (
                      <motion.span 
                        key={index} 
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white shadow-sm hover:bg-white/30 transition-colors duration-300 cursor-default"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        whileHover={{ y: -2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                    {additionalInfo.skills.length > 4 && (
                      <motion.span 
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white shadow-sm hover:bg-white/30 transition-colors duration-300 cursor-default"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                        whileHover={{ y: -2 }}
                      >
                        +{additionalInfo.skills.length - 4} more
                      </motion.span>
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
