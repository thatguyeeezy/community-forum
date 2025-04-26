import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { TemplateForm } from "@/components/template-form"
import { authOptions } from "@/lib/auth"
import { canOverrideRnRDecisions } from "@/lib/roles"

export default async function NewTemplatePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/reviewboard")
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Application Template</h1>
      <TemplateForm />
    </div>
  )
}
