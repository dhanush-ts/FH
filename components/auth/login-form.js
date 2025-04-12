"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchWithAuth } from "@/app/api"
import { useAuth } from "@/app/providers"
import Link from "next/link"
import Login from "./google-signin"
import OptimizedLottie from "../ui/display-lottie"

export default function LoginForm({ className, ...props }) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  console.log("Redirecting to:", callbackUrl) // 🔍
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl)
    }
  }, [isAuthenticated, router])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchWithAuth(`/auth/login/password/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.detail === "Successful") {
        setIsAuthenticated(true)
        router.push(callbackUrl) // 👈 redirect to where user originally tried to go
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("Wrong credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 flex items-center justify-center px-5 py-5">
      <div
        className="bg-white text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
        style={{ maxWidth: "1000px" }}
      >
        <div className="md:flex w-full">
          <div className="hidden md:block w-1/2 bg-green-100 py-10 px-10">
            <OptimizedLottie
              animationData={require("@/app/assests/floatingPerson.json")}
              loop={true}
              className="w-full h-full object-contain"
              aria-hidden="true"
            />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-gray-900">Login</h1>
              <p className="text-gray-600 mt-2">Enter your information to login</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <label htmlFor="email" className="text-xs font-semibold px-1">
                    Email
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-email-outline text-gray-400 text-lg"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
                      placeholder="johnsmith@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex -mx-3">
                <div className="w-full px-3 mb-8">
                  <label htmlFor="password" className="text-xs font-semibold px-1">
                    Password
                  </label>
                  <div className="flex">
                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                      <i className="mdi mdi-lock-outline text-gray-400 text-lg"></i>
                    </div>
                    <input
                      type="password"
                      id="password"
                      className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500"
                      placeholder="************"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-5 px-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="flex -mx-3">
                <div className="w-full px-3 mb-5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="block w-full max-w-xs mx-auto bg-green-500 hover:bg-green-600 focus:bg-green-600 text-white rounded-lg px-3 py-3 font-semibold transition-colors disabled:opacity-70"
                  >
                    {isLoading ? "SIGNING IN..." : "SIGN IN"}
                  </button>
                </div>
              </div>

              <div className="flex items-center my-6 px-3">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex -mx-3">
                <div className="w-full px-3">
                  {/* <GoogleButton /> */}
                  <Login />
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-green-500 hover:text-green-600 underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

