"use client"

import React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

const EventFormContext = createContext(undefined)

export const EventFormProvider = ({ children }) => {
  // Initialize state with empty section changes
  const [sectionChanges, setSectionChanges] = useState({})
  const [initializedSections, setInitializedSections] = useState(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Track changed fields for a specific section
  const setChangedFields = useCallback((section, fields) => {
    setSectionChanges((prev) => {
      // Skip update if nothing changed
      if (
        prev[section]?.isDirty === Object.keys(fields).length > 0 &&
        JSON.stringify(prev[section]?.changedFields) === JSON.stringify(fields)
      ) {
        return prev
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          isDirty: Object.keys(fields).length > 0,
          changedFields: fields,
          cachedFormData: prev[section]?.cachedFormData ?? {},
        },
      }
    })
  }, [])

  // Cache form data for a specific section
  const cacheFormData = useCallback((section, data) => {
    setSectionChanges((prev) => {
      // Skip update if data hasn't changed
      if (JSON.stringify(prev[section]?.cachedFormData) === JSON.stringify(data)) {
        return prev
      }

      return {
        ...prev,
        [section]: {
          ...(prev[section] || { isDirty: false, changedFields: {} }),
          cachedFormData: data,
        },
      }
    })
  }, [])

  // Clear changes for a specific section (typically after saving)
  const clearSectionChanges = useCallback((section) => {
    setSectionChanges((prev) => {
      const newState = { ...prev }
      if (newState[section]) {
        newState[section] = {
          ...newState[section],
          isDirty: false,
          changedFields: {},
        }
      }
      return newState
    })
  }, [])

  // Get current data for a section (cached or empty)
  const getCurrentSectionData = useCallback(
    (section) => {
      return sectionChanges[section]?.cachedFormData || {}
    },
    [sectionChanges],
  )

  // Check if a form section is dirty
  const isFormDirty = useCallback(
    (section) => {
      return sectionChanges[section]?.isDirty || false
    },
    [sectionChanges],
  )

  // Check if a section has been initialized
  const hasInitializedSection = useCallback(
    (section) => {
      return initializedSections.has(section)
    },
    [initializedSections],
  )

  // Mark a section as initialized
  const markSectionInitialized = useCallback((section) => {
    setInitializedSections((prev) => {
      if (prev.has(section)) return prev
      const newSet = new Set(prev)
      newSet.add(section)
      return newSet
    })
  }, [])

  // Persist form state to localStorage when it changes
  useEffect(() => {
    if (isInitialLoad) return

    try {
      localStorage.setItem("eventFormState", JSON.stringify(sectionChanges))
      localStorage.setItem("initializedSections", JSON.stringify(Array.from(initializedSections)))
    } catch (error) {
      console.error("Failed to save form state to localStorage:", error)
    }
  }, [sectionChanges, initializedSections, isInitialLoad])

  // Load form state from localStorage on initial render
  useEffect(() => {
    try {
      const savedState = localStorage.getItem("eventFormState")
      const savedInitializedSections = localStorage.getItem("initializedSections")

      if (savedState) {
        setSectionChanges(JSON.parse(savedState))
      }

      if (savedInitializedSections) {
        setInitializedSections(new Set(JSON.parse(savedInitializedSections)))
      }

      setIsInitialLoad(false)
    } catch (error) {
      console.error("Failed to load form state from localStorage:", error)
      setIsInitialLoad(false)
    }
  }, [])

  const contextValue = {
    sectionChanges,
    setChangedFields,
    cacheFormData,
    clearSectionChanges,
    getCurrentSectionData,
    isFormDirty,
    hasInitializedSection,
    markSectionInitialized,
  }

  return <EventFormContext.Provider value={contextValue}>{children}</EventFormContext.Provider>
}

export const useEventFormContext = () => {
  const context = useContext(EventFormContext)
  if (!context) {
    throw new Error("useEventFormContext must be used within EventFormProvider")
  }
  return context
}
