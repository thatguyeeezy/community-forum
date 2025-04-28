import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { AppSidebar } from "@/components/app-sidebar"
import { authOptions } from "@/lib/auth"
import { checkReviewBoardMembership } from "@/app/actions/review-board"

export default async function ReviewBoardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user is staff, has RNR role, or is a review board member
  const userRole = session.user.role as string
  const isStaff = ["STAFF", "HEAD_ADMIN", "WEBMASTER"].includes(userRole)
  const isRNR = ["RNR_ADMINISTRATION", "RNR_STAFF"].includes(userRole)

  // Only check review board membership if not already staff or RNR
  let isReviewBoardMember = false
  if (!isStaff && !isRNR) {
    try {
      isReviewBoardMember = await checkReviewBoardMembership(Number(session.user.id))
    } catch (error) {
      console.error("Error checking review board membership:", error)
      // If there's an error, default to false
      isReviewBoardMember = false
    }
  }

  // Allow access if user is staff, has RNR role, or is a review board member
  if (!isStaff && !isRNR && !isReviewBoardMember) {
    redirect("/")
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl">{children}</div>
      </div>
    </div>
  )
}
