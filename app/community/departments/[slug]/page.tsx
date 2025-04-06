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
  fhp: {
    id: "fhp",
    name: "FHP – Florida Highway Patrol",
    fullName: "Florida Highway Patrol",
    description:
      "The Florida Highway Patrol is responsible for highway safety, traffic enforcement, and crash investigations across the state's roadways.",
    memberCount: 78,
    icon: Shield,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    leaderTitle: "FHP Director",
    leader: {
      name: "Captain Thomas Reynolds",
      image: "/placeholder.svg?height=40&width=40",
      title: "FHP Director",
      since: "August 2023",
    },
    subdivisions: [
      {
        name: "Patrol Division",
        description: "Highway patrol and traffic enforcement",
        memberCount: 45,
        leader: "Lieutenant James Wilson",
      },
      {
        name: "Special Operations",
        description: "Specialized units including K9 and Air support",
        memberCount: 18,
        leader: "Lieutenant Sarah Martinez",
      },
      {
        name: "Training Division",
        description: "Training and development of FHP officers",
        memberCount: 15,
        leader: "Sergeant Robert Davis",
      },
    ],
    requirements: [
      "Minimum age of 16",
      "Discord account",
      "Working microphone",
      "Clean record on the server",
      "Ability to pass FHP academy training",
      "Minimum of 20 hours as a civilian",
    ],
    announcements: [
      {
        title: "FHP Academy Dates Announced",
        date: "March 20, 2025",
        content: "The next FHP Academy will begin on April 5th. Applications are now open.",
      },
      {
        title: "New Patrol Vehicles",
        date: "March 12, 2025",
        content: "FHP has received new patrol vehicles. Training on the new equipment will be held next week.",
      },
    ],
    members: [
      { name: "Thomas Reynolds", role: "Director", image: "/placeholder.svg?height=40&width=40" },
      { name: "James Wilson", role: "Patrol Lieutenant", image: "/placeholder.svg?height=40&width=40" },
      { name: "Sarah Martinez", role: "Special Ops Lieutenant", image: "/placeholder.svg?height=40&width=40" },
      { name: "Robert Davis", role: "Training Sergeant", image: "/placeholder.svg?height=40&width=40" },
      { name: "Michael Thompson", role: "Trooper", image: "/placeholder.svg?height=40&width=40" },
      { name: "Jennifer Adams", role: "Trooper", image: "/placeholder.svg?height=40&width=40" },
    ],
  },
  // Add other departments as needed
}

export default function DepartmentPage() {
  const { slug } = useParams()
  const departmentSlug = typeof slug === "string" ? slug : slug[0]

  // Get department data or default to CIV if not found
  const department = departmentsData[departmentSlug as keyof typeof departmentsData] || departmentsData.civ

  const DeptIcon = department.icon

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/community" className="hover:underline">
            Community
          </Link>
          <span>/</span>
          <Link href="/community/departments" className="hover:underline">
            Departments
          </Link>
          <span>/</span>
          <span>{department.name}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`rounded-full p-3 ${department.color}`}>
              <DeptIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{department.fullName}</h1>
              <p className="text-muted-foreground">{department.description}</p>
            </div>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Apply to Join
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">{department.memberCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leader</span>
                <span className="font-medium">{department.leader.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subdivisions</span>
                <span className="font-medium">{department.subdivisions.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={department.leader.image} alt={department.leader.name} />
                  <AvatarFallback>{department.leader.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{department.leader.name}</p>
                  <p className="text-sm text-muted-foreground">{department.leader.title}</p>
                  <p className="text-xs text-muted-foreground">Since {department.leader.since}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Subdivision Leaders</h4>
                <div className="space-y-2">
                  {department.subdivisions.map((subdivision, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{subdivision.name}</span>
                      <span className="text-muted-foreground">{subdivision.leader}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>To join this department</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {department.requirements.map((requirement, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="subdivisions">Subdivisions</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>About the {department.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Mission</h3>
                    <p className="text-muted-foreground">{department.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Structure</h3>
                    <p className="text-muted-foreground">
                      The {department.name} is led by the {department.leaderTitle} and organized into{" "}
                      {department.subdivisions.length} subdivisions, each with its own leadership and specialized focus.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">How to Join</h3>
                    <p className="text-muted-foreground">
                      Applications are processed through our Discord server. Candidates must meet all requirements and
                      complete the department's training program.
                    </p>
                    <Button className="mt-4">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subdivisions">
              <Card>
                <CardHeader>
                  <CardTitle>Subdivisions</CardTitle>
                  <CardDescription>Specialized units within {department.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {department.subdivisions.map((subdivision, index) => (
                      <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                        <h3 className="font-medium text-lg">{subdivision.name}</h3>
                        <p className="text-muted-foreground mb-2">{subdivision.description}</p>
                        <div className="flex justify-between text-sm">
                          <span>Members: {subdivision.memberCount}</span>
                          <span>Lead: {subdivision.leader}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="announcements">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                  <CardDescription>Latest news from {department.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {department.announcements.map((announcement, index) => (
                      <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          <Badge variant="outline">{announcement.date}</Badge>
                        </div>
                        <p className="text-muted-foreground">{announcement.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Department Members</CardTitle>
                  <CardDescription>Active members of {department.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {department.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <Avatar>
                          <AvatarImage src={member.image} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
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

