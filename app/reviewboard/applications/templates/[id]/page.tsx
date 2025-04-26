import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canOverrideRnRDecisions } from "@/lib/roles"
import { ArrowLeft, Edit } from "lucide-react"

export default async function TemplatePage({ params }: { params: { id: string } }) {
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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/reviewboard/applications/templates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Template Details</h1>
        </div>
        <Link href={`/reviewboard/applications/templates/${templateId}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Template
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{template.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Department: {template.departmentId} • Status: {template.active ? "Active" : "Inactive"}
          </p>
        </CardHeader>
        <CardContent>
          {template.description && <p className="mb-4">{template.description}</p>}

          <h3 className="text-lg font-medium mb-2">Questions ({template.questions.length})</h3>
          {template.questions.length === 0 ? (
            <p className="text-muted-foreground">No questions added yet.</p>
          ) : (
            <div className="space-y-4">
              {template.questions.map((question, index) => (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Question {index + 1}</span>
                    <span className="text-sm text-muted-foreground">{question.type}</span>
                  </div>
                  <p className="mt-1">{question.text}</p>
                  {question.required && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded mt-2 inline-block">
                      Required
                    </span>
                  )}
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Options:</span>
                      <ul className="list-disc list-inside text-sm ml-2">
                        {question.options.map((option, i) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
