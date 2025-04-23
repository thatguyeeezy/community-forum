import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma" // Fixed import
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function RnRDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  try {
    // Get application statistics
    const pendingCount = await prisma.application.count({
      where: { status: "PENDING" },
    })

    const acceptedCount = await prisma.application.count({
      where: { status: "ACCEPTED", interviewStatus: "AWAITING_INTERVIEW" },
    })

    const completedCount = await prisma.application.count({
      where: { status: "COMPLETED" },
    })

    const deniedCount = await prisma.application.count({
      where: { status: "DENIED" },
    })

    // Get recent applications
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        template: true,
      },
    })

    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">R&R Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to the R&R panel. Manage applications and member interviews.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gray-800 border-l-4 border-amber-500 shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Pending Applications</CardTitle>
              <div className="h-4 w-4 rounded-full bg-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{pendingCount}</div>
              <p className="text-xs text-gray-400">Applications awaiting review</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-l-4 border-blue-500 shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Awaiting Interview</CardTitle>
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{acceptedCount}</div>
              <p className="text-xs text-gray-400">Applications accepted, pending interview</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-l-4 border-green-500 shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Completed</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{completedCount}</div>
              <p className="text-xs text-gray-400">Successfully completed applications</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-l-4 border-red-500 shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Denied</CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-100">{deniedCount}</div>
              <p className="text-xs text-gray-400">Applications that were denied</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-l-4 border-blue-500 shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-100">Recent Applications</CardTitle>
            <CardDescription className="text-gray-400">
              The most recent applications submitted to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? (
                <div className="rounded-md border border-gray-700">
                  <div className="grid grid-cols-5 p-4 font-medium text-gray-300 bg-gray-700/50">
                    <div>Applicant</div>
                    <div>Department</div>
                    <div>Submitted</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="grid grid-cols-5 p-4 items-center text-gray-300">
                        <div>{application.user.name}</div>
                        <div>{application.template.name}</div>
                        <div>{new Date(application.createdAt).toLocaleDateString()}</div>
                        <div>
                          <ApplicationStatusBadge
                            status={application.status}
                            interviewStatus={application.interviewStatus}
                          />
                        </div>
                        <div>
                          <Link href={`/rnr/applications/${application.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">No recent applications</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in RnR Dashboard:", error)
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">R&R Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome to the R&R panel. Manage applications and member interviews.</p>
        </div>

        <Card className="bg-gray-800 border-l-4 border-red-500 shadow">
          <CardHeader>
            <CardTitle className="text-gray-100">Error</CardTitle>
            <CardDescription className="text-gray-400">There was an error loading the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Please try again later or contact support if the issue persists.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
