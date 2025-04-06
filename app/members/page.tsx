"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import Link from "next/link"
import type { Role } from "@prisma/client"

interface Member {
  id: number
  name: string
  image: string | null
  role: Role
  joinDate: string
}

// Define role order and colors
const roleConfig = {
  HEAD_ADMIN: { order: 1, label: "Head Administration", color: "bg-cyan-500 text-white" },
  SENIOR_ADMIN: { order: 2, label: "Senior Administration", color: "bg-purple-500 text-white" },
  ADMIN: { order: 3, label: "Administration", color: "bg-red-800 text-white" },
  JUNIOR_ADMIN: { order: 4, label: "Junior Administration", color: "bg-blue-800 text-white" },
  SENIOR_STAFF: { order: 5, label: "Senior Staff", color: "bg-green-800 text-white" },
  STAFF: { order: 6, label: "Staff", color: "bg-yellow-500 text-black" },
  STAFF_IN_TRAINING: { order: 7, label: "Staff In Training", color: "bg-red-400 text-white" },
  MEMBER: { order: 8, label: "Member", color: "bg-blue-400 text-white" },
  APPLICANT: { order: 9, label: "Applicant", color: "bg-gray-400 text-white" },
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Failed to fetch members")
        }

        const data = await response.json()
        setMembers(data)
      } catch (error) {
        console.error("Error fetching members:", error)
        // Fallback mock data
        setMembers([
          {
            id: 1,
            name: "Alex Johnson",
            image: null,
            role: "HEAD_ADMIN" as Role,
            joinDate: new Date().toISOString(),
          },
          {
            id: 2,
            name: "Sarah Williams",
            image: null,
            role: "SENIOR_ADMIN" as Role,
            joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 3,
            name: "Michael Brown",
            image: null,
            role: "ADMIN" as Role,
            joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 4,
            name: "Emily Davis",
            image: null,
            role: "JUNIOR_ADMIN" as Role,
            joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 5,
            name: "David Wilson",
            image: null,
            role: "SENIOR_STAFF" as Role,
            joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 6,
            name: "Jessica Taylor",
            image: null,
            role: "STAFF" as Role,
            joinDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 7,
            name: "Ryan Martinez",
            image: null,
            role: "STAFF_IN_TRAINING" as Role,
            joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 8,
            name: "Jennifer Anderson",
            image: null,
            role: "MEMBER" as Role,
            joinDate: new Date(Date.now() - 210 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 9,
            name: "Daniel Thomas",
            image: null,
            role: "APPLICANT" as Role,
            joinDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  // Filter members based on search query
  const filteredMembers = members.filter((member) => member.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  // Group members by role
  const groupedMembers = filteredMembers.reduce(
    (groups, member) => {
      const role = member.role
      if (!groups[role]) {
        groups[role] = []
      }
      groups[role].push(member)
      return groups
    },
    {} as Record<Role, Member[]>,
  )

  // Sort roles by order defined in roleConfig
  const sortedRoles = Object.keys(groupedMembers).sort(
    (a, b) => roleConfig[a as Role].order - roleConfig[b as Role].order,
  ) as Role[]

  const getRoleBadge = (role: Role) => {
    const config = roleConfig[role]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>Community Members</CardTitle>
          <CardDescription>Browse all members of our community</CardDescription>
          <div className="mt-4 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-muted-foreground">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No members found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedRoles.map((role) => (
                <div key={role} className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {getRoleBadge(role)}
                    <span className="text-muted-foreground text-sm">
                      ({groupedMembers[role].length} {groupedMembers[role].length === 1 ? "member" : "members"})
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedMembers[role].map((member) => (
                      <Link href={`/profile/${member.id}`} key={member.id} className="block">
                        <div className="border rounded-lg p-4 hover:bg-accent transition-colors">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={member.image || undefined} alt={member.name || ""} />
                              <AvatarFallback>{member.name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date(member.joinDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

