// app/profile/page.tsx
"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProfileRedirect() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/profile/${session.user.id}`)
    } else if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, session, router])

  return <div className="flex justify-center p-8">Redirecting...</div>
}