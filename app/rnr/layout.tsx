import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { RnRSidebar } from "@/components/rnr-sidebar"
import { authOptions } from "@/lib/auth"

export default async function RnRLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Double-check permissions on the server side
  if (!session || !session.user) {
    redirect("/auth/signin")
  }

  // Check if user has RNR role
  const userRole = session.user.role as string
  const hasRnRPermission =
    ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(userRole) ||
    userRole.startsWith("RNR_")

  if (!hasRnRPermission) {
    redirect("/auth/error?error=AccessDenied")
  }

  return (
    <div className="flex h-screen">
      <RnRSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl">{children}</div>
      </div>
    </div>
  )
}
