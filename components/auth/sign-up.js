"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Mail, Lock, User, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"
import MultiStepForm from "../ui/Stepper/Stepper"
import OtpInput from "../ui/otp"
import { fetchWithAuth } from "@/app/api"
import { useAuth } from "@/app/providers"

export default function SignUpForm() {
  const router = useRouter();

  const {setIsAuthenticated, setProfile} = useAuth();

  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSignature, setOtpSignature] = useState("")
  const [currentStep, setCurrentStep] = useState(1)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendDisabled, setResendDisabled] = useState(true)
  const [resendCountdown, setResendCountdown] = useState(80)
  const [resendLoading, setResendLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
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

  // Register password and get OTP signature
  const registerPassword = async () => {
    try {
      setIsLoading(true)
      setError("")

      // First API call: register password
      const response = await fetchWithAuth("/auth/register/password/", {
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
        toast("Registration failed")
        return false
      }

      const data = await response.json()
      if (!data || !data.otp_signature) {
        setError("Invalid server response. Missing OTP signature.")
        toast("Invalid response")
        return false
      }

      setOtpSignature(data.otp_signature)

      // Second API call: verify account (GET request)
      const verifyResponse = await fetchWithAuth(
        `/auth/verify-account/?email=${encodeURIComponent(email)}&otp_signature=${encodeURIComponent(data.otp_signature)}`,
      )

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json()
        setError(errorData.detail || "Failed to initiate verification. Please try again.")
        toast("Verification failed")
        return false
      }

      toast("Verification code sent")
      return true
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast("An error occurred. Please try again.")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Verify OTP
  const verifyOTP = async () => {
    try {
      setVerifyLoading(true)
      setError("")

      if (!otp || otp.length !== 6 || !otpSignature) {
        setError("Invalid verification code or missing signature.")
        toast("Invalid verification code")
        return false
      }

      const response = await fetchWithAuth("/auth/verify-account/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp,
          email,
          otp_signature: otpSignature,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Invalid verification code. Please try again.")
        toast("Verification failed")
        return false
      }

      toast("Your account has been created successfully.");
      setIsAuthenticated(true)
      router.push("/")

      return true
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast("Error")
      return false
    } finally {
      setVerifyLoading(false)
    }
  }

  // Resend OTP
  const resendOTP = async () => {
    try {
      setResendLoading(true)
      setError("")
      setResendDisabled(true)

      // Use the same GET endpoint for resending OTP
      const response = await fetchWithAuth(
        `/auth/verify-account/?email=${encodeURIComponent(email)}&otp_signature=${encodeURIComponent(otpSignature)}`,
      )

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Failed to resend verification code.")
        toast("Failed to resend")
        return
      }

      toast("Please check your email for the new verification code.")
      // Reset the countdown
      setResendCountdown(30)
    } catch (error) {
      setError("An error occurred. Please try again.")
      toast("Error")
    } finally {
      setResendLoading(false)
    }
  }

  // Handle step change
  const handleStepChange = async (nextStep) => {
    // Going back is always allowed
    if (nextStep < currentStep) {
      setCurrentStep(nextStep)
      return true
    }

    // Check if current step is valid before proceeding
    switch (currentStep) {
      case 1:
        if (!stepValidation.step1) return false
        setCurrentStep(nextStep)
        return true

      case 2:
        if (!stepValidation.step2) return false
        setCurrentStep(nextStep)
        return true

      case 3:
        if (!stepValidation.step3) return false
        const passwordRegistered = await registerPassword()
        if (!passwordRegistered) return false
        setCurrentStep(nextStep)
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

  const steps = [
    // Step 1: Personal Information
    {
      title: "Personal Information",
      icon: <User className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4 py-2">
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

          {!stepValidation.step1 && firstName.length > 0 && (
            <p className="text-sm text-amber-600 mt-2">Both first and last names must be at least 2 characters.</p>
          )}
        </div>
      ),
      isValid: stepValidation.step1,
    },
    // Step 2: Email
    {
      title: "Email Address",
      icon: <Mail className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4 py-2">
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

          {error && currentStep === 2 && (
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
      ),
      isValid: stepValidation.step2,
    },
    // Step 3: Password
    {
      title: "Create Password",
      icon: <Lock className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4 py-2">
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

          {error && currentStep === 3 && (
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
      ),
      isValid: stepValidation.step3,
    },
    // Step 4: OTP Verification
    {
      title: "Verify Your Email",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4 py-2">
          <div className="text-center mb-4">
            <p className="text-sm text-slate-600">We've sent a 6-digit verification code to</p>
            <p className="font-medium text-green-600">{email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp" className="block text-center mb-2">
              Verification Code
            </Label>
            <div className="flex justify-center">
              <OtpInput value={otp} onChange={setOtp} disabled={verifyLoading} />
            </div>
          </div>

          {error && currentStep === 4 && (
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
              disabled={resendDisabled || resendLoading}
              className="flex items-center gap-2"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : resendDisabled ? (
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
              type="button"
              onClick={() => verifyOTP()}
              disabled={!stepValidation.step4 || verifyLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              {verifyLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </div>

          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <p className="text-sm text-green-800">
              Enter the verification code sent to your email to complete your registration.
            </p>
          </div>
        </div>
      ),
      isValid: stepValidation.step4,
    },
  ]

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-green-600">Create Your Account</h1>
        <p className="text-center text-gray-600 mt-2">Complete the steps below to get started</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium text-green-600">{steps[currentStep - 1].title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <MultiStepForm steps={steps} currentStep={currentStep} onStepChange={handleStepChange} isLoading={isLoading} />
    </div>
  )
}

