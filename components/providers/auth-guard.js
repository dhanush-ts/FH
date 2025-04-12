"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/app/providers"
import { useRouter, usePathname } from "next/navigation"
import Loading from "@/app/loading"

export default function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
    } else {
      setCheckingAuth(false)
    }
  }, [isAuthenticated, pathname, router])

  if (checkingAuth) return <Loading />

  return <>{children}</>
}
