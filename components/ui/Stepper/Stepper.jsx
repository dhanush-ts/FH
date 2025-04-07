"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"


export default function MultiStepForm({ steps, currentStep, onStepChange, isLoading }) {
  const [completedSteps, setCompletedSteps] = useState([1])

  // Update completed steps when current step changes
  useEffect(() => {
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) {
        return [...prev, currentStep]
      }
      return prev
    })
  }, [currentStep])

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const success = await onStepChange(currentStep + 1)
      if (success) {
        setCompletedSteps((prev) => {
          if (!prev.includes(currentStep + 1)) {
            return [...prev, currentStep + 1]
          }
          return prev
        })
      }
    }
  }

  const handleBack = async () => {
    if (currentStep > 1) {
      await onStepChange(currentStep - 1)
    }
  }

  const handleStepClick = async (step) => {
    // Only allow clicking on completed steps or the next available step
    if (completedSteps.includes(step) || step === Math.min(...completedSteps) + 1) {
      await onStepChange(step)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = completedSteps.includes(stepNumber) && currentStep > stepNumber
          const isAccessible = completedSteps.includes(stepNumber) || stepNumber === Math.min(...completedSteps) + 1

          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <button
                onClick={() => handleStepClick(stepNumber)}
                disabled={!isAccessible}
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-200",
                  isActive
                    ? "bg-green-500 text-white"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : isAccessible
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <span className="text-sm">{stepNumber}</span>}
              </button>

              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute h-0.5 w-full max-w-[100px] bg-gray-200">
                  <div
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="min-h-[300px]">{steps[currentStep - 1].content}</div>

      <div className="flex justify-between mt-6">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < steps.length && (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!steps[currentStep - 1].isValid || isLoading}
            className="bg-green-500 hover:bg-green-600"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

