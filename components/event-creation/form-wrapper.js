"use client"

import React from "react"
import { useEffect, useRef } from "react"
import { useEventFormContext} from "./event-data-provider"

export function FormWrapper({
  children,
  section,
  initialData,
  formData,
  isDirty = false,
  onDataChange,
}) {
  const { cacheFormData, setChangedFields, getCurrentSectionData, hasInitializedSection, markSectionInitialized } =
    useEventFormContext()

  const isInitializedRef = useRef(false)
  const hasCalledOnDataChangeRef = useRef(false)

  // Handle form data initialization and caching
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Get any previously cached data
    const cachedData = getCurrentSectionData(section)
    const isInitialized = hasInitializedSection(section)

    // If we have form data from the parent, use that
    if (formData && Object.keys(formData).length > 0) {
      cacheFormData(section, formData)

      // If the form is dirty, update the changed fields
      if (isDirty) {
        // Calculate changed fields by comparing with initialData
        const changedFields = Object.entries(formData).reduce(
          (acc, [key, value]) => {
            if (initialData[key] !== value) {
              acc[key] = value
            }
            return acc
          },
          {},
        )

        setChangedFields(section, changedFields)
      }
    }
    // If the section hasn't been initialized yet, use initial data
    else if (!isInitialized) {
      cacheFormData(section, initialData)
      markSectionInitialized(section)

      // Notify parent of initial data
      if (onDataChange && !hasCalledOnDataChangeRef.current) {
        onDataChange(initialData)
        hasCalledOnDataChangeRef.current = true
      }
    }
    // Otherwise, if we have cached data, use that
    else if (Object.keys(cachedData).length > 0 && onDataChange && !hasCalledOnDataChangeRef.current) {
      // Notify parent of cached data
      onDataChange(cachedData)
      hasCalledOnDataChangeRef.current = true
    }
  }, [
    section,
    initialData,
    cacheFormData,
    getCurrentSectionData,
    formData,
    isDirty,
    onDataChange,
    setChangedFields,
    hasInitializedSection,
    markSectionInitialized,
  ])

  return <>{children}</>
}
