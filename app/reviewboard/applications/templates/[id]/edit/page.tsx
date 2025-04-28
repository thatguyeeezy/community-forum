import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { TemplateForm } from "@/components/template-form"
import { authOptions } from "@/lib/auth"
import { canOverrideRnRDecisions } from "@/lib/roles"
import { getTemplateById } from "@/app/actions/template"

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has RNR permissions
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/reviewboard")
  }

  const templateId = Number.parseInt(params.id)

  if (isNaN(templateId)) {
    notFound()
  }

  // Get the template with questions and review board
  const template = await getTemplateById(templateId)

  if (!template) {
    notFound()
  }

  // Map the data to match the expected format for the form
  const formattedTemplate = {
    id: template.id,
    name: template.name,
    departmentId: template.departmentId,
    description: template.description,
    active: template.active,
    requiresInterview: template.requiresInterview,
    questions: template.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      required: q.required,
      order: q.order,
      options: q.options,
      isDiscordIdField: q.isDiscordIdField,
    })),
    reviewBoard: template.reviewBoard
      ? {
          id: template.reviewBoard.id,
          members: template.reviewBoard.members,
          discordRoleIds: template.reviewBoard.discordRoleIds,
        }
      : undefined,
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Application Template</h1>
      <TemplateForm template={formattedTemplate} />
    </div>
  )
}
