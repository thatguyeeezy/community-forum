"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canOverrideRnRDecisions } from "@/lib/roles"

interface QuestionData {
  id?: number
  questionText: string
  questionType: string
  required: boolean
  order: number
  options: string[] | null
  isDiscordIdField?: boolean
}

interface TemplateData {
  name: string
  departmentId: string
  description: string | null
  active: boolean
  requiresInterview: boolean
  questions: QuestionData[]
  reviewBoard: {
    memberIds: number[]
    discordRoleIds: string | null
  }
}

interface UpdateTemplateData extends TemplateData {
  id: number
  deletedQuestionIds: number[]
}

// Create a new application template
export async function createTemplate(data: TemplateData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create templates")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    throw new Error("You do not have permission to create templates")
  }

  // Create the template with questions
  const template = await prisma.applicationTemplate.create({
    data: {
      name: data.name,
      departmentId: data.departmentId,
      description: data.description,
      active: data.active,
      requiresInterview: data.requiresInterview,
      questions: {
        create: data.questions.map((question) => ({
          questionText: question.questionText,
          questionType: question.questionType,
          required: question.required,
          order: question.order,
          options: question.options,
          isDiscordIdField: question.isDiscordIdField,
        })),
      },
      reviewBoard: {
        create: {
          members: {
            connect: data.reviewBoard.memberIds.map((id) => ({ id })),
          },
          discordRoleIds: data.reviewBoard.discordRoleIds,
        },
      },
    },
    include: {
      reviewBoard: {
        include: {
          members: true,
        },
      },
    },
  })

  revalidatePath("/reviewboard/applications/templates")
  return template
}

// Update an existing application template
export async function updateTemplate(data: UpdateTemplateData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update templates")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    throw new Error("You do not have permission to update templates")
  }

  // Update the template
  const template = await prisma.applicationTemplate.update({
    where: { id: data.id },
    data: {
      name: data.name,
      departmentId: data.departmentId,
      description: data.description,
      active: data.active,
      requiresInterview: data.requiresInterview,
    },
  })

  // Handle questions - update existing, create new, delete removed
  for (const question of data.questions) {
    if (question.id) {
      // Update existing question
      await prisma.applicationQuestion.update({
        where: { id: question.id },
        data: {
          questionText: question.questionText,
          questionType: question.questionType,
          required: question.required,
          order: question.order,
          options: question.options,
          isDiscordIdField: question.isDiscordIdField,
        },
      })
    } else {
      // Create new question
      await prisma.applicationQuestion.create({
        data: {
          templateId: data.id,
          questionText: question.questionText,
          questionType: question.questionType,
          required: question.required,
          order: question.order,
          options: question.options,
          isDiscordIdField: question.isDiscordIdField,
        },
      })
    }
  }

  // Delete questions that were removed
  if (data.deletedQuestionIds.length > 0) {
    await prisma.applicationQuestion.deleteMany({
      where: {
        id: {
          in: data.deletedQuestionIds,
        },
      },
    })
  }

  // Update review board
  const reviewBoard = await prisma.applicationReviewBoard.findUnique({
    where: { templateId: data.id },
  })

  if (reviewBoard) {
    await prisma.applicationReviewBoard.update({
      where: { id: reviewBoard.id },
      data: {
        members: {
          set: data.reviewBoard.memberIds.map((id) => ({ id })),
        },
        discordRoleIds: data.reviewBoard.discordRoleIds,
      },
    })
  } else {
    // Create review board if it doesn't exist
    await prisma.applicationReviewBoard.create({
      data: {
        templateId: data.id,
        members: {
          connect: data.reviewBoard.memberIds.map((id) => ({ id })),
        },
        discordRoleIds: data.reviewBoard.discordRoleIds,
      },
    })
  }

  revalidatePath("/reviewboard/applications/templates")
  revalidatePath(`/reviewboard/applications/templates/${data.id}`)
  return template
}

// Get a template by ID with all related data
export async function getTemplateById(id: number) {
  const template = await prisma.applicationTemplate.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: {
          order: "asc",
        },
      },
      reviewBoard: {
        include: {
          members: {
            select: {
              id: true,
              name: true,
              discordId: true,
            },
          },
        },
      },
    },
  })

  return template
}

// Toggle template active status
export async function toggleTemplateStatus(id: number, active: boolean) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to update templates")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    throw new Error("You do not have permission to update templates")
  }

  const template = await prisma.applicationTemplate.update({
    where: { id },
    data: { active },
  })

  revalidatePath("/reviewboard/applications/templates")
  return template
}

// Delete a template
export async function deleteTemplate(id: number) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete templates")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    throw new Error("You do not have permission to delete templates")
  }

  // Check if there are any applications using this template
  const applicationCount = await prisma.application.count({
    where: { templateId: id },
  })

  if (applicationCount > 0) {
    throw new Error("Cannot delete a template that has applications. Deactivate it instead.")
  }

  // Delete the template and its questions
  await prisma.applicationTemplate.delete({
    where: { id },
  })

  revalidatePath("/reviewboard/applications/templates")
  return true
}

// Default export as an async function to satisfy "use server" requirements
export default async function templateActionsDefault() {
  return null
}
