import { CardFooter } from "@/components/ui/card"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationStatusBadge } from "@/components/application-status-badge"
import { getAvailableTemplates } from "@/app/actions/application"
import { FileText, ArrowRight } from "lucide-react"

export default async function ApplicationsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const userId = Number.parseInt(session.user.id)

  // Get user's applications
  const userApplications = await prisma.application.findMany({
    where: {
      userId,
    },
    include: {
      template: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get available templates
  const availableTemplates = await getAvailableTemplates()

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Department Applications</h1>
        <p className="text-muted-foreground mt-2">Apply to join departments or check your application status</p>
      </div>

      {userApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Applications</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {userApplications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle>{application.template.name}</CardTitle>
                  <CardDescription>Submitted on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <ApplicationStatusBadge status={application.status} interviewStatus={application.interviewStatus} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/applications/status/${application.id}`}>
                      View Status
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Applications</h2>
        {availableTemplates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTemplates.map((template) => {
              // Check if user already has a pending application for this template
              const existingApplication = userApplications.find(
                (app) => app.templateId === template.id && app.status === "PENDING",
              )

              // Check if user is in cooldown for this template's department
              const inCooldown = userApplications.some(
                (app) =>
                  app.template.departmentId === template.departmentId &&
                  app.status === "DENIED" &&
                  app.cooldownUntil &&
                  new Date(app.cooldownUntil) > new Date(),
              )

              return (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Department Application</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {existingApplication ? (
                      <Button variant="secondary" className="w-full" disabled>
                        Application Pending
                      </Button>
                    ) : inCooldown ? (
                      <Button variant="secondary" className="w-full" disabled>
                        In Cooldown Period
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href={`/applications/${template.id}`}>
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No applications are currently available for you.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
