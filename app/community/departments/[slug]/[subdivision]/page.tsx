"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

// Mock data for subdivisions
const subdivisionData = {
  businesses: {
    name: "Businesses",
    description: "Own and operate businesses within the community",
    memberCount: 78,
    leader: {
      name: "Sarah Williams",
      image: "/placeholder.svg?height=40&width=40",
      title: "Business Lead",
      since: "March 2023",
    },
    members: [
      { name: "Sarah Williams", role: "Business Lead", image: "/placeholder.svg?height=40&width=40" },
      { name: "John Smith", role: "Senior Business Owner", image: "/placeholder.svg?height=40&width=40" },
      { name: "Emma Johnson", role: "Business Owner", image: "/placeholder.svg?height=40&width=40" },
      { name: "Michael Brown", role: "Business Owner", image: "/placeholder.svg?height=40&width=40" },
      { name: "Jessica Davis", role: "Business Owner", image: "/placeholder.svg?height=40&width=40" },
      { name: "David Wilson", role: "Business Owner", image: "/placeholder.svg?height=40&width=40" },
    ],
    businesses: [
      { name: "Downtown Cafe", owner: "John Smith", type: "Restaurant", employees: 5 },
      { name: "Luxury Motors", owner: "Emma Johnson", type: "Car Dealership", employees: 8 },
      { name: "Seaside Hotel", owner: "Michael Brown", type: "Accommodation", employees: 12 },
      { name: "Tech Solutions", owner: "Jessica Davis", type: "IT Services", employees: 6 },
      { name: "Fashion Boutique", owner: "David Wilson", type: "Retail", employees: 4 },
    ],
  },
  "criminal-organizations": {
    name: "Criminal Organizations",
    description: "Roleplay as part of organized crime groups",
    memberCount: 56,
    leader: {
      name: "Michael Rodriguez",
      image: "/placeholder.svg?height=40&width=40",
      title: "Criminal Org Lead",
      since: "February 2023",
    },
    members: [
      { name: "Michael Rodriguez", role: "Criminal Org Lead", image: "/placeholder.svg?height=40&width=40" },
      { name: "Anthony Russo", role: "Organization Leader", image: "/placeholder.svg?height=40&width=40" },
      { name: "Sofia Moretti", role: "Organization Leader", image: "/placeholder.svg?height=40&width=40" },
      { name: "Carlos Vega", role: "Organization Member", image: "/placeholder.svg?height=40&width=40" },
      { name: "Elena Diaz", role: "Organization Member", image: "/placeholder.svg?height=40&width=40" },
    ],
    organizations: [
      { name: "Shadow Syndicate", leader: "Anthony Russo", territory: "Downtown", members: 12 },
      { name: "Coastal Crew", leader: "Sofia Moretti", territory: "Harbor District", members: 9 },
      { name: "Night Owls", leader: "Carlos Vega", territory: "Industrial Zone", members: 7 },
    ],
  },
  // Add more subdivisions as needed
}

export default function SubdivisionPage() {
  const { slug, subdivision } = useParams()
  const departmentSlug = typeof slug === "string" ? slug : slug[0]
  const subdivisionSlug = typeof subdivision === "string" ? subdivision : subdivision[0]

  // Get subdivision data
  const data = subdivisionData[subdivisionSlug as keyof typeof subdivisionData]

  if (!data) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Subdivision Not Found</h2>
              <p className="text-muted-foreground mb-4">The requested subdivision could not be found.</p>
              <Link href={`/community/departments/${departmentSlug}`} className="text-primary hover:underline">
                Return to department page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <Link href={`/community/departments/${departmentSlug}`} className="hover:underline">
            {departmentSlug.toUpperCase()}
          </Link>
          <span>/</span>
          <span>{data.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full p-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subdivision Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Members</span>
                <span className="font-medium">{data.memberCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Leader</span>
                <span className="font-medium">{data.leader.name}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={data.leader.image} alt={data.leader.name} />
                  <AvatarFallback>{data.leader.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{data.leader.name}</p>
                  <p className="text-sm text-muted-foreground">{data.leader.title}</p>
                  <p className="text-xs text-muted-foreground">Since {data.leader.since}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Active members in this subdivision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.members.map((member, index) => (
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

          {/* Conditional rendering based on subdivision type */}
          {subdivisionSlug === "businesses" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Active Businesses</CardTitle>
                <CardDescription>Businesses currently operating in the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Business Name</th>
                        <th className="text-left py-2 px-4">Owner</th>
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-left py-2 px-4">Employees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.businesses?.map((business, index) => (
                        <tr key={index} className="border-b hover:bg-muted">
                          <td className="py-2 px-4">{business.name}</td>
                          <td className="py-2 px-4">{business.owner}</td>
                          <td className="py-2 px-4">{business.type}</td>
                          <td className="py-2 px-4">{business.employees}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {subdivisionSlug === "criminal-organizations" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Active Organizations</CardTitle>
                <CardDescription>Criminal organizations currently operating in the community</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Organization Name</th>
                        <th className="text-left py-2 px-4">Leader</th>
                        <th className="text-left py-2 px-4">Territory</th>
                        <th className="text-left py-2 px-4">Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.organizations?.map((org, index) => (
                        <tr key={index} className="border-b hover:bg-muted">
                          <td className="py-2 px-4">{org.name}</td>
                          <td className="py-2 px-4">{org.leader}</td>
                          <td className="py-2 px-4">{org.territory}</td>
                          <td className="py-2 px-4">{org.members}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

