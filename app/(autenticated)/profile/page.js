"use client"
import { motion, AnimatePresence } from "framer-motion"
import Banner2 from "@/components/hero/Banner2"
import BasicInfo from "@/components/profile/BasicInfo"
import EducationTimeline from "@/components/profile/Education"
import AdditionalInfo from "@/components/profile/AdditionalInfo"
import Projects from "@/components/profile/Projects"
import Achievements from "@/components/profile/Achievements"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("education")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Banner2 />

      <motion.div 
        className="container mx-auto px-4 py-8" 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <BasicInfo />
            <AdditionalInfo />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm mb-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger 
                    value="education"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Education
                  </TabsTrigger>
                  <TabsTrigger 
                    value="projects"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Projects
                  </TabsTrigger>
                  <TabsTrigger 
                    value="achievements"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                  >
                    Achievements
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="education" className="space-y-4 mt-0">
                    <EducationTimeline />
                  </TabsContent>

                  <TabsContent value="projects" className="space-y-4 mt-0">
                    <Projects />
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-4 mt-0">
                    <Achievements />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
