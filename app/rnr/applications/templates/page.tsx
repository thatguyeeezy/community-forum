import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma" // Fixed import
import { PlusCircle, Edit, ToggleLeft, ToggleRight } from "lucide-react"
import { canOverrideRnRDecisions } from "@/lib/roles"

export default async function ApplicationTemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/rnr/applications")
  }

  // Get all templates
  const templates = await prisma.applicationTemplate.findMany({
    orderBy: [{ departmentId: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { questions: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Application Templates</h1>
          <p className="text-muted-foreground">Manage department application templates</p>
        </div>
        <Link href="/rnr/applications/templates/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            {templates.length} template{templates.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium">
                <div>Department</div>
                <div>Name</div>
                <div>Questions</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {templates.map((template) => (
                  <div key={template.id} className="grid grid-cols-5 p-4 items-center">
                    <div>{template.departmentId}</div>
                    <div>{template.name}</div>
                    <div>{template._count.questions}</div>
                    <div>
                      {template.active ? (
                        <span className="flex items-center text-green-600">
                          <ToggleRight className="mr-1 h-4 w-4" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <ToggleLeft className="mr-1 h-4 w-4" /> Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/rnr/applications/templates/${template.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/rnr/applications/templates/${template.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No templates found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
