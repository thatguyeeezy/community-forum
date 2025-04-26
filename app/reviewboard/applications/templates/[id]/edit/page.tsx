import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TemplateForm } from "@/components/template-form"
import { canOverrideRnRDecisions } from "@/lib/roles"

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
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Edit Template</h1>
      <TemplateForm template={template} />
    </div>
  )
}
