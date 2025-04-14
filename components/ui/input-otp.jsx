"use client"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function OtpInput({ length = 6, value, onChange, disabled = false }) {
  const [activeInput, setActiveInput] = useState(0)
  const inputRefs = useRef([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length)
  }, [length])

  // Focus on first input on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [disabled])

  // Handle value change
  const handleChange = (e, index) => {
    const newValue = e.target.value

    if (newValue === "") return

    // Only accept numbers
    if (!/^\d+$/.test(newValue)) return

    // Take the last character if multiple characters are pasted/entered
    const digit = newValue[newValue.length - 1]

    // Update the value
    const newOtp = value.split("")
    newOtp[index] = digit
    onChange(newOtp.join(""))

    // Move to next input if available
    if (index < length - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault()

      // Clear current input
      const newOtp = value.split("")
      newOtp[index] = ""
      onChange(newOtp.join(""))

      // Move to previous input if available
      if (index > 0) {
        setActiveInput(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only proceed if pasted data is numeric and not longer than OTP length
    if (!/^\d+$/.test(pastedData)) return

    const otpValue = pastedData.substring(0, length)
    onChange(otpValue.padEnd(length, ""))

    // Focus on the next empty input or the last input
    const nextIndex = Math.min(otpValue.length, length - 1)
    setActiveInput(nextIndex)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => setActiveInput(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-xl font-semibold rounded-md border-2 focus:border-green-500 focus:outline-none transition-all",
            activeInput === index ? "border-green-500" : "border-gray-300",
            disabled ? "bg-gray-100 text-gray-400" : "bg-white",
          )}
        />
      ))}
    </div>
  )
}
