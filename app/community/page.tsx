import { Button } from "@/components/ui/button"
import { MessageSquare, Plus, Megaphone, UserPlus, Lock } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Helper function to get the appropriate icon
function getCategoryIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes("announcement")) return Megaphone
  if (lowerName.includes("recruitment") || lowerName.includes("retention")) return UserPlus
  return MessageSquare // Default icon
}

// Function to check if user can create announcements in a category
function canCreateAnnouncement(categoryId: number, userRole?: string, userDepartment?: string) {
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

  return false
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
      threads: {
        take: 1,
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  })

  console.log("Categories fetched:", categories.length)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Community</h1>
            <p className="text-gray-500 dark:text-gray-400">Browse announcements and recruitment information</p>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name)
            const threadCount = category._count.threads
            const latestThread = category.threads[0]
            const canCreate = canCreateAnnouncement(
              category.id,
              session?.user?.role as string,
              // @ts-ignore - department is added to session in auth.ts
              session?.user?.department as string,
            )

            let permissionText = ""
            if (category.id === 1) {
              permissionText = "Postable by Special Advisor, Senior Admin, and Head Admin only"
            } else if (category.id === 2) {
              permissionText = "Postable by R&R Admin only"
            }

            return (
              <div key={category.id} className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full bg-blue-600/20 p-3">
                      <Icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        <Link href={`/community/${category.id}`} className="hover:text-blue-500">
                          {category.name}
                        </Link>
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">{category.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{threadCount}</span> announcement{threadCount !== 1 && "s"}
                    </div>
                    {canCreate ? (
                      <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Link href={`/community/new-announcement?categoryId=${category.id}`}>
                          <Plus className="h-4 w-4 mr-2" />
                          New Announcement
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex items-center text-amber-500 text-sm">
                        <Lock className="h-3 w-3 mr-1" />
                        {permissionText}
                      </div>
                    )}
                  </div>

                  {latestThread ? (
                    <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md">
                      <h3 className="font-medium mb-1">
                        <Link href={`/community/announcement/${latestThread.id}`} className="hover:text-blue-500">
                          {latestThread.title}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        By {latestThread.author.name} • {new Date(latestThread.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-md text-center text-gray-500 dark:text-gray-400">
                      No announcements yet
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <Link
                      href={`/community/${category.id}`}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      View all announcements →
                    </Link>
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
