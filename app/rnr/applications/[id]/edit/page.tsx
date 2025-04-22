import { getServerSession } from "next-auth/next"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { canOverrideRnRDecisions } from "@/lib/roles"
import { TemplateForm } from "@/components/template-form"

export default async function EditTemplatePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/rnr/applications")
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Application Template</h1>
        <p className="text-muted-foreground">Edit the {template.name} application template</p>
      </div>

      <TemplateForm template={template} />
    </div>
  )
}
