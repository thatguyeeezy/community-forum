// app/page.tsx
import { prisma } from "@/lib/prisma"
import { OnlineUsers } from "@/components/online-users"
import { Stats } from "@/components/stats"
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
    <div className="bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gray-900 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-start gap-4 md:max-w-[60%]">
            <h1 className="text-4xl font-bold text-gray-100 md:text-5xl">Welcome to Florida Coast RP</h1>
            <p className="text-lg text-gray-300">
              Join our realistic FiveM roleplay community and experience immersive law enforcement, emergency services,
              and civilian interactions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="https://discord.gg/DaPzAREBGp">Join Discord</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              >
                <Link href="/community">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="space-y-8">
          {/* Stats */}
          <Stats />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Recent Activity - Left Sidebar */}
            <div className="md:col-span-3 space-y-6">
              <div className="rounded-lg bg-gray-800 shadow-md overflow-hidden">
                <div className="border-b border-gray-700 px-4 py-3">
                  <h2 className="text-xl font-bold text-gray-100">Recent Activity</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Activity items would go here */}
                    <div className="border-l-2 border-blue-500 pl-4">
                      <h3 className="font-medium text-gray-200">New police vehicles added</h3>
                      <p className="text-sm text-gray-400">Posted by Admin, 2h ago</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4">
                      <h3 className="font-medium text-gray-200">Server maintenance</h3>
                      <p className="text-sm text-gray-400">Posted by Moderator, 5h ago</p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4">
                      <h3 className="font-medium text-gray-200">Welcome to our newest members</h3>
                      <p className="text-sm text-gray-400">Posted by Community Manager, 1d ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories - Middle */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-100">Categories</h2>
                <Button variant="link" asChild className="text-blue-400 hover:text-blue-300">
                  <Link href="/community">View All Categories</Link>
                </Button>
              </div>
              <div className="space-y-4">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link key={category.id} href={`/community/${category.slug}`}>
                      <Card className="border-l-4 border-blue-600 bg-gray-800 shadow-md hover:bg-gray-700 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-100">{category.name}</h3>
                              <p className="text-gray-300 text-sm">{category.description}</p>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              <p>{category._count.threads} threads</p>
                              <p>{category.postCount} posts</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="bg-gray-800 shadow-md">
                    <CardContent className="p-4">
                      <p className="text-gray-400">No categories found</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Community Highlights - Right Sidebar */}
            <div className="md:col-span-3 space-y-6">
              {/* Featured Event */}
              <div className="rounded-lg bg-gray-800 shadow-md overflow-hidden">
                <div className="border-b border-gray-700 px-4 py-3">
                  <h2 className="text-xl font-bold text-gray-100">Featured Event</h2>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-200">Grand Opening Weekend</h3>
                  <p className="text-sm text-gray-300 mt-2">
                    Join us this weekend for the grand opening of the new shopping mall!
                  </p>
                  <p className="text-sm text-gray-400 mt-2">Saturday, 8PM EST</p>
                </div>
              </div>

              {/* Server Status */}
              <div className="rounded-lg bg-gray-800 shadow-md overflow-hidden">
                <div className="border-b border-gray-700 px-4 py-3">
                  <h2 className="text-xl font-bold text-gray-100">Server Status</h2>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-200">Online: 34 players</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-100">1,250</p>
                      <p className="text-sm text-gray-400">Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-100">3,705</p>
                      <p className="text-sm text-gray-400">Discord</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Users */}
              <OnlineUsers />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
