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

  // Get the user's role
  const userRole = session.user.role as string

  // Define roles that have direct access
  const directAccessRoles = [
    "WEBMASTER",
    "HEAD_ADMIN",
    "SENIOR_ADMIN",
    "SPECIAL_ADVISOR",
    "STAFF",
    "RNR_ADMINISTRATION",
    "RNR_STAFF",
    "RNR_MEMBER",
  ]

  // Check if user has direct access based on role
  const hasDirectAccess = directAccessRoles.includes(userRole)

  // If user doesn't have direct access, check if they're a review board member
  if (!hasDirectAccess) {
    console.log(
      `User ${session.user.id} with role ${userRole} doesn't have direct access, checking review board membership`,
    )

    try {
      const isReviewBoardMember = await checkReviewBoardMembership(Number(session.user.id))

      if (!isReviewBoardMember) {
        console.log(`User ${session.user.id} is not a review board member, access denied`)
        redirect("/auth/error?error=AccessDenied")
      }

      console.log(`User ${session.user.id} is a review board member, granting access`)
    } catch (error) {
      console.error("Error checking review board membership:", error)
      redirect("/auth/error?error=AccessDenied")
    }
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
