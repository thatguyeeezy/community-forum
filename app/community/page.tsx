import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, FileText, Shield, Plus, Filter, Megaphone, UserPlus, Lock } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { Role, Category, Thread, User } from "@prisma/client"

interface ThreadWithAuthor extends Thread {
  author: {
    name: string | null
    role: Role
  }
}

interface CategoryWithThreads extends Category {
  threads: ThreadWithAuthor[]
}

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
  const isAdmin = session?.user?.role && ["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN"].includes(session.user.role as Role)

  const announcements = await prisma.category.findMany({
    where: {
      minRole: {
        in: [Role.HEAD_ADMIN, Role.SENIOR_ADMIN, Role.ADMIN]
      }
    },
    include: {
      threads: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          author: {
            select: {
              name: true,
              role: true
            }
          }
        }
      }
    }
  }) as CategoryWithThreads[]

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Announcements</h1>
            <p className="text-muted-foreground">
              Important updates and announcements from the administration team.
            </p>
          </div>
          {isAdmin && (
            <Link href="/admin/announcements/create" className="btn btn-primary">
              Create Announcement
            </Link>
          )}
        </div>

        {/* Announcements */}
        <div className="space-y-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{announcement.name}</h2>
                    <Badge variant="secondary">Announcement</Badge>
                  </div>
                  {announcement.description && (
                    <p className="text-muted-foreground">{announcement.description}</p>
                  )}
                  
                  {/* Recent Threads */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Recent Updates</h3>
                    {announcement.threads.length > 0 ? (
                      <div className="space-y-2">
                        {announcement.threads.map((thread) => (
                          <div key={thread.id} className="flex items-center justify-between p-2 hover:bg-accent rounded-lg">
                            <div>
                              <Link href={`/community/${announcement.slug}/${thread.slug}`} className="font-medium hover:underline">
                                {thread.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                By {thread.author.name} ({thread.author.role})
                              </p>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(thread.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No recent updates</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {announcements.length === 0 && (
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-center">No announcements yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
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

