import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { AppSidebar } from "@/components/app-sidebar"
import { authOptions } from "@/lib/auth"
import { checkReviewBoardMembership } from "@/app/actions/review-board"
import { hasRnRPermission } from "@/lib/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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

  // Check if user has direct access based on role
  const hasDirectAccess = hasRnRPermission(userRole)

  // If user doesn't have an R&R role, check if they're a review board member
  let isBoardMember = false
  if (!hasDirectAccess) {
    try {
      isBoardMember = await checkReviewBoardMembership(Number(session.user.id))
      console.log(`User ${session.user.id} is a review board member: ${isBoardMember}`)
    } catch (error) {
      console.error("Error checking review board membership:", error)
    }
  }

  // If user doesn't have R&R role and is not a board member, show access denied
  if (!hasDirectAccess && !isBoardMember) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-8">
          <Card className="border-l-4 border-red-500 bg-gray-800 shadow">
            <CardHeader>
              <CardTitle className="text-gray-100">Access Denied</CardTitle>
              <CardDescription className="text-gray-400">
                You do not have permission to access the Review Board
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">This area is restricted to Review Board members only.</p>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
