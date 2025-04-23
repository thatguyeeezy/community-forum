import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ApplicationForm } from "@/components/application-form"

export default async function ApplicationPage({ params }: { params: { id: string } }) {
  try {
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
      console.error(`Template with ID ${templateId} not found`)
      notFound()
    }

    // Check if user already has a pending application for this template
    const userId = Number.parseInt(session.user.id)
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId,
        templateId,
        status: "PENDING",
      },
    })

    if (existingApplication) {
      redirect("/applications")
    }

    // Check if user is in cooldown for this department
    const inCooldown = await prisma.application.findFirst({
      where: {
        userId,
        template: {
          departmentId: template.departmentId,
        },
        status: "DENIED",
        cooldownUntil: {
          gt: new Date(),
        },
      },
    })

    if (inCooldown) {
      redirect("/applications")
    }

    return (
      <div className="container max-w-4xl py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground mt-2">{template.description}</p>
        </div>

        <ApplicationForm template={template} />
      </div>
    )
  } catch (error) {
    console.error("Error in ApplicationPage:", error)
    return (
      <div className="container max-w-4xl py-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Application</h1>
        <p className="mt-2">There was a problem loading this application. Please try again later.</p>
      </div>
    )
  }
}
