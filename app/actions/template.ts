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
}

interface TemplateData {
  name: string
  departmentId: string
  description: string | null
  active: boolean
  questions: QuestionData[]
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
      questions: {
        create: data.questions.map((question) => ({
          questionText: question.questionText,
          questionType: question.questionType,
          required: question.required,
          order: question.order,
          options: question.options,
        })),
      },
    },
  })

  revalidatePath("/rnr/applications/templates")
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

  revalidatePath("/rnr/applications/templates")
  revalidatePath(`/rnr/applications/templates/${data.id}`)
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

  revalidatePath("/rnr/applications/templates")
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

  revalidatePath("/rnr/applications/templates")
  return true
}

// Replace empty object with async function
export async function _templateActionsDummy() {
  return null
}

export default {}
