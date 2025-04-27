import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { AppSidebar } from "@/components/app-sidebar"
import { authOptions } from "@/lib/auth"
import { isReviewBoardMember } from "@/lib/review-board"
import { hasRnRPermission } from "@/lib/roles"

export default async function ReviewBoardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Double-check permissions on the server side
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has RNR role
  const userRole = session.user.role as string
  const hasRnRRole = hasRnRPermission(userRole)

  // Check if user is a review board member
  const userId = Number(session.user.id)
  const isReviewMember = await isReviewBoardMember(userId)

  // Allow access if user has RNR role or is a review board member
  if (!hasRnRRole && !isReviewMember) {
    redirect("/auth/error?error=AccessDenied")
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
