import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { canOverrideRnRDecisions } from "@/lib/roles"
import { TemplateForm } from "@/components/template-form"

export default async function NewTemplatePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/rnr/applications")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Application Template</h1>
        <p className="text-muted-foreground">Create a new application template for a department</p>
      </div>

      <TemplateForm />
    </div>
  )
}
