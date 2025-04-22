import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { ApplicationForm } from "@/components/application-form"

export default async function ApplicationFormPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const templateId = Number.parseInt(params.id)

  if (isNaN(templateId)) {
    notFound()
  }

  // Get the template with questions
  const template = await prisma.applicationTemplate.findUnique({
    where: { id: templateId },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!template) {
    notFound()
  }

  // Check if template is active
  if (!template.active) {
    return (
      <div className="container py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Application Unavailable</CardTitle>
            <CardDescription>This application is no longer available.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The application form you're trying to access is currently inactive.</p>
            <Link href="/applications">
              <Button>Back to Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user already has a pending application for this department
  const existingApplication = await prisma.application.findFirst({
    where: {
      userId: Number.parseInt(session.user.id),
      template: {
        departmentId: template.departmentId,
      },
      status: {
        in: ["PENDING", "ACCEPTED"],
      },
    },
  })

  if (existingApplication) {
    return (
      <div className="container py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Application Already Submitted</CardTitle>
            <CardDescription>You already have an active application for this department.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You have already submitted an application for {template.name}. Please wait for a response before applying
              again.
            </p>
            <Link href="/applications">
              <Button>Back to Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user is in cooldown period
  const cooldownApplication = await prisma.application.findFirst({
    where: {
      userId: Number.parseInt(session.user.id),
      template: {
        departmentId: template.departmentId,
      },
      status: "DENIED",
      cooldownUntil: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (cooldownApplication) {
    return (
      <div className="container py-10 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Application Cooldown Period</CardTitle>
            <CardDescription>You cannot apply again at this time.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Your previous application was denied. You can apply again after{" "}
              {cooldownApplication.cooldownUntil?.toLocaleDateString()}.
            </p>
            <Link href="/applications">
              <Button>Back to Applications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{template.name} Application</h1>
          <p className="text-muted-foreground">
            {template.description || `Apply to join the ${template.departmentId} department.`}
          </p>
        </div>

        <ApplicationForm template={template} />
      </div>
    </div>
  )
}
