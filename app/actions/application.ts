"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hasRnRPermission } from "@/lib/roles"

// Helper function to check if user can submit application
async function canSubmitApplication(userId: number, departmentId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  // If user is not found, they can't submit
  if (!user) return false

  // If department is CIV or BSFR, applicants can apply
  if (departmentId === "CIV" || departmentId === "BSFR") {
    return true
  }

  // For other departments, user must be at least a MEMBER
  return user.role !== "APPLICANT"
}

// Helper function to calculate cooldown period
function calculateCooldownPeriod(denialCount: number): Date | null {
  const now = new Date()

  if (denialCount === 1) {
    // 24 hours
    const cooldown = new Date(now)
    cooldown.setHours(cooldown.getHours() + 24)
    return cooldown
  } else if (denialCount === 2) {
    // 7 days
    const cooldown = new Date(now)
    cooldown.setDate(cooldown.getDate() + 7)
    return cooldown
  } else if (denialCount >= 3) {
    // 30 days
    const cooldown = new Date(now)
    cooldown.setDate(cooldown.getDate() + 30)
    return cooldown
  }

  return null
}

// Submit a new application
export async function submitApplication(templateId: number, responses: { questionId: number; response: string }[]) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to submit an application")
  }

  const userId = Number.parseInt(session.user.id)

  // Get the template to check department
  const template = await prisma.applicationTemplate.findUnique({
    where: { id: templateId },
  })

  if (!template) {
    throw new Error("Application template not found")
  }

  // Check if user can apply to this department
  const canApply = await canSubmitApplication(userId, template.departmentId)

  if (!canApply) {
    throw new Error("You are not eligible to apply for this department")
  }

  // Check if user has any pending applications for this department
  const pendingApplication = await prisma.application.findFirst({
    where: {
      userId,
      template: {
        departmentId: template.departmentId,
      },
      status: "PENDING",
    },
  })

  if (pendingApplication) {
    throw new Error("You already have a pending application for this department")
  }

  // Check if user is in cooldown period
  const latestDeniedApplication = await prisma.application.findFirst({
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
    orderBy: {
      createdAt: "desc",
    },
  })

  if (latestDeniedApplication) {
    throw new Error(`You cannot apply again until ${latestDeniedApplication.cooldownUntil?.toLocaleDateString()}`)
  }

  // Create the application
  const application = await prisma.application.create({
    data: {
      userId,
      templateId,
      status: "PENDING",
      responses: {
        create: responses.map((response) => ({
          questionId: response.questionId,
          response: response.response,
          flaggedAsAI: false, // TODO: Implement AI detection
        })),
      },
    },
  })

  revalidatePath("/applications")
  return application
}

// Review an application (accept or deny)
export async function reviewApplication(applicationId: number, action: "accept" | "deny", note?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to review applications")
  }

  const userId = Number.parseInt(session.user.id)

  // Check if user has RNR permissions
  if (!hasRnRPermission(session.user.role as string)) {
    throw new Error("You do not have permission to review applications")
  }

  // Get the application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error("Application not found")
  }

  // Update the application status
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: action === "accept" ? "ACCEPTED" : "DENIED",
      reviewerId: userId,
      interviewStatus: action === "accept" ? "AWAITING_INTERVIEW" : null,
      denialCount: action === "deny" ? { increment: 1 } : undefined,
      lastDeniedAt: action === "deny" ? new Date() : undefined,
      cooldownUntil: action === "deny" ? calculateCooldownPeriod(application.denialCount + 1) : undefined,
      notes: note
        ? {
            create: {
              authorId: userId,
              content: note,
            },
          }
        : undefined,
    },
  })

  // TODO: Update Discord roles if accepted

  revalidatePath(`/rnr/applications/${applicationId}`)
  revalidatePath("/rnr/applications")
  return updatedApplication
}

// Record interview result
export async function recordInterview(applicationId: number, result: "completed" | "failed", note?: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to record interview results")
  }

  const userId = Number.parseInt(session.user.id)

  // Check if user has RNR permissions
  if (!hasRnRPermission(session.user.role as string)) {
    throw new Error("You do not have permission to record interview results")
  }

  // Get the application
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  })

  if (!application) {
    throw new Error("Application not found")
  }

  if (application.status !== "ACCEPTED" || application.interviewStatus !== "AWAITING_INTERVIEW") {
    throw new Error("This application is not awaiting an interview")
  }

  // Update the application status
  const updatedApplication = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: result === "completed" ? "COMPLETED" : "ACCEPTED",
      interviewStatus: result === "completed" ? "INTERVIEW_COMPLETED" : "INTERVIEW_FAILED",
      interviewCompletedAt: result === "completed" ? new Date() : undefined,
      interviewFailedAt: result === "failed" ? new Date() : undefined,
      cooldownUntil:
        result === "failed"
          ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          : undefined,
      notes: note
        ? {
            create: {
              authorId: userId,
              content: note,
            },
          }
        : undefined,
    },
  })

  // TODO: Update Discord roles if completed

  revalidatePath(`/rnr/applications/${applicationId}`)
  revalidatePath("/rnr/applications")
  return updatedApplication
}

// Get available application templates for a user
export async function getAvailableTemplates() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to view application templates")
  }

  const userId = Number.parseInt(session.user.id)

  // Get user role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // If user is an applicant, they can only apply to CIV and BSFR
  const departmentFilter = user.role === "APPLICANT" ? { departmentId: { in: ["CIV", "BSFR"] } } : {}

  // Get active templates
  const templates = await prisma.applicationTemplate.findMany({
    where: {
      active: true,
      ...departmentFilter,
    },
    orderBy: {
      name: "asc",
    },
  })

  return templates
}
