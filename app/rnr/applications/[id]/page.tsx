import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { format } from "date-fns"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRnRPermission } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { ApplicationReviewActions } from "@/components/application-review-actions"
import { ArrowLeft, Clock, User, Calendar, FileText } from "lucide-react"

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      redirect("/auth/signin")
    }

    // Check if user has R&R permissions
    if (!hasRnRPermission(session.user.role as string)) {
      redirect("/rnr")
    }

    const applicationId = Number.parseInt(params.id)

    if (isNaN(applicationId)) {
      notFound()
    }

    // Get application with all related data
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        template: true,
        reviewer: true,
        responses: {
          include: {
            question: true,
          },
        },
        notes: {
          include: {
            author: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!application) {
      notFound()
    }

    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/rnr/applications">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Application Review</h1>
          </div>
          <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-l-4 border-blue-500 bg-gray-800 shadow">
              <CardHeader>
                <CardTitle className="text-gray-100">Application Responses</CardTitle>
                <CardDescription className="text-gray-400">
                  Submitted on {format(new Date(application.createdAt), "PPP 'at' p")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {application.responses.map((response) => (
                  <div key={response.id} className="space-y-2">
                    <h3 className="font-medium text-gray-200">{response.question.questionText}</h3>
                    <div className="rounded-md bg-gray-700 p-3">
                      {response.question.questionType === "checkbox" ? (
                        <ul className="list-disc list-inside text-gray-300">
                          {response.response.split(",").map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="whitespace-pre-wrap text-gray-300">{response.response}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {application.notes.length > 0 && (
              <Card className="border-l-4 border-amber-500 bg-gray-800 shadow">
                <CardHeader>
                  <CardTitle className="text-gray-100">Review Notes</CardTitle>
                  <CardDescription className="text-gray-400">Notes from the review process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.notes.map((note) => (
                    <div key={note.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-200">{note.author.name}</span>
                        </div>
                        <div className="text-sm text-gray-400">{format(new Date(note.createdAt), "PPP 'at' p")}</div>
                      </div>
                      <p className="rounded-md bg-gray-700 p-3 whitespace-pre-wrap text-gray-300">{note.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-l-4 border-blue-500 bg-gray-800 shadow">
              <CardHeader>
                <CardTitle className="text-gray-100">Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-200">{application.user.name}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Department</span>
                    </div>
                    <span className="font-medium text-gray-200">{application.template.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">Submitted</span>
                    </div>
                    <span className="text-gray-200">{format(new Date(application.createdAt), "PPP")}</span>
                  </div>
                  {application.cooldownUntil && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300">Cooldown Until</span>
                      </div>
                      <span className="text-gray-200">{format(new Date(application.cooldownUntil), "PPP")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <ApplicationReviewActions
              applicationId={application.id}
              status={application.status}
              interviewStatus={application.interviewStatus}
            />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading application detail:", error)
    return (
      <div className="p-8">
        <Card className="border-l-4 border-red-500 bg-gray-800 shadow">
          <CardHeader>
            <CardTitle className="text-gray-100">Error</CardTitle>
            <CardDescription className="text-gray-400">
              There was a problem loading the application details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              An error occurred while trying to load the application. Please try again later or contact support.
            </p>
            <Button variant="outline" asChild>
              <Link href="/rnr/applications">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
}
