"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"


const EventDataContext = createContext(undefined)

export function EventDataProvider({
  children,
  initialEventId,
  initialEventData,
}) {
  const [eventId, setEventId] = useState(initialEventId)
  const [eventData, setEventData] = useState(initialEventData)
  const [currentSection, setCurrentSection] = useState("basic")
  const [sectionProgress, setSectionProgress] = useState({})
  const [sectionData, setSectionDataState] = useState({})
  const [originalSectionData, setOriginalSectionData] = useState({})

  // Use refs to prevent infinite loops
  const initialEventIdRef = useRef(initialEventId)
  const initialEventDataRef = useRef(initialEventData)

  // Update event ID if it changes (e.g., after creation)
  useEffect(() => {
    if (initialEventId !== initialEventIdRef.current && initialEventId !== "new") {
      setEventId(initialEventId)
      initialEventIdRef.current = initialEventId
    }
  }, [initialEventId])

  // Update event data if it changes
  useEffect(() => {
    if (initialEventData && initialEventData !== initialEventDataRef.current) {
      setEventData(initialEventData)
      initialEventDataRef.current = initialEventData
    }
  }, [initialEventData])

  const updateEventData = (sectionId, data) => {
    setEventData((prev) => {
      if (!prev) return data
      return { ...prev, ...data }
    })
  }

  const updateSectionProgress = (sectionId, progress) => {
    setSectionProgress((prev) => {
      // Only update if the progress has actually changed
      if (prev[sectionId] === progress) return prev
      return {
        ...prev,
        [sectionId]: progress,
      }
    })
  }

  const setSectionData = (sectionId, data) => {
    setSectionDataState((prev) => {
      // Only update if the data has actually changed
      if (JSON.stringify(prev[sectionId]) === JSON.stringify(data)) return prev
      return {
        ...prev,
        [sectionId]: data,
      }
    })

    // Store original data for change detection
    if (!originalSectionData[sectionId]) {
      setOriginalSectionData((prev) => ({
        ...prev,
        [sectionId]: { ...data },
      }))
    }
  }

  const hasChanges = (sectionId) => {
    const original = originalSectionData[sectionId]
    const current = sectionData[sectionId]

    if (!original || !current) return false

    // Compare objects to detect changes
    return JSON.stringify(original) !== JSON.stringify(current)
  }

  return (
    <EventDataContext.Provider
      value={{
        eventId,
        eventData,
        setEventData,
        updateEventData,
        currentSection,
        setCurrentSection,
        sectionProgress,
        updateSectionProgress,
        sectionData,
        setSectionData,
        hasChanges,
      }}
    >
      {children}
    </EventDataContext.Provider>
  )
}

export function useEventData() {
  const context = useContext(EventDataContext)
  if (context === undefined) {
    throw new Error("useEventData must be used within an EventDataProvider")
  }
  return context
}
