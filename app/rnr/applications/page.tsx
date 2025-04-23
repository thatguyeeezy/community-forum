import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma" // Fixed import statement
import { ApplicationStatusBadge } from "@/components/application-status-badge"

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: { status?: string; department?: string; page?: string }
}) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      redirect("/auth/signin")
    }

    const page = Number(searchParams.page) || 1
    const pageSize = 10
    const skip = (page - 1) * pageSize

    // Build filter based on search params
    const filter: any = {}

    if (searchParams.status) {
      filter.status = searchParams.status
    }

    if (searchParams.department) {
      filter.template = {
        departmentId: searchParams.department,
      }
    }

    // Get applications with pagination
    const applications = await prisma.application.findMany({
      skip,
      take: pageSize,
      where: filter,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        template: true,
        reviewer: true,
      },
    })

    // Get total count for pagination
    const totalCount = await prisma.application.count({
      where: filter,
    })

    const totalPages = Math.ceil(totalCount / pageSize)

    // Get departments for filter
    const departments = await prisma.applicationTemplate.findMany({
      select: {
        departmentId: true,
        name: true,
      },
      distinct: ["departmentId"],
    })

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">Review and manage department applications</p>
          </div>
          {/* Removed "New Template" button */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Filters</CardTitle>
            <CardDescription>Filter applications by status or department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button variant={!searchParams.status ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={`/rnr/applications${searchParams.department ? `?department=${searchParams.department}` : ""}`}
                >
                  All
                </Link>
              </Button>
              <Button variant={searchParams.status === "PENDING" ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={`/rnr/applications?status=PENDING${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                >
                  Pending
                </Link>
              </Button>
              <Button variant={searchParams.status === "ACCEPTED" ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={`/rnr/applications?status=ACCEPTED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                >
                  Awaiting Interview
                </Link>
              </Button>
              <Button variant={searchParams.status === "COMPLETED" ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={`/rnr/applications?status=COMPLETED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                >
                  Completed
                </Link>
              </Button>
              <Button variant={searchParams.status === "DENIED" ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={`/rnr/applications?status=DENIED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                >
                  Denied
                </Link>
              </Button>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Department</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant={!searchParams.department ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/rnr/applications${searchParams.status ? `?status=${searchParams.status}` : ""}`}>
                    All
                  </Link>
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept.departmentId}
                    variant={searchParams.department === dept.departmentId ? "default" : "outline"}
                    size="sm"
                    asChild
                  >
                    <Link
                      href={`/rnr/applications?department=${dept.departmentId}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
                    >
                      {dept.name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {totalCount} application{totalCount !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium">
                    <div>Applicant</div>
                    <div>Department</div>
                    <div>Submitted</div>
                    <div>Status</div>
                    <div>Reviewer</div>
                    <div>Action</div>
                  </div>
                  <div className="divide-y">
                    {applications.map((application) => (
                      <div key={application.id} className="grid grid-cols-6 p-4 items-center">
                        <div>{application.user.name}</div>
                        <div>{application.template.name}</div>
                        <div>{new Date(application.createdAt).toLocaleDateString()}</div>
                        <div>
                          <ApplicationStatusBadge
                            status={application.status}
                            interviewStatus={application.interviewStatus}
                          />
                        </div>
                        <div>{application.reviewer?.name || "Unassigned"}</div>
                        <div>
                          <Link href={`/rnr/applications/${application.id}`} className="text-blue-600 hover:underline">
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button key={pageNum} variant={page === pageNum ? "default" : "outline"} size="sm" asChild>
                        <Link
                          href={`/rnr/applications?page=${pageNum}${
                            searchParams.status ? `&status=${searchParams.status}` : ""
                          }${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                        >
                          {pageNum}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No applications found</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in ApplicationsPage:", error)
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">Review and manage department applications</p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>An error occurred while loading applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p>There was a problem loading the applications. Please try again later.</p>
            <Button className="mt-4" asChild>
              <Link href="/rnr">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
