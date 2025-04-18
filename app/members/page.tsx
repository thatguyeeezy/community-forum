"use client"

import { useState, useEffect } from "react"
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
  discordId?: string
  discordJoinDate?: string
  department?: string
}

interface DiscordMemberInfo {
  joinedAt: string
  roles: string[]
  nickname?: string
  avatar?: string
}

// Define role order and colors
const roleConfig: Record<string, { order: number; label: string; color: string }> = {
  HEAD_ADMIN: { order: 1, label: "Head Administration", color: "bg-cyan-500 text-white" },
  SENIOR_ADMIN: { order: 2, label: "Senior Administration", color: "bg-blue-800 text-white" },
  SPECIAL_ADVISOR: { order: 3, label: "Special Advisor", color: "bg-blue-800 text-white" },
  ADMIN: { order: 4, label: "Administration", color: "bg-red-800 text-white" },
  JUNIOR_ADMIN: { order: 5, label: "Junior Administration", color: "bg-blue-600 text-white" },
  SENIOR_STAFF: { order: 6, label: "Senior Staff", color: "bg-green-800 text-white" },
  STAFF: { order: 7, label: "Staff", color: "bg-yellow-500 text-black" },
  STAFF_IN_TRAINING: { order: 8, label: "Staff In Training", color: "bg-red-400 text-white" },
  MEMBER: { order: 9, label: "Member", color: "bg-blue-400 text-white" },
  APPLICANT: { order: 10, label: "Applicant", color: "bg-gray-400 text-white" },
  // Default fallback for any other roles
  DEFAULT: { order: 100, label: "User", color: "bg-gray-500 text-white" },
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [discordInfo, setDiscordInfo] = useState<Record<string, DiscordMemberInfo>>({})

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true)
        // Use the new members API endpoint instead of /api/users
        const response = await fetch("/api/members")

        if (!response.ok) {
          throw new Error("Failed to fetch members")
        }

        const data = await response.json()
        setMembers(data)

        // Fetch Discord info for members with discordId
        const discordMembers = data.filter((member: Member) => member.discordId)
        const discordInfoMap: Record<string, DiscordMemberInfo> = {}

        // Use Promise.all to fetch Discord info for all members in parallel
        await Promise.all(
          discordMembers.map(async (member: Member) => {
            try {
              const discordResponse = await fetch(`/api/discord/member/${member.discordId}`, {
                cache: "no-store",
              })

              if (discordResponse.ok) {
                const discordData = await discordResponse.json()
                discordInfoMap[member.id] = discordData
              }
            } catch (error) {
              console.error(`Failed to fetch Discord info for user ${member.id}:`, error)
            }
          }),
        )

        setDiscordInfo(discordInfoMap)
      } catch (error) {
        console.error("Error fetching members:", error)
        setMembers([])
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
  const sortedRoles = Object.keys(groupedMembers).sort((a, b) => {
    // Get the order for role a, defaulting to DEFAULT if not found
    const orderA = roleConfig[a] ? roleConfig[a].order : roleConfig.DEFAULT.order
    // Get the order for role b, defaulting to DEFAULT if not found
    const orderB = roleConfig[b] ? roleConfig[b].order : roleConfig.DEFAULT.order
    return orderA - orderB
  }) as Role[]

  const getRoleBadge = (role: Role) => {
    // Use the role config if it exists, otherwise use the DEFAULT config
    const config = roleConfig[role] || roleConfig.DEFAULT
    return <Badge className={config.color}>{config.label}</Badge>
  }

  // Format the join date for display
  const formatJoinDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container py-10">
        <div className="bg-gray-800 shadow-md rounded-md overflow-hidden border-l-4 border-blue-500">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-gray-100">Community Members</h1>
            <p className="text-gray-400 mt-1">Browse all members of our community</p>
            <div className="mt-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-400">Loading members...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400">No members found matching your search.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {sortedRoles.map((role) => (
                  <div key={role} className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
                      {getRoleBadge(role)}
                      <span className="text-gray-400 text-sm">
                        ({groupedMembers[role].length} {groupedMembers[role].length === 1 ? "member" : "members"})
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedMembers[role].map((member) => (
                        <Link href={`/profile/${member.id}`} key={member.id} className="block">
                          <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage src={member.image || undefined} alt={member.name || ""} />
                                <AvatarFallback className="bg-blue-600 text-white">
                                  {member.name?.substring(0, 2).toUpperCase() || "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-100">{member.name}</p>
                                <div className="text-xs text-gray-400 space-y-1">
                                  {/* Show Discord join date if available, otherwise show website join date */}
                                  <p>Joined {formatJoinDate(member.joinDate)}</p>
                                  {discordInfo[member.id] && (
                                    <p className="text-blue-400">
                                      Discord: {formatJoinDate(discordInfo[member.id].joinedAt)}
                                    </p>
                                  )}
                                </div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
