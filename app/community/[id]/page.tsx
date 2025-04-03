import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Plus, Clock, User } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

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

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const category = await prisma.category.findUnique({
    where: {
      id: params.id,
    },
    include: {
      children: true,
    },
  })

  if (!category) {
    notFound()
  }

  // Get threads for this category
  const threads = await prisma.thread.findMany({
    where: {
      categoryId: params.id,
    },
    include: {
      author: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: [
      {
        pinned: "desc",
      },
      {
        updatedAt: "desc",
      },
    ],
  })

  const canCreate = canCreateInCategory(
    category.id,
    session?.user?.role as string,
    // @ts-ignore - department is added to session in auth.ts
    session?.user?.department as string,
  )

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/community" className="hover:underline">
              Community
            </Link>
            <span>/</span>
            <span>{category.name}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        <div>
          {canCreate ? (
            <Button asChild>
              <Link href={`/community/new-thread?category=${category.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                New Thread
              </Link>
            </Button>
          ) : session ? (
            <Button disabled variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Restricted
            </Button>
          ) : (
            <Button asChild>
              <Link href={`/auth/signin?callbackUrl=/community/${category.id}`}>
                <Plus className="h-4 w-4 mr-2" />
                Sign In to Post
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {category.children.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Subcategories</h2>
          <div className="grid gap-4">
            {category.children.map((subcategory) => (
              <Link key={subcategory.id} href={`/community/${subcategory.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle>{subcategory.name}</CardTitle>
                    <CardDescription>{subcategory.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Threads */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Threads</h2>
        {threads.length > 0 ? (
          <div className="space-y-4">
            {threads.map((thread) => (
              <Link key={thread.id} href={`/community/thread/${thread.id}`}>
                <Card className={`hover:bg-muted/50 transition-colors ${thread.pinned ? "border-primary" : ""}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {thread.pinned && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded mr-2">
                              Pinned
                            </span>
                          )}
                          {thread.locked && (
                            <span className="text-xs bg-muted-foreground text-background px-2 py-0.5 rounded mr-2">
                              Locked
                            </span>
                          )}
                          {thread.title}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <User className="h-3 w-3 mr-1" />
                          {thread.author.name}
                          <span className="mx-1">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{thread._count.posts}</span>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>No threads have been created in this category yet.</p>
                {canCreate && (
                  <Button asChild className="mt-4">
                    <Link href={`/community/new-thread?category=${category.id}`}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create the First Thread
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

