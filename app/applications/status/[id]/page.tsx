import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { format } from "date-fns"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { ArrowLeft, Clock } from "lucide-react"

export default async function ApplicationStatusPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const applicationId = Number.parseInt(params.id)

  if (isNaN(applicationId)) {
    notFound()
  }

  const userId = Number.parseInt(session.user.id)

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
      },
    },
  })

  if (!application) {
    notFound()
  }

  // Get status message based on application status
  let statusMessage = ""
  switch (application.status) {
    case "PENDING":
      statusMessage = "Your application is currently under review. You will be notified when there is an update."
      break
    case "ACCEPTED":
      if (application.interviewStatus === "AWAITING_INTERVIEW") {
        statusMessage = "Your application has been accepted! You will be contacted for an interview soon."
      } else if (application.interviewStatus === "INTERVIEW_FAILED") {
        statusMessage =
          "Unfortunately, you did not pass the interview. You may be able to apply again after the cooldown period."
      }
      break
    case "COMPLETED":
      statusMessage = "Congratulations! Your application process is complete. Welcome to the department!"
      break
    case "DENIED":
      statusMessage = "Unfortunately, your application was not accepted at this time."
      if (application.cooldownUntil && new Date(application.cooldownUntil) > new Date()) {
        statusMessage += ` You may apply again after ${format(new Date(application.cooldownUntil), "PPP")}.`
      } else {
        statusMessage += " You may apply again now if you wish."
      }
      break
    case "CANCELLED":
      statusMessage = "This application has been cancelled."
      break
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/applications">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Application Status</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{application.template.name}</CardTitle>
            <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
          </div>
          <CardDescription>Submitted on {format(new Date(application.createdAt), "PPP")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md bg-muted p-4">
            <p>{statusMessage}</p>
          </div>

          {application.cooldownUntil && new Date(application.cooldownUntil) > new Date() && (
            <div className="flex items-center space-x-2 text-amber-500">
              <Clock className="h-4 w-4" />
              <span>Cooldown period ends on {format(new Date(application.cooldownUntil), "PPP")}</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Your Responses</h3>
            {application.responses.map((response) => (
              <div key={response.id} className="space-y-2">
                <h4 className="font-medium">{response.question.questionText}</h4>
                <div className="rounded-md bg-muted/50 p-3">
                  {response.question.questionType === "checkbox" ? (
                    <ul className="list-disc list-inside">
                      {response.response.split(",").map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="whitespace-pre-wrap">{response.response}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
