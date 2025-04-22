import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ApplicationStatusBadge } from "@/components/application-status-badge"

export default async function RnRDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">R&R Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the R&R panel. Manage applications and member interviews.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <div className="h-4 w-4 rounded-full bg-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Applications awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Awaiting Interview</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptedCount}</div>
            <p className="text-xs text-muted-foreground">Applications accepted, pending interview</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully completed applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
            <div className="h-4 w-4 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deniedCount}</div>
            <p className="text-xs text-muted-foreground">Applications that were denied</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>The most recent applications submitted to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApplications.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 font-medium">
                  <div>Applicant</div>
                  <div>Department</div>
                  <div>Submitted</div>
                  <div>Status</div>
                  <div>Action</div>
                </div>
                <div className="divide-y">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="grid grid-cols-5 p-4 items-center">
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
                        <a href={`/rnr/applications/${application.id}`} className="text-blue-600 hover:underline">
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No recent applications</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
