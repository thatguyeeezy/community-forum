import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { PlusCircle, Edit, ToggleLeft, ToggleRight, Eye } from "lucide-react"
import { canOverrideRnRDecisions } from "@/lib/roles"

export default async function ApplicationTemplatesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Check if user has permission to manage templates
  if (!canOverrideRnRDecisions(session.user.role as string)) {
    redirect("/reviewboard/applications")
  }

  try {
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
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Application Templates</h1>
            <p className="text-gray-400 mt-1">Manage all department application templates</p>
          </div>
          <Link href="/reviewboard/applications/templates/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </Link>
        </div>

        <Card className="bg-gray-800 border-l-4 border-blue-500 shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-gray-100">Templates</CardTitle>
            <CardDescription className="text-gray-400">
              {templates.length} template{templates.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {templates.length > 0 ? (
              <div className="rounded-md border border-gray-700">
                <div className="grid grid-cols-5 p-4 font-medium text-gray-300 bg-gray-700/50">
                  <div>Department</div>
                  <div>Name</div>
                  <div>Questions</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y divide-gray-700">
                  {templates.map((template) => (
                    <div key={template.id} className="grid grid-cols-5 p-4 items-center text-gray-300">
                      <div>{template.departmentId}</div>
                      <div>{template.name}</div>
                      <div>{template._count.questions}</div>
                      <div>
                        {template.active ? (
                          <span className="flex items-center text-green-400">
                            <ToggleRight className="mr-1 h-4 w-4" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-400">
                            <ToggleLeft className="mr-1 h-4 w-4" /> Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/reviewboard/applications/templates/${template.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/reviewboard/applications/templates/${template.id}/edit`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">No templates found</div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error("Error in Templates Page:", error)
    return (
      <div className="p-8 bg-gray-900 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Application Templates</h1>
            <p className="text-gray-400 mt-1">Manage all department application templates</p>
          </div>
          <Link href="/reviewboard/applications/templates/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </Link>
        </div>

        <Card className="bg-gray-800 border-l-4 border-red-500 shadow">
          <CardHeader>
            <CardTitle className="text-gray-100">Error</CardTitle>
            <CardDescription className="text-gray-400">There was an error loading the templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">Please try again later or contact support if the issue persists.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
