import type React from "react"
import { getServerSession } from "next-auth/next"
import { AppSidebar } from "@/components/app-sidebar"
import { authOptions } from "@/lib/auth"
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

  // If not authenticated, show login message
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 p-8">
          <Card className="border-l-4 border-red-500 bg-gray-800 shadow">
            <CardHeader>
              <CardTitle className="text-gray-100">Authentication Required</CardTitle>
              <CardDescription className="text-gray-400">You need to be logged in to access this area</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">Please sign in to access the Review Board.</p>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Let the page components handle permission checks
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 max-w-7xl">{children}</div>
      </div>
    </div>
  )
}
