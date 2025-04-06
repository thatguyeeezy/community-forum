"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Department data with appropriate icons
const departmentsData = {
  civ: {
    id: "civ",
    name: "CIV – Civilian",
    fullName: "Civilian Operations",
    description:
      "The backbone of our roleplay community, civilians bring life to our virtual world through diverse characters, businesses, and storylines.",
    memberCount: 245,
    icon: Users,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    leaderTitle: "Civilian Director",
    leader: {
      name: "Alex Johnson",
      image: "/placeholder.svg?height=40&width=40",
      title: "Civilian Director",
      since: "January 2023",
    },
    subdivisions: [
      {
        name: "Businesses",
        description: "Own and operate businesses within the community",
        memberCount: 78,
        leader: "Sarah Williams",
      },
      {
        name: "Criminal Organizations",
        description: "Roleplay as part of organized crime groups",
        memberCount: 56,
        leader: "Michael Rodriguez",
      },
      {
        name: "Civilian Jobs",
        description: "Take on various civilian occupations",
        memberCount: 111,
        leader: "Emily Chen",
      },
    ],
    requirements: [
      "Minimum age of 16",
      "Discord account",
      "Working microphone",
      "Basic understanding of roleplay concepts",
      "Ability to follow server rules and guidelines",
    ],
    announcements: [
      {
        title: "New Business Application Process",
        date: "March 15, 2025",
        content:
          "We've streamlined the business application process. Check out the new form in the Business subdivision section.",
      },
      {
        title: "Civilian Training Sessions",
        date: "March 10, 2025",
        content: "Weekly training sessions for new civilians will be held every Saturday at 7 PM EST.",
      },
    ],
    members: [
      { name: "Alex Johnson", role: "Director", image: "/placeholder.svg?height=40&width=40" },
      { name: "Sarah Williams", role: "Business Lead", image: "/placeholder.svg?height=40&width=40" },
      { name: "Michael Rodriguez", role: "Criminal Org Lead", image: "/placeholder.svg?height=40&width=40" },
      { name: "Emily Chen", role: "Jobs Coordinator", image: "/placeholder.svg?height=40&width=40" },
      { name: "David Wilson", role: "Senior Member", image: "/placeholder.svg?height=40&width=40" },
      { name: "Jessica Taylor", role: "Member", image: "/placeholder.svg?height=40&width=40" },
    ],
  },
  // Add other departments as needed
}

export default function DepartmentPage() {
  const params = useParams()
  const slug = params?.slug
  const departmentId = typeof slug === "string" ? slug : Array.isArray(slug) ? slug[0] : "civ"

  // Get department data or default to CIV if not found
  const department = departmentsData[departmentId as keyof typeof departmentsData] || departmentsData.civ

  const DeptIcon = department.icon

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with Department Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{department.name}</CardTitle>
              <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-40">
                  <DeptIcon className="w-full h-full text-gray-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Department Information</h3>
                  <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Leadership</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={department.leader.image} />
                        <AvatarFallback>{department.leader.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">{department.leader.name}</p>
                        <p className="text-xs text-muted-foreground">{department.leader.title}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium">Subdivisions</h3>
                  <div className="mt-2 space-y-2">
                    {department.subdivisions.map((subdivision, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">{subdivision.name}</p>
                          <p className="text-xs text-muted-foreground">{subdivision.description}</p>
                        </div>
                        <Badge variant="secondary">{subdivision.memberCount} members</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{department.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {department.requirements.map((requirement, index) => (
                      <li key={index}>{requirement}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {department.announcements.map((announcement, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <h3 className="font-medium">{announcement.title}</h3>
                        <p className="text-sm text-muted-foreground">{announcement.date}</p>
                        <p className="mt-2">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 