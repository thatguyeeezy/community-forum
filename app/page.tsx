import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ServerStatus } from "@/components/server-status"

export default async function ForumHomepage() {
  const session = await getServerSession(authOptions)

  // Add error handling for database queries
  let memberCount = 0
  let activeToday = 0
  let threadCount = 0
  let postCount = 0
  let recentThreads = []
  let onlineUsers = []
  let categories = []

  try {
    // Fetch real data from the database
    memberCount = await prisma.user.count()

    activeToday = await prisma.user.count({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    })

    threadCount = await prisma.thread.count()
    postCount = await prisma.post.count()

    // Fetch recent threads
    recentThreads = await prisma.thread.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        category: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    // Fetch online users
    onlineUsers = await prisma.user.findMany({
      where: {
        lastActive: {
          gte: new Date(Date.now() - 15 * 60 * 1000), // Active in last 15 minutes
        },
      },
      take: 8,
      orderBy: {
        lastActive: "desc",
      },
    })

    // Fetch categories - FIXED: removed parentId filter
    const allCategories = await prisma.category.findMany({
      orderBy: {
        order: "asc",
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
            author: true,
          },
        },
      },
    })

    // Since we don't have parent-child relationships, just use all categories
    categories = allCategories

    console.log("Categories fetched:", categories.length)
  } catch (error) {
    console.error("Database error:", error)
    // Provide fallback data if database queries fail
    categories = []
    recentThreads = []
    onlineUsers = []
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-50 dark:text-gray-100 text-gray-900 font-sans">
      {/* Hero Section with asymmetrical layout */}
      <section className="relative dark:bg-gray-800 bg-white border-b dark:border-gray-700 border-gray-200 overflow-hidden">
        {/* Replace the light blue background with an image carousel background */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 overflow-hidden">
          {/* Image Carousel in Background */}
          <div className="relative w-full h-full">
            <div className="flex animate-carousel absolute inset-0">
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/images/carousel-1.png')] bg-cover bg-center opacity-80"></div>
                </div>
              </div>
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/images/carousel-2.png')] bg-cover bg-center opacity-80"></div>
                </div>
              </div>
              <div className="min-w-full h-full relative">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/images/carousel-3.png')] bg-cover bg-center opacity-80"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal overlay to create a more interesting visual */}
          <div className="absolute inset-0 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-800/80 dark:to-transparent bg-gradient-to-r from-white via-white/80 to-transparent transform -skew-x-12 origin-top-right"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4 dark:text-gray-100 text-gray-900">Welcome to Florida Coast RP</h1>
            <p className="dark:text-gray-300 text-gray-600 mb-6">
              Join our realistic FiveM roleplay community and experience immersive law enforcement, emergency services,
              and civilian interactions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://discord.gg/DaPzAREBGp"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Join Discord
              </a>
              <Link
                href="/about"
                className="inline-block px-6 py-2 border dark:border-gray-600 border-gray-300 rounded dark:text-gray-300 text-gray-600 hover:dark:bg-gray-700 hover:bg-gray-100"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with asymmetrical three-column layout */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Recent Activity */}
          <div className="lg:w-1/4 order-2 lg:order-1">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900 border-b dark:border-gray-700 border-gray-200 pb-2">
                Recent Activity
              </h2>

              <div className="space-y-6">
                {recentThreads.slice(0, 3).map((thread) => (
                  <div key={thread.id} className="relative pl-4 border-l-2 border-blue-500">
                    <Link
                      href={`/community/thread/${thread.id}`}
                      className="font-medium dark:text-gray-100 text-gray-900 hover:text-blue-400"
                    >
                      {thread.title}
                    </Link>
                    <div className="text-sm dark:text-gray-400 text-gray-500 mt-1">
                      Posted by {thread.author?.name || "Anonymous"}, {formatTimeAgo(new Date(thread.createdAt))}
                    </div>
                    <div className="text-sm dark:text-gray-300 text-gray-600 mt-2">
                      {thread.content?.substring(0, 100) || ""}...
                    </div>
                  </div>
                ))}

                {recentThreads.length === 0 && (
                  <div className="dark:text-gray-400 text-gray-500 text-sm">No recent activity to display.</div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-3 dark:text-gray-100 text-gray-900 border-b dark:border-gray-700 border-gray-200 pb-2">
                  Online Now
                </h3>
                <div className="flex flex-wrap gap-2">
                  {onlineUsers.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.id}`}
                      className="w-10 h-10 dark:bg-blue-900 bg-blue-100 rounded-full flex items-center justify-center dark:text-blue-300 text-blue-700 font-medium overflow-hidden"
                    >
                      {user.image ? (
                        <img
                          src={user.image || "/placeholder.svg"}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name?.substring(0, 2).toUpperCase() || "U"
                      )}
                    </Link>
                  ))}
                  {activeToday > onlineUsers.length && (
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      +{Math.max(0, activeToday - onlineUsers.length)}
                    </div>
                  )}

                  {onlineUsers.length === 0 && (
                    <div className="dark:text-gray-400 text-gray-500 text-sm">No users currently online.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Categories */}
          <div className="lg:w-2/4 order-1 lg:order-2">
            <h2 className="text-2xl font-bold mb-6 dark:text-gray-100 text-gray-900 border-b dark:border-gray-700 border-gray-200 pb-2">
              Categories
            </h2>

            <div className="space-y-8">
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div key={category.id}>
                    <div
                      className={`dark:bg-gray-800 bg-white shadow-md border-l-4 ${
                        index === 0 ? "border-blue-500" : "dark:border-gray-600 border-gray-300"
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold dark:text-gray-100 text-gray-900">{category.name}</h3>
                            <p className="dark:text-gray-300 text-gray-600 mt-1">{category.description}</p>
                          </div>
                          <div className="dark:bg-gray-700 bg-gray-100 dark:text-gray-300 text-gray-600 text-sm px-3 py-1 rounded">
                            {category._count?.threads || 0} threads
                          </div>
                        </div>

                        <div className="mt-4 border-t dark:border-gray-700 border-gray-200 pt-3">
                          {category.threads && category.threads.length > 0 ? (
                            category.threads.map((thread) => (
                              <Link
                                key={thread.id}
                                href={`/community/thread/${thread.id}`}
                                className="block py-2 hover:dark:bg-gray-700 hover:bg-gray-100 px-3 -mx-3 rounded"
                              >
                                <div className="font-medium dark:text-gray-100 text-gray-900">{thread.title}</div>
                                <div className="text-sm dark:text-gray-400 text-gray-500">
                                  Started by {thread.author?.name || "Anonymous"},{" "}
                                  {formatTimeAgo(new Date(thread.createdAt))}
                                </div>
                              </Link>
                            ))
                          ) : (
                            <div className="py-2 dark:text-gray-400 text-gray-500 text-sm">
                              No threads in this category yet.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dark:bg-gray-800 bg-white shadow-md p-5">
                  <p className="dark:text-gray-400 text-gray-500">
                    No categories found. Please check your database connection.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Community Highlights */}
          <div className="lg:w-1/4 order-3">
            <div className="sticky top-4">
              <h2 className="text-xl font-bold mb-4 dark:text-gray-100 text-gray-900 border-b dark:border-gray-700 border-gray-200 pb-2">
                Community Highlights
              </h2>

              {/* Featured Event */}
              <div className="dark:bg-gray-800 bg-white shadow-md p-5 mb-6 border-t-4 border-blue-500">
                <h3 className="font-bold mb-2 dark:text-gray-100 text-gray-900">Featured Event</h3>
                <p className="text-sm dark:text-gray-300 text-gray-600 mb-3">
                  Join us this weekend for the grand opening of the new shopping mall!
                </p>
                <div className="text-sm dark:text-gray-400 text-gray-500">Saturday, 8PM EST</div>
              </div>

              {/* Server Status */}
              <ServerStatus className="mb-6" />

              <div className="dark:bg-gray-800 bg-white shadow-md p-5 mb-6 border-l-4 border-blue-500">
                <h3 className="font-bold mb-2 dark:text-gray-100 text-gray-900">Discord</h3>
                <p className="text-sm dark:text-gray-300 text-gray-600 mb-3">
                  Join our Discord server to stay connected with the community!
                </p>
                <a
                  href="https://discord.gg/DaPzAREBGp"
                  className="inline-block px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Join Now
                </a>
              </div>

              <div className="dark:bg-gray-800 bg-white shadow-md p-5">
                <h3 className="font-bold mb-3 dark:text-gray-100 text-gray-900 border-b dark:border-gray-700 border-gray-200 pb-2">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/rules"
                      className="flex items-center dark:text-gray-300 text-gray-600 hover:text-blue-400"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Server Rules
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/join"
                      className="flex items-center dark:text-gray-300 text-gray-600 hover:text-blue-400"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      How to Join
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/apply"
                      className="flex items-center dark:text-gray-300 text-gray-600 hover:text-blue-400"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Staff Applications
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/report"
                      className="flex items-center dark:text-gray-300 text-gray-600 hover:text-blue-400"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Report a Player
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dark:bg-gray-900 bg-gray-100 dark:text-white text-gray-800 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="relative mr-3">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="Florida Coast RP Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="font-bold text-lg">Florida Coast RP</span>
              </div>
              <p className="dark:text-gray-400 text-gray-500 text-sm">
                A realistic FiveM roleplay community focused on quality roleplay and immersive experiences.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 dark:text-gray-200 text-gray-700 border-b dark:border-gray-700 border-gray-200 pb-2">
                Links
              </h3>
              <ul className="space-y-2 text-sm dark:text-gray-400 text-gray-500">
                <li>
                  <Link href="/" className="hover:text-blue-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-blue-400">
                    Forums
                  </Link>
                </li>
                <li>
                  <Link href="/members" className="hover:text-blue-400">
                    Members
                  </Link>
                </li>
                <li>
                  <Link href="/rules" className="hover:text-blue-400">
                    Rules
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 dark:text-gray-200 text-gray-700 border-b dark:border-gray-700 border-gray-200 pb-2">
                Connect
              </h3>
              <div className="flex space-x-3 mb-4">
                <a
                  href="#"
                  className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a
                  href="https://discord.gg/DaPzAREBGp"
                  className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 dark:bg-gray-800 bg-gray-200 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
              <p className="text-sm dark:text-gray-500 text-gray-400">
                © {new Date().getFullYear().toString()} Florida Coast Roleplay.
                <br />
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Helper function to format time ago
function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}
