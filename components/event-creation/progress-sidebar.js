"use client"

import { usePathname, useRouter } from "next/navigation"
import { CircularProgressIndicator } from "@/components/ui/circular-progress"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEventFormContext } from "./event-data-provider"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/providers"
import { useEventContext } from "./event-context"

const SECTIONS = [
      {
        id: "basic",
        name: "Basic Details",
        weight: 25,
        path: "",
        description: "Set the title and short description for your event",
      },
      {
        id: "additional",
        name: "Additional Details",
        weight: 15,
        path: "additional",
        description: "Configure team sizes and registration costs",
      },
      {
        id: "media",
        name: "Media",
        weight: 15,
        path: "media",
        description: "Upload banner images and set event dates",
      },
      {
        id: "sponsors",
        name: "Sponsors & Prizes",
        weight: 20,
        path: "sponsors",
        description: "Add sponsors and define prizes for participants",
      },
      {
        id: "schedule",
        name: "Schedule",
        weight: 15,
        path: "schedule",
        description: "Create a timeline of activities for your event",
      },
      {
        id: "contact-detail",
        name: "Contact Details",
        weight: 15,
        path: "contact",
        description: "Provide contact information for your event",
      },
      {
        id: "data-collection",
        name: "Data Collection",
        weight: 5,
        path: "data",
        description: "Select the data you want to collect from participants",
      },
      {
        id: "venue",
        name: "Venue",
        weight: 10,
        path: "venue",
        description: "Set the location details for your event",
      },
      
];

export function ProgressSidebar({ currentSection = "basic" }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isFormDirty, hasInitializedSection, clearSectionChanges, clearCachedFormData } = useEventFormContext()
  const [completedSections, setCompletedSections] = useState([])
  const progress = Math.round((completedSections.length / SECTIONS.length) * 100)
  const { eventId } = useEventContext()

  useEffect(() => {
    for (const section of SECTIONS) {
      clearCachedFormData(section.id)
      clearSectionChanges(section.id)
      }
      console.log("called")
    },[eventId])

  const handleSectionClick = (sectionId, path) => {
    router.push(`/host/create/${eventId}/${path}`)
  }

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="w-full md:w-80">
        <div className="flex flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-800">Event Progress</h2>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {SECTIONS.map((section, index) => {
                const isActive =
                  pathname === `/host/create/${eventId}/${section.path}` ||
                  (pathname === `/host/create/${eventId}` && section.id === "basic")
                const isCompleted = completedSections.includes(section.id)
                const isDirty = isFormDirty(section.id)
                const isInitialized = hasInitializedSection(section.id)

                return (
                  <motion.li
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isActive ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-between px-3 py-2 text-left transition-all duration-300",
                            isActive && "bg-green-600 text-white hover:bg-green-700",
                            isCompleted && !isActive && "text-green-600",
                            !isCompleted && !isActive && "text-gray-700",
                          )}
                          onClick={() => handleSectionClick(section.id, section.path)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-300",
                                isActive && "border-white bg-white",
                                isCompleted && !isActive && "border-green-600 bg-green-100",
                              )}
                            >
                              {isCompleted ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <span className={cn("text-xs", "text-gray-600")}>{index + 1}</span>
                              )}
                            </div>
                            <span className="font-medium">
                              {section.name}
                              {isDirty && <span className="text-amber-500 ml-1">*</span>}
                            </span>
                          </div>

                          <div className="flex items-center">
                            {isDirty && !isActive && <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />}
                            {isActive && (
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </motion.div>
                            )}
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-green-800 text-white border-green-700">
                        <p>{section.description}</p>
                        {isDirty && <p className="text-amber-300 mt-1">This section has unsaved changes</p>}
                      </TooltipContent>
                    </Tooltip>

                    {index < SECTIONS.length - 1 && (
                      <div
                        className={cn(
                          "h-6 w-px ml-6 bg-gray-200 transition-all duration-300",
                          isCompleted && "bg-green-300",
                        )}
                      ></div>
                    )}
                  </motion.li>
                )
              })}
            </ul>
          </nav>

        </div>
      </aside>
    </TooltipProvider>
  )
}
