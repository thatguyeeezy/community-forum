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
      // Instead of redirecting immediately, pass a flag to show a message
      return (
        <div className="container max-w-4xl py-8 space-y-8">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  You already have a pending application for this position.
                  <a href="/applications" className="font-medium underline text-amber-700 hover:text-amber-600 ml-1">
                    View your applications
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground mt-2">{template.description}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Application Status</h2>
            <p>Your application for this position is currently being reviewed.</p>
            <div className="mt-4">
              <a
                href="/applications"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Applications
              </a>
            </div>
          </div>
        </div>
      )
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
      // Calculate time remaining in cooldown
      const now = new Date()
      const cooldownEnd = new Date(inCooldown.cooldownUntil!)
      const timeRemaining = cooldownEnd.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))
      const hoursRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60))

      let timeMessage = ""
      if (daysRemaining > 1) {
        timeMessage = `${daysRemaining} days`
      } else {
        timeMessage = `${hoursRemaining} hours`
      }

      return (
        <div className="container max-w-4xl py-8 space-y-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  You are currently in a cooldown period for this department. Please try again in approximately{" "}
                  {timeMessage}.
                  <a href="/applications" className="font-medium underline text-red-700 hover:text-red-600 ml-1">
                    View your applications
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground mt-2">{template.description}</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Application Cooldown</h2>
            <p>
              Your previous application to this department was denied. You must wait until the cooldown period ends
              before applying again.
            </p>
            <div className="mt-4">
              <a
                href="/applications"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View All Applications
              </a>
            </div>
          </div>
        </div>
      )
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
