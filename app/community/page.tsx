import { Button } from "@/components/ui/button"
import { MessageSquare, Users, FileText, Shield, Plus, Megaphone, UserPlus, Lock } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Helper function to get the appropriate icon
function getCategoryIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("announcement")) return Megaphone
  if (lowerName.includes("recruitment") || lowerName.includes("retention")) return UserPlus
  if (lowerName.includes("general") || lowerName.includes("discussion")) return MessageSquare
  if (lowerName.includes("introduction") || lowerName.includes("member")) return Users
  if (lowerName.includes("tutorial") || lowerName.includes("resource")) return FileText
  if (lowerName.includes("admin")) return Shield
  return MessageSquare // Default icon
}

// Function to check if user can create threads in a category
function canCreateInCategory(categoryId: number, userRole?: string, userDepartment?: string) {
  // Community Announcements - only SPECIAL_ADVISOR, SENIOR_ADMIN and HEAD_ADMIN
  if (categoryId === 1) {
    // Announcements category ID is 1
    return userRole === "SPECIAL_ADVISOR" || userRole === "SENIOR_ADMIN" || userRole === "HEAD_ADMIN"
  }

  // Recruitment and Retention - only RNR_ADMINISTRATION
  if (categoryId === 2) {
    // Recruitment category ID is 2
    return userDepartment === "RNR_ADMINISTRATION"
  }

  // General Discussions - any authenticated user (APPLICANT+)
  return !!userRole
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  // Fetch only the two categories we want to display
  const categories = await prisma.category.findMany({
    where: {
      id: {
        in: [1, 2], // Use integer IDs: 1 for Announcements, 2 for Recruitment
      },
      parentId: null, // Only top-level categories
    },
    include: {
      _count: {
        select: {
          threads: true,
        },
      },
      children: {
        include: {
          _count: {
            select: {
              threads: true,
            },
          },
        },
      },
      threads: {
        take: 0, // We don't need the actual threads, just the count
      },
    },
    orderBy: {
      order: "asc",
    },
  })

  // Get post counts for each category
  const categoryIds = categories.map((cat) => cat.id)
  const postCounts = await prisma.post.groupBy({
    by: ["threadId"],
    _count: {
      _all: true,
    },
    where: {
      thread: {
        categoryId: {
          in: categoryIds,
        },
      },
    },
  })

  // Calculate total posts per category
  const categoryPostCounts: Record<number, number> = {}
  for (const category of categories) {
    const threadIds = await prisma.thread.findMany({
      where: { categoryId: category.id },
      select: { id: true },
    })

    const ids = threadIds.map((t) => t.id)
    const posts = await prisma.post.count({
      where: {
        threadId: {
          in: ids,
        },
      },
    })

    categoryPostCounts[category.id] = posts
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-muted-foreground">Browse announcements and recruitment information</p>
          </div>
          <div className="flex items-center gap-2">
            {session ? (
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/community/new-thread">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Link>
              </Button>
            ) : (
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/auth/signin?callbackUrl=/community">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name)
            const threadCount = category._count.threads
            const postCount = categoryPostCounts[category.id] || 0
            const canCreate = canCreateInCategory(
              category.id,
              session?.user?.role as string,
              // @ts-ignore - department is added to session in auth.ts
              session?.user?.department as string,
            )

            let permissionText = ""
            if (category.id === 1) {
              // Announcements
              permissionText = "Postable by Special Advisor, Senior Admin, and Head Admin only"
            } else if (category.id === 2) {
              // Recruitment
              permissionText = "Postable by R&R Admin only"
            }

            return (
              <div key={category.id} className="space-y-4">
                <div className="bg-card shadow-md border-l-4 border-blue-500 rounded-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-4 pb-2">
                      <div className="rounded-full bg-blue-600/20 p-2">
                        <Icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold">
                            <Link href={`/community/${category.id}`} className="hover:text-blue-400">
                              {category.name}
                            </Link>
                          </h3>
                          {!canCreate && (
                            <div className="flex items-center text-muted-foreground text-sm">
                              <Lock className="h-3 w-3 mr-1" />
                              Restricted
                            </div>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{category.description}</p>
                        {permissionText && <p className="text-xs text-amber-500 mt-1">{permissionText}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {threadCount} threads
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {postCount} posts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
