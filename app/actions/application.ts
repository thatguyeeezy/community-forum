"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRnRPermission } from "@/lib/roles"

// Helper function to check if user can submit application
async function canSubmitApplication(userId: number, departmentId: string) {
  try {
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
  } catch (error) {
    console.error("Error checking if user can submit application:", error)
    return false
  }
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
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("You must be logged in to submit an application")
    }

    // Validate userId
    if (isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
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
  } catch (error) {
    console.error("Error submitting application:", error)
    throw error
  }
}

// Update the getAvailableTemplates function to support department filtering
export async function getAvailableTemplates(departmentFilter?: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("You must be logged in to view application templates")
    }

    // Validate userId
    if (isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
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
    let roleBasedFilter = {}
    if (user.role === "APPLICANT") {
      roleBasedFilter = { departmentId: { in: ["CIV", "BSFR"] } }
    }

    // Add department filter if provided
    let deptFilter = {}
    if (departmentFilter && departmentFilter !== "all") {
      deptFilter = { departmentId: departmentFilter }
    }

    // Get active templates with combined filters
    const templates = await prisma.applicationTemplate.findMany({
      where: {
        active: true,
        ...roleBasedFilter,
        ...deptFilter,
      },
      orderBy: {
        name: "asc",
      },
    })

    return templates
  } catch (error) {
    console.error("Error getting available templates:", error)
    throw error
  }
}

// Add a new function to get all available departments for filtering
export async function getAvailableDepartments() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("You must be logged in to view departments")
    }

    // Validate userId
    if (isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
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

    // If user is an applicant, they can only see CIV and BSFR
    let whereClause = {}
    if (user.role === "APPLICANT") {
      whereClause = { departmentId: { in: ["CIV", "BSFR"] } }
    }

    // Get distinct departments from active templates
    const templates = await prisma.applicationTemplate.findMany({
      where: {
        active: true,
        ...whereClause,
      },
      select: {
        departmentId: true,
      },
      distinct: ["departmentId"],
    })

    return templates.map((t) => t.departmentId)
  } catch (error) {
    console.error("Error getting available departments:", error)
    throw error
  }
}

// Get application template by ID
export async function getApplicationTemplate(id: number) {
  try {
    const template = await prisma.applicationTemplate.findUnique({
      where: {
        id,
      },
    })

    if (!template) {
      throw new Error("Application template not found")
    }

    return template
  } catch (error) {
    console.error("Error getting application template:", error)
    throw error
  }
}

// Review an application (accept or deny)
export async function reviewApplication(applicationId: number, action: "accept" | "deny", note?: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("You must be logged in to review applications")
    }

    // Validate userId
    if (isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
    }

    const userId = Number.parseInt(session.user.id)

    // Validate user role
    if (!session.user.role) {
      throw new Error("User role not found")
    }

    // Check if user has RNR permissions
    if (!hasRnRPermission(session.user.role)) {
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
  } catch (error) {
    console.error("Error reviewing application:", error)
    throw error
  }
}

// Record interview result
export async function recordInterview(applicationId: number, result: "completed" | "failed", note?: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      throw new Error("You must be logged in to record interview results")
    }

    // Validate userId
    if (isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
    }

    const userId = Number.parseInt(session.user.id)

    // Validate user role
    if (!session.user.role) {
      throw new Error("User role not found")
    }

    // Check if user has RNR permissions
    if (!hasRnRPermission(session.user.role)) {
      throw new Error("You do not have permission to record interview results")
    }

    // Get the application
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      throw new Error("Application not found")
    }

    // Check if this is a valid state for recording an interview
    const validState =
      application.status === "ACCEPTED" &&
      (application.interviewStatus === "AWAITING_INTERVIEW" ||
        (application.interviewStatus === "INTERVIEW_FAILED" &&
          application.cooldownUntil &&
          application.cooldownUntil < new Date()))

    if (!validState) {
      throw new Error("This application is not ready for an interview")
    }

    // Count previous interview failures
    const interviewFailCount = application.interviewFailedAt ? 1 : 0

    // Update the application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        // If completed, mark as COMPLETED
        // If failed for the second time, mark as DENIED
        // Otherwise, keep as ACCEPTED
        status: result === "completed" ? "COMPLETED" : interviewFailCount >= 1 ? "DENIED" : "ACCEPTED",

        // Update interview status
        interviewStatus:
          result === "completed" ? "INTERVIEW_COMPLETED" : interviewFailCount >= 1 ? null : "INTERVIEW_FAILED",

        // Update timestamps
        interviewCompletedAt: result === "completed" ? new Date() : application.interviewCompletedAt,
        interviewFailedAt: result === "failed" ? new Date() : application.interviewFailedAt,

        // Set cooldown - 7 days for first failure, no cooldown for second failure (application is denied)
        cooldownUntil:
          result === "failed" && interviewFailCount === 0
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            : undefined,

        // Add note
        notes: note
          ? {
              create: {
                authorId: userId,
                content:
                  interviewFailCount >= 1 && result === "failed"
                    ? `Interview failed for the second time. Application denied. ${note}`
                    : note,
              },
            }
          : undefined,
      },
    })

    // TODO: Update Discord roles if completed

    revalidatePath(`/rnr/applications/${applicationId}`)
    revalidatePath("/rnr/applications")
    return updatedApplication
  } catch (error) {
    console.error("Error recording interview:", error)
    throw error
  }
}

// Update interview status
export async function updateInterviewStatus(
  applicationId: number,
  interviewStatus: "SCHEDULED" | "COMPLETED" | "FAILED",
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      throw new Error("You must be logged in to update interview status")
    }

    // Validate user role
    if (!session.user.role) {
      throw new Error("User role not found")
    }

    if (!["ADMIN", "RNR"].includes(session.user.role)) {
      throw new Error("You don't have permission to update interview status")
    }

    // Update the application
    const application = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        interviewStatus,
      },
    })

    if (!application) {
      throw new Error("Failed to update application")
    }

    revalidatePath(`/rnr/applications/${applicationId}`)
    revalidatePath("/rnr/applications")
    return application
  } catch (error) {
    console.error("Error updating interview status:", error)
    throw error
  }
}

// Get application by ID
export async function getApplication(id: number) {
  try {
    console.log(`Getting application with ID: ${id}`)

    const session = await getServerSession(authOptions)

    if (!session?.user) {
      throw new Error("You must be logged in to view applications")
    }

    // Validate userId
    if (!session.user.id || isNaN(Number(session.user.id))) {
      throw new Error("Invalid user ID")
    }

    const userId = Number.parseInt(session.user.id)

    // Validate role
    const userRole = session.user.role
    if (!userRole) {
      throw new Error("User role not found")
    }

    console.log(`User ID: ${userId}, Role: ${userRole}`)

    const isStaff = ["ADMIN", "RNR"].includes(userRole)

    // If user is not staff, they can only view their own applications
    if (!isStaff) {
      console.log("User is not staff, checking for own application")

      const application = await prisma.application.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          template: true,
          reviewer: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      })

      if (!application) {
        throw new Error("Application not found or you don't have permission to view it")
      }

      console.log("Found application for non-staff user")
      return application
    }

    // Staff can view any application
    console.log("User is staff, fetching any application")

    const application = await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        template: true,
        reviewer: true,
      },
    })

    if (!application) {
      throw new Error("Application not found")
    }

    console.log("Found application for staff user")
    return application
  } catch (error) {
    console.error("Error retrieving application:", error)
    throw error
  }
}
