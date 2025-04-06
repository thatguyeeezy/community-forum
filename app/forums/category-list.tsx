import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, FileText, Shield } from 'lucide-react'

// Helper function to get the appropriate icon
function getCategoryIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('general') || lowerName.includes('discussion')) return MessageSquare
  if (lowerName.includes('introduction') || lowerName.includes('member')) return Users
  if (lowerName.includes('tutorial') || lowerName.includes('resource')) return FileText
  if (lowerName.includes('announcement') || lowerName.includes('admin')) return Shield
  return MessageSquare // Default icon
}

export async function CategoryList() {
  // Get categories from the database
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
    },
    orderBy: {
      order: "asc",
    },
  })
  
  // Get post counts for each category
  const categoryIds = categories.map(cat => cat.id)
  const threadCounts = await prisma.thread.groupBy({
    by: ['categoryId'],
    _count: {
      _all: true,
    },
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
  })
  
  // Create a map of category ID to thread count
  const threadCountMap = threadCounts.reduce((acc, curr) => {
    acc[curr.categoryId] = curr._count._all
    return acc
  }, {} as Record<string, number>)
  
  // Get post counts
  const postCounts = await prisma.post.count({
    where: {
      thread: {
        categoryId: {
          in: categoryIds,
        },
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Link href="/forums" className="text-sm text-primary hover:underline">
          View All Categories
        </Link>
      </div>
      <div className="grid gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name)
          const threadCount = category._count.threads
          
          return (
            <Link key={category.id} href={`/forums/${category.id}`}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MessageSquare className="mr-1 h-4 w-4" />
                      {threadCount} threads
                    </div>
                    {category.children.length > 0 && (
                      <div className="flex items-center">
                        <FileText className="mr-1 h-4 w-4" />
                        {category.children.length} subcategories
                      </div>
                    )}
                  </div>
                  
                  {category.children.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {category.children.map((subcategory) => (
                        <Link 
                          key={subcategory.id} 
                          href={`/forums/${subcategory.id}`}
                          className="block rounded-md p-2 hover:bg-muted"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{subcategory.name}</p>
                              <p className="text-xs text-muted-foreground">{subcategory.description}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {subcategory._count.threads} threads
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}