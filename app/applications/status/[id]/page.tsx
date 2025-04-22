import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ApplicationStatusBadge } from "@/components/application-status-badge"

export default async function ApplicationStatusPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const applicationId = Number.parseInt(params.id)
  const userId = Number.parseInt(session.user.id)

  if (isNaN(applicationId)) {
    notFound()
  }

  // Get application with responses
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
      userId, // Ensure the application belongs to the current user
    },
    include: {
      template: true,
      responses: {
        include: {
          question: true,
        },
        orderBy: {
          question: {
            order: "asc",
          },
        },
      },
    },
  })

  if (!application) {
    notFound()
  }

  // Format status message based on application status
  let statusMessage = ""
  let statusDescription = ""

  if (application.status === "PENDING") {
    statusMessage = "Your application is pending review."
    statusDescription = "A staff member will review your application soon."
  } else if (application.status === "ACCEPTED") {
    if (application.interviewStatus === "AWAITING_INTERVIEW") {
      statusMessage = "Your application has been accepted!"
      statusDescription = "Please join the Discord server for your interview."
    } else if (application.interviewStatus === "INTERVIEW_FAILED") {
      statusMessage = "Your interview was not successful."
      const cooldownDate = application.cooldownUntil ? new Date(application.cooldownUntil) : null
      statusDescription = cooldownDate
        ? `You can try again after ${cooldownDate.toLocaleDateString()}.`
        : "You can try again soon."
    }
  } else if (application.status === "COMPLETED") {
    statusMessage = "Congratulations! Your application process is complete."
    statusDescription = "Welcome to the department!"
  } else if (application.status === "DENIED") {
    statusMessage = "Your application was not accepted at this time."
    const cooldownDate = application.cooldownUntil ? new Date(application.cooldownUntil) : null
    statusDescription = cooldownDate
      ? `You can apply again after ${cooldownDate.toLocaleDateString()}.`
      : "You can apply again soon."
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Status</h1>
          <p className="text-muted-foreground">{application.template.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>Submitted on {new Date(application.createdAt).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
              </div>
              <p className="font-medium">{statusMessage}</p>
              <p className="text-muted-foreground">{statusDescription}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {application.responses.map((response) => (
                <div key={response.id} className="space-y-2">
                  <h3 className="font-medium">{response.question.questionText}</h3>
                  <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                    {response.response || <span className="text-muted-foreground italic">No response provided</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Link href="/applications">
            <Button variant="outline">Back to Applications</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
