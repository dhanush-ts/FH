"use client"

import { useEffect, useState } from "react"
import { getCookie } from "cookies-next"
import { motion } from "framer-motion"
import Banner2 from "@/components/hero/Banner2"
import BasicInfo from "@/components/profile/BasicInfo"
import Education from "@/components/profile/Education"
import AdditionalInfo from "@/components/profile/AdditionalInfo"
import Projects from "@/components/profile/Projects"
import Achievements from "@/components/profile/Achievements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Check for JWT token
  useEffect(() => {
    const token = getCookie("jwt")
    if (!token) {
      toast(
        "Authentication Error"
        // description: "Please login to view your profile",
        // variant: "destructive",
      )
    }
  }, [toast])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Banner2 />

      <motion.div className="container mx-auto px-4 py-8" initial="hidden" animate="visible" variants={fadeIn}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar with basic and additional info */}
          <div className="lg:col-span-1 space-y-6">
            <BasicInfo />
            <AdditionalInfo />
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="education" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>

              <TabsContent value="education" className="space-y-4">
                <Education />
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <Projects />
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Achievements />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>

    </main>
  )
}

