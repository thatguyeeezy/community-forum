import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Applications</h1>
          <p className="text-gray-400">Review and manage department applications</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow border-l-4 border-blue-500 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Application Filters</h2>
          <p className="text-sm text-gray-400 mb-4">Filter applications by status or department</p>

          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!searchParams.status ? "default" : "outline"}
                  size="sm"
                  className={!searchParams.status ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}
                  asChild
                >
                  <Link
                    href={`/rnr/applications${searchParams.department ? `?department=${searchParams.department}` : ""}`}
                  >
                    All
                  </Link>
                </Button>
                <Button
                  variant={searchParams.status === "PENDING" ? "default" : "outline"}
                  size="sm"
                  className={
                    searchParams.status === "PENDING"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }
                  asChild
                >
                  <Link
                    href={`/rnr/applications?status=PENDING${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                  >
                    Pending
                  </Link>
                </Button>
                <Button
                  variant={searchParams.status === "ACCEPTED" ? "default" : "outline"}
                  size="sm"
                  className={
                    searchParams.status === "ACCEPTED"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }
                  asChild
                >
                  <Link
                    href={`/rnr/applications?status=ACCEPTED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                  >
                    Awaiting Interview
                  </Link>
                </Button>
                <Button
                  variant={searchParams.status === "COMPLETED" ? "default" : "outline"}
                  size="sm"
                  className={
                    searchParams.status === "COMPLETED"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }
                  asChild
                >
                  <Link
                    href={`/rnr/applications?status=COMPLETED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                  >
                    Completed
                  </Link>
                </Button>
                <Button
                  variant={searchParams.status === "DENIED" ? "default" : "outline"}
                  size="sm"
                  className={
                    searchParams.status === "DENIED" ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                  }
                  asChild
                >
                  <Link
                    href={`/rnr/applications?status=DENIED${searchParams.department ? `&department=${searchParams.department}` : ""}`}
                  >
                    Denied
                  </Link>
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-300 mb-2">Department</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!searchParams.department ? "default" : "outline"}
                  size="sm"
                  className={
                    !searchParams.department ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                  }
                  asChild
                >
                  <Link href={`/rnr/applications${searchParams.status ? `?status=${searchParams.status}` : ""}`}>
                    All
                  </Link>
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept.departmentId}
                    variant={searchParams.department === dept.departmentId ? "default" : "outline"}
                    size="sm"
                    className={
                      searchParams.department === dept.departmentId
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-700 hover:bg-gray-600"
                    }
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
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Applications</h2>
          <p className="text-sm text-gray-400 mb-4">
            {totalCount} application{totalCount !== 1 ? "s" : ""} found
          </p>

          {applications.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-md border border-gray-700">
                <div className="grid grid-cols-6 p-4 font-medium bg-gray-700/50 text-gray-200">
                  <div>Applicant</div>
                  <div>Department</div>
                  <div>Submitted</div>
                  <div>Status</div>
                  <div>Reviewer</div>
                  <div>Action</div>
                </div>
                <div className="divide-y divide-gray-700">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="grid grid-cols-6 p-4 items-center bg-gray-700/20 text-gray-300"
                    >
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
                        <Link
                          href={`/rnr/applications/${application.id}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className={page === pageNum ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"}
                      asChild
                    >
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
            <div className="py-12 text-center text-gray-400">
              <p>No applications found</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in ApplicationsPage:", error)
    return (
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">Applications</h1>
          <p className="text-gray-400">Review and manage department applications</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow border-l-4 border-red-500">
          <h2 className="text-xl font-semibold mb-2 text-gray-100">Error</h2>
          <p className="text-gray-400 mb-4">An error occurred while loading applications</p>
          <p className="text-gray-300">There was a problem loading the applications. Please try again later.</p>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/rnr">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }
}
