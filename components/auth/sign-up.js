"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Stepper, { Step } from "@/components/ui/Stepper/Stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchWithAuth } from "@/app/api"
import { CheckCircle, AlertCircle, Mail, Lock, User, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

function SignUp() {
  const router = useRouter()

  // Form state
  const [currentstepState, setcurrentstepState] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([1]) // Start with step 1 as accessible
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSignature, setOtpSignature] = useState("")

  // UI state
  const [isLoadingState, setIsLoadingState] = useState(false)
  const [error, setError] = useState("")
  const [resendDisabled, setResendDisabled] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(30)
  const [stepValidation, setStepValidation] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
  })

  // Validate first step
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      step1: firstName.trim().length >= 2 && lastName.trim().length >= 2,
    }))
  }, [firstName, lastName])

  // Validate second step
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setStepValidation((prev) => ({
      ...prev,
      step2: emailRegex.test(email),
    }))
  }, [email])

  // Validate third step
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      step3: password.length >= 8 && password === confirmPassword,
    }))
  }, [password, confirmPassword])

  // Validate fourth step
  useEffect(() => {
    setStepValidation((prev) => ({
      ...prev,
      step4: otp.length === 6 && /^\d+$/.test(otp),
    }))
  }, [otp])

  // Resend OTP countdown
  useEffect(() => {
    let timer
    if (resendDisabled && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1)
      }, 1000)
    } else if (resendCountdown === 0) {
      setResendDisabled(false)
      setResendCountdown(30)
    }
    return () => clearTimeout(timer)
  }, [resendDisabled, resendCountdown])

  // Check email availability
  const checkEmailAvailability = async () => {
    try {
      setIsLoadingState(true)
      setError("")

      // First, check if email is available (GET request)
      const checkResponse = await fetchWithAuth(`/check-email/?email=${encodeURIComponent(email)}`)

      if (!checkResponse.ok) {
        const errorData = await checkResponse.json()
        setError(errorData.detail || "This email is already registered.")
        toast.error("Email already registered")
        return false
      }

      // Then, register the email (POST request)
      const registerEmailResponse = await fetchWithAuth("/register/email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
      })

      if (!registerEmailResponse.ok) {
        const errorData = await registerEmailResponse.json()
        setError(errorData.detail || "Failed to register email.")
        toast.error("Failed to register email")
        return false
      }

      // Add step 2 to completed steps and allow access to step 3
      setCompletedSteps((prev) => {
        if (!prev.includes(2)) return [...prev, 2, 3]
        return prev
      })
      return true
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
      return false
    } finally {
      setIsLoadingState(false)
    }
  }

  // Register password and get OTP signature
  const registerPassword = async () => {
    try {
      setIsLoadingState(true)
      setError("")

      // First API call: register password
      const response = await fetchWithAuth("/register/password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to register. Please try again.")
        toast.error("Failed to register account")
        return false
      }

      const data = await response.json()
      if (!data || !data.otp_signature) {
        setError("Invalid server response. Missing OTP signature.")
        toast.error("Invalid server response")
        return false
      }

      setOtpSignature(data.otp_signature)

      // Second API call: verify account (GET request)
      const verifyResponse = await fetchWithAuth(
        `/verify-account/?email=${encodeURIComponent(email)}&otp_signature=${data.otp_signature}`,
      )

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        setError(errorData.detail || "Failed to initiate verification. Please try again.")
        toast.error("Failed to initiate verification")
        return false
      }

      // Add step 3 to completed steps and allow access to step 4
      setCompletedSteps((prev) => {
        if (!prev.includes(3)) return [...prev, 3, 4]
        return prev
      })

      toast.success("Please check your email for the verification code.")
      return true
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
      return false
    } finally {
      setIsLoadingState(false)
    }
  }

  // Verify OTP
  const verifyOTP = async () => {
    try {
      setIsLoadingState(true)
      setError("")

      if (!otp || otp.length !== 6 || !otpSignature) {
        setError("Invalid verification code or missing signature.")
        toast.error("Invalid verification code")
        return false
      }

      const response = await fetchWithAuth("/verify-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: Number.parseInt(otp, 10),
          email,
          otp_signature: otpSignature,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Invalid verification code. Please try again.")
        toast.error("Invalid verification code")
        return false
      }

      const data = await response.json()

      if (data && data.detail === "Account verified successfully") {
        toast.success("Your account has been created successfully.")

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
        }, 1500)

        return true
      } else {
        setError("Verification failed. Please try again.")
        toast.error("Verification failed")
        return false
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
      return false
    } finally {
      setIsLoadingState(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    try {
      setIsLoadingState(true)
      setError("")
      setResendDisabled(true)

      const response = await fetchWithAuth("/resend-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to resend verification code.")
        toast.error("Failed to resend verification code")
        return
      }

      const data = await response.json()
      if (data && data.otp_signature) {
        setOtpSignature(data.otp_signature)
        toast.success("Please check your email for the new verification code.")
      } else {
        setError("Invalid response from server.")
        toast.error("Invalid response from server")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoadingState(false)
    }
  }

  // Handle step change
  const handleStepChange = async (step) => {
    // Check if the step is accessible
    if (!completedSteps.includes(step)) {
      return false
    }

    // Going back is always allowed to completed steps
    if (step < currentstepState) {
      setcurrentstepState(step)
      return true
    }

    // Check if current step is valid before proceeding
    switch (currentstepState) {
      case 1:
        if (!stepValidation.step1) return false
        setcurrentstepState(step)
        return true

      case 2:
        if (!stepValidation.step2) return false
        const emailAvailable = await checkEmailAvailability()
        if (!emailAvailable) return false
        setcurrentstepState(step)
        return true

      case 3:
        if (!stepValidation.step3) return false
        const passwordRegistered = await registerPassword()
        if (!passwordRegistered) return false
        setcurrentstepState(step)
        return true

      case 4:
        if (!stepValidation.step4) return false
        const otpVerified = await verifyOTP()
        if (!otpVerified) return false
        return true

      default:
        return false
    }
  }

  // Handle OTP submission
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    await verifyOTP()
  }

  // Custom step indicator renderer to lock future steps
  const renderStepIndicator = ({ step, currentstep, onStepClick }) => {
    const isAccessible = completedSteps.includes(step)
    const isActive = currentstepState === step
    const isCompleted = completedSteps.includes(step) && currentstepState > step

    return (
      <div
        onClick={() => isAccessible && onStepClick(step)}
        className={`relative cursor-pointer flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
          isActive
            ? "bg-green-500 text-white"
            : isCompleted
              ? "bg-green-500 text-white"
              : isAccessible
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isCompleted ? <CheckCircle className="h-5 w-5" /> : <span className="text-sm">{step}</span>}
      </div>
    )
  }

  return (
        <Stepper
          initialStep={1}
          currentstep={currentstepState}
          onStepChange={handleStepChange}
          onFinalStepCompleted={() => {}}
          backButtonText="Previous"
          nextButtonText={currentstepState === 4 ? "Submit" : "Next"}
          renderStepIndicator={renderStepIndicator}
          nextButtonProps={{
            disabled:
              (currentstepState === 1 && !stepValidation.step1) ||
              (currentstepState === 2 && !stepValidation.step2) ||
              (currentstepState === 3 && !stepValidation.step3) ||
              (currentstepState === 4 && !stepValidation.step4) ||
              isLoadingState,
          }}
        >
          {/* Step 1: Personal Information */}
          <Step>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">Personal Information</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="border-2 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="border-2 focus:border-green-500"
                  />
                </div>
              </div>

              {!stepValidation.step1 && firstName.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">Both first and last names must be at least 2 characters.</p>
              )}
            </div>
          </Step>

          {/* Step 2: Email */}
          <Step>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">Email Address</h2>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 focus:border-green-500"
                />
              </div>

              {!stepValidation.step2 && email.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">Please enter a valid email address.</p>
              )}

              {error && currentstepState === 2 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  We'll send a verification code to this email address in the next steps.
                </p>
              </div>
            </div>
          </Step>

          {/* Step 3: Password */}
          <Step>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">Create Password</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 focus:border-green-500"
                  />
                  {password.length > 0 && password.length < 8 && (
                    <p className="text-sm text-amber-600 mt-1">Password must be at least 8 characters.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-2 focus:border-green-500"
                  />
                  {confirmPassword.length > 0 && password !== confirmPassword && (
                    <p className="text-sm text-amber-600 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>

              {error && currentstepState === 3 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  Create a strong password with at least 8 characters, including uppercase letters, lowercase letters,
                  numbers, and special characters.
                </p>
              </div>
            </div>
          </Step>

          {/* Step 4: OTP Verification */}
          <Step>
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">Verify Your Email</h2>

              <div className="text-center mb-4">
                <p className="text-sm text-slate-600">We've sent a 6-digit verification code to</p>
                <p className="font-medium text-green-600">{email}</p>
              </div>

              <form onSubmit={handleOtpSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                      render={({ slots }) => (
                        <InputOTPGroup>
                          {slots.map((slot, index) => (
                            <InputOTPSlot key={index} {...slot} />
                          ))}
                        </InputOTPGroup>
                      )}
                    />
                  </div>
                </div>

                {error && currentstepState === 4 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resendOTP}
                    disabled={resendDisabled || isLoadingState}
                    className="flex items-center gap-2"
                  >
                    {resendDisabled ? (
                      <>
                        <span>Resend in {resendCountdown}s</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Resend Code</span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex justify-center mt-4">
                  <Button
                    type="submit"
                    disabled={!stepValidation.step4 || isLoadingState}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    {isLoadingState ? (
                      <>
                        <span className="mr-2">Verifying</span>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                </div>
              </form>

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800">
                  Enter the verification code sent to your email to complete your registration.
                </p>
              </div>
            </div>
          </Step>
        </Stepper>
  )
}

export default SignUp

