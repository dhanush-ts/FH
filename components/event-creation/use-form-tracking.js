"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useEventFormContext} from "./event-data-provider"
import { getChangedFields } from "./utility"

export function useFormTracking(section, initialData) {
  const {
    setChangedFields,
    cacheFormData,
    clearSectionChanges,
    getCurrentSectionData,
    hasInitializedSection,
    markSectionInitialized,
  } = useEventFormContext()

  const [formData, setFormData] = useState(initialData || {})
  const [isDirty, setIsDirty] = useState(false)
  const originalDataRef = useRef(initialData || {})
  const isInitializedRef = useRef(false)
  const isUpdatingRef = useRef(false)

  // Load cached data on mount
  useEffect(() => {
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const isInitialized = hasInitializedSection(section)
    const cachedData = getCurrentSectionData(section)

    if (!isInitialized) {
      // First time - use initial data
      setFormData(initialData)
      markSectionInitialized(section)
      cacheFormData(section, initialData)
    } else if (Object.keys(cachedData).length > 0) {
      // Use cached data
      setFormData(cachedData)
      originalDataRef.current = initialData // Keep original data for comparison

      // Calculate if the form is dirty
      const changedFields = getChangedFields(originalDataRef.current, cachedData)
      setIsDirty(Object.keys(changedFields).length > 0)
    }
  }, [section, initialData, getCurrentSectionData, hasInitializedSection, markSectionInitialized, cacheFormData])

  // Update form data and track changes
  const updateFormData = useCallback(
    (newData) => {
      if (isUpdatingRef.current) return
      isUpdatingRef.current = true

      setFormData(newData)
      cacheFormData(section, newData)

      // Calculate changed fields
      const changedFields = getChangedFields(originalDataRef.current, newData)
      const hasChanges = Object.keys(changedFields).length > 0

      setIsDirty(hasChanges)
      setChangedFields(section, changedFields)

      isUpdatingRef.current = false
    },
    [section, cacheFormData, setChangedFields],
  )

  // Clear changes after successful save
  const clearChanges = useCallback(() => {
    clearSectionChanges(section)
    setIsDirty(false)
    // Update the original data reference to the current data
    originalDataRef.current = { ...formData }
  }, [section, clearSectionChanges, formData])

  return {
    formData,
    isDirty,
    updateFormData,
    clearChanges,
  }
}