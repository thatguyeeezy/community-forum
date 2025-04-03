"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForumsRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/community")
  }, [router])

  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
      <p>Our forums have moved to the new Community section.</p>
      <p>
        If you're not redirected automatically,{" "}
        <a href="/community" className="text-primary hover:underline">
          click here
        </a>
        .
      </p>
    </div>
  )
}

