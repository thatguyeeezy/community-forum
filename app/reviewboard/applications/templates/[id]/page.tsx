import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canOverrideRnRDecisions } from "@/lib/roles"
import { ArrowLeft, Edit, Users, Shield } from "lucide-react"
import { fetchDiscordRoleName } from "@/app/actions/discord"

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

  // Get the template with questions and review board
  const template = await prisma.applicationTemplate.findUnique({
    where: { id: templateId },
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

  if (!template) {
    notFound()
  }

  // Fetch Discord role names if there are any
  const discordRoleNames: Record<string, string> = {}
  if (template.reviewBoard?.discordRoleIds) {
    const roleIds = template.reviewBoard.discordRoleIds.split(",")
    for (const roleId of roleIds) {
      try {
        discordRoleNames[roleId] = await fetchDiscordRoleName(roleId)
      } catch (error) {
        console.error(`Error fetching Discord role name for ${roleId}:`, error)
        discordRoleNames[roleId] = "Unknown Role"
      }
    }
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

          {/* Review Board Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Review Board</h3>

            {/* Discord Roles */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                <h4 className="font-medium">Discord Roles</h4>
                {template.reviewBoard?.discordRoleIds && (
                  <Badge variant="outline">{template.reviewBoard.discordRoleIds.split(",").length} role(s)</Badge>
                )}
              </div>

              {template.reviewBoard?.discordRoleIds ? (
                <div className="flex flex-wrap gap-2">
                  {template.reviewBoard.discordRoleIds.split(",").map((roleId) => (
                    <Badge key={roleId} variant="secondary">
                      {discordRoleNames[roleId] || roleId}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No Discord roles assigned</p>
              )}
            </div>

            {/* Review Board Members */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <h4 className="font-medium">Members</h4>
                {template.reviewBoard?.members && (
                  <Badge variant="outline">{template.reviewBoard.members.length} member(s)</Badge>
                )}
              </div>

              {template.reviewBoard?.members && template.reviewBoard.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {template.reviewBoard.members.map((member) => (
                    <div key={member.id} className="flex items-center p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        {member.discordId && (
                          <p className="text-xs text-muted-foreground">Discord ID: {member.discordId}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No members assigned</p>
              )}
            </div>
          </div>

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
