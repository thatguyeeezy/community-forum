// app/page.tsx
import { prisma } from "@/lib/prisma"
import { OnlineUsers } from "@/components/online-users"
import { Stats } from "@/components/stats" // Import the Stats component
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// We'll keep this function for the categories
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            threads: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    })

    return categories.map((category) => ({
      ...category,
      postCount: 0, // Simplified for now
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export default async function HomePage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to FCRP</h1>
            <p className="text-muted-foreground">Join us, share knowledge, and connect with others</p>
          </div>
          <Button asChild size="lg">
            <Link href="https://discord.gg/DaPzAREBGp">Join the Discord</Link>
          </Button>
        </div>

        {/* Stats - Replace the hardcoded stats with the Stats component */}
        <Stats />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Categories</h2>
              <Button variant="link" asChild>
                <Link href="/community">View All Categories</Link>
              </Button>
            </div>
            <div className="space-y-4">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link key={category.id} href={`/community/${category.slug}`}>
                    <Card className="hover:bg-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{category.name}</h3>
                            <p className="text-muted-foreground text-sm">{category.description}</p>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>{category._count.threads} threads</p>
                            <p>{category.postCount} posts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-muted-foreground">No categories found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Online Users */}
          <div>
            <OnlineUsers />
          </div>
        </div>
      </div>
    </div>
  )
}

