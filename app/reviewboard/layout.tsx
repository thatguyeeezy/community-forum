import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
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
  const isStaff = ["STAFF", "HEAD_ADMIN", "WEBMASTER"].includes(session.user.role as string)
  const isRNR = ["RNR_ADMINISTRATION", "RNR_STAFF"].includes(session.user.role as string)

  let isReviewBoardMember = false
  if (!isStaff && !isRNR) {
    try {
      isReviewBoardMember = await checkReviewBoardMembership(Number(session.user.id))
    } catch (error) {
      console.error("Error checking review board membership:", error)
    }
  }

  if (!isStaff && !isRNR && !isReviewBoardMember) {
    redirect("/")
  }

  return <div className="container mx-auto py-6">{children}</div>
}
