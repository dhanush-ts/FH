"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"


export default function MultiStepForm({ steps, currentStep, onStepChange, isLoading }) {
  const [completedSteps, setCompletedSteps] = useState([1])
  const [processingStep, setProcessingStep] = useState(false)

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
      setProcessingStep(true)
      try {
        const success = await onStepChange(currentStep + 1)
        if (success) {
          setCompletedSteps((prev) => {
            if (!prev.includes(currentStep + 1)) {
              return [...prev, currentStep + 1]
            }
            return prev
          })
        }
      } finally {
        setProcessingStep(false)
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
      <div className="flex justify-between items-center mb-6 relative">
        {/* Horizontal connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = currentStep === stepNumber
          const isCompleted = completedSteps.includes(stepNumber) && currentStep > stepNumber
          const isAccessible = completedSteps.includes(stepNumber) || stepNumber === Math.min(...completedSteps) + 1

          return (
            <div key={stepNumber} className="flex flex-col items-center z-10">
              <button
                onClick={() => handleStepClick(stepNumber)}
                disabled={!isAccessible || isLoading}
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-full font-semibold transition-all duration-200",
                  isActive
                    ? "bg-green-500 text-white"
                    : isCompleted
                      ? "bg-green-500 text-white"
                      : isAccessible
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                {isCompleted ? <CheckCircle className="h-6 w-6" /> : <span className="text-base">{stepNumber}</span>}
              </button>

              <span className="mt-2 text-xs font-medium text-gray-700">{steps[index].title.split(" ")[0]}</span>
            </div>
          )
        })}
      </div>

      <div className="min-h-[200px]">{steps[currentStep - 1].content}</div>

      <div className="flex justify-between mt-6">
        {currentStep > 1 ? (
          <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading || processingStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {currentStep < steps.length && (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!steps[currentStep - 1].isValid || isLoading || processingStep}
            className="bg-green-500 hover:bg-green-600"
          >
            {processingStep ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Next"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

