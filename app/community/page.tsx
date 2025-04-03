import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, FileText, Shield, Plus, Filter, Megaphone, UserPlus, Lock } from "lucide-react"
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
function canCreateInCategory(categoryId: string, userRole?: string, userDepartment?: string) {
  // Community Announcements - only SENIOR_ADMIN and HEAD_ADMIN
  if (categoryId === "announcements") {
    return userRole === "SENIOR_ADMIN" || userRole === "HEAD_ADMIN"
  }

  // Recruitment and Retention - only RNR_ADMINISTRATION and RNR_STAFF
  if (categoryId === "recruitment") {
    return userDepartment === "RNR_ADMINISTRATION" || userDepartment === "RNR_STAFF"
  }

  // General Discussions - any authenticated user (APPLICANT+)
  return !!userRole
}

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  // Fetch categories from the database
  const categories = await prisma.category.findMany({
    where: {
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
  const categoryPostCounts: Record<string, number> = {}
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

  // Try to fetch departments from the database, fall back to mock data if not available
  let formattedDepartments = []
  try {
    const departments = await prisma.departmentInfo.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
        subdivisions: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Format departments for display if we have them
    if (departments.length > 0) {
      formattedDepartments = departments.map((dept) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description || "",
        memberCount: dept._count.users,
        icon: Shield, // Default icon for departments
        subdivisions: dept.subdivisions.map((sub) => sub.name),
      }))
    } else {
      // Use mock data if no departments exist yet
      formattedDepartments = getMockDepartments()
    }
  } catch (error) {
    // If there's an error (like the table doesn't exist yet), use mock data
    console.error("Error fetching departments:", error)
    formattedDepartments = getMockDepartments()
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Browse discussions, resources, and departments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {session ? (
            <Button size="sm" asChild>
              <Link href="/community/new-thread">
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild>
              <Link href="/auth/signin?callbackUrl=/community">
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="community" className="space-y-4">
        <TabsList>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-4">
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

            return (
              <div key={category.id} className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle>
                          <Link href={`/community/${category.id}`} className="hover:underline">
                            {category.name}
                          </Link>
                        </CardTitle>
                        {!canCreate && (
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Lock className="h-3 w-3 mr-1" />
                            Restricted
                          </div>
                        )}
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {threadCount} threads
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {postCount} posts
                      </div>
                    </div>

                    {category.children.length > 0 && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-2">Subcategories</h4>
                        <div className="grid gap-2">
                          {category.children.map((subcategory) => {
                            const subCanCreate = canCreateInCategory(
                              subcategory.id,
                              session?.user?.role as string,
                              // @ts-ignore - department is added to session in auth.ts
                              session?.user?.department as string,
                            )

                            return (
                              <Link
                                key={subcategory.id}
                                href={`/community/${category.id}/${subcategory.id}`}
                                className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <h5 className="font-medium">{subcategory.name}</h5>
                                    {!subCanCreate && (
                                      <div className="ml-2 flex items-center text-muted-foreground text-xs">
                                        <Lock className="h-3 w-3 mr-1" />
                                        Restricted
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{subcategory.description}</p>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {subcategory._count.threads} threads
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formattedDepartments.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <department.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{department.name}</CardTitle>
                  </div>
                  <CardDescription>{department.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-sm font-medium">Members: </span>
                    <span className="text-sm text-muted-foreground">{department.memberCount}</span>
                  </div>

                  {department.subdivisions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Subdivisions</h4>
                      <div className="grid gap-1">
                        {department.subdivisions.map((subdivision, index) => (
                          <Link
                            key={index}
                            href={`/community/departments/${department.id}/${subdivision.toLowerCase().replace(/\s+/g, "-")}`}
                            className="text-sm rounded-md p-2 hover:bg-muted flex justify-between items-center"
                          >
                            <span>{subdivision}</span>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/community/departments/${department.id}`}>View Department</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to get mock departments data
function getMockDepartments() {
  return [
    {
      id: "civ",
      name: "CIV – Civilian",
      description: "Civilian operations and roleplay",
      memberCount: 245,
      icon: Users,
      subdivisions: ["Businesses", "Criminal Organizations", "Civilian Jobs"],
    },
    {
      id: "fhp",
      name: "FHP – Florida Highway Patrol",
      description: "State law enforcement agency",
      memberCount: 78,
      icon: Shield,
      subdivisions: ["Patrol Division", "Special Operations", "Training Division"],
    },
    {
      id: "mpd",
      name: "MPD – Miami Police Department",
      description: "City police department",
      memberCount: 92,
      icon: Shield,
      subdivisions: ["Patrol", "Investigations", "Special Units"],
    },
    {
      id: "bso",
      name: "BSO – Broward Sheriff's Office",
      description: "County law enforcement agency",
      memberCount: 65,
      icon: Shield,
      subdivisions: ["Patrol", "Corrections", "Special Units"],
    },
  ]
}

