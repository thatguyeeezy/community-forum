"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Edit } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { cn } from "@/lib/utils"
import type { Role } from "@prisma/client"

// Format the last active time as a relative time
function formatLastActive(lastActiveDate: string | null): string {
  if (!lastActiveDate) return "Recently"

  const lastActive = new Date(lastActiveDate)
  const now = new Date()
  const diffMs = now.getTime() - lastActive.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`

  return lastActive.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format the join date for display
function formatJoinDateForBadge(joinDate: string): string {
  return new Date(joinDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

// Define role colors and labels
const roleConfig = {
  HEAD_ADMIN: {
    label: "Head Administration",
    color: "bg-cyan-500 text-white hover:bg-cyan-600",
  },
  SENIOR_ADMIN: {
    label: "Senior Administration",
    color: "bg-purple-500 text-white hover:bg-purple-600",
  },
  ADMIN: {
    label: "Administration",
    color: "bg-red-800 text-white hover:bg-red-900",
  },
  JUNIOR_ADMIN: {
    label: "Junior Administration",
    color: "bg-blue-800 text-white hover:bg-blue-900",
  },
  SENIOR_STAFF: {
    label: "Senior Staff",
    color: "bg-green-800 text-white hover:bg-green-900",
  },
  STAFF: {
    label: "Staff",
    color: "bg-yellow-500 text-black hover:bg-yellow-600",
  },
  STAFF_IN_TRAINING: {
    label: "Staff In Training",
    color: "bg-red-400 text-white hover:bg-red-500",
  },
  MEMBER: {
    label: "Member",
    color: "bg-blue-400 text-white hover:bg-blue-500",
  },
  APPLICANT: {
    label: "Applicant",
    color: "bg-gray-400 text-white hover:bg-gray-500",
  },
}

interface UserProfile {
  id: number
  name: string
  email: string
  image: string
  bio: string
  role: Role
  rank?: string
  department?: string
  rnrStatus?: string
  discordId?: string
  createdAt: string
  threadCount?: number
  postCount?: number
  followers?: number
  following?: number
  lastActive?: string
  status?: string
}

interface DiscordMemberInfo {
  joinedAt: string
  roles: string[]
  nickname?: string
  avatar?: string
  communicationDisabledUntil?: string
  isPending?: boolean
}

export default function UserProfilePage() {
  const { id } = useParams()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [discordInfo, setDiscordInfo] = useState<DiscordMemberInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [error, setError] = useState("")

  const isOwnProfile = session?.user?.id === Number(id)

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true)

        // Fetch the user profile from the API
        const response = await fetch(`/api/users/${id}`, {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            setError("User not found")
          } else {
            setError("Failed to load profile")
          }
          setLoading(false)
          return
        }

        const userData = await response.json()
        setProfile(userData)

        // If the user has a Discord ID, fetch their Discord guild member info
        if (userData.discordId) {
          try {
            const discordResponse = await fetch(`/api/discord/member/${userData.discordId}`, {
              cache: "no-store",
            })

            if (discordResponse.ok) {
              const discordData = await discordResponse.json()
              setDiscordInfo(discordData)
            }
          } catch (discordErr) {
            console.error("Failed to fetch Discord info:", discordErr)
            // Don't set an error, just continue without Discord info
          }
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to load profile")
        setLoading(false)
      }
    }

    if (id && status !== "loading") {
      fetchProfile()
    }
  }, [id, status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="bg-gray-800 shadow-md rounded-md overflow-hidden border-l-4 border-blue-500 mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Skeleton className="h-24 w-24 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <Skeleton className="h-8 w-[200px] mx-auto md:mx-0 bg-gray-700" />
                  <Skeleton className="h-4 w-[150px] mx-auto md:mx-0 bg-gray-700" />
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <Skeleton className="h-5 w-[80px] bg-gray-700" />
                    <Skeleton className="h-5 w-[120px] bg-gray-700" />
                  </div>
                  <Skeleton className="h-4 w-full bg-gray-700" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-10 w-[100px] bg-gray-700" />
                  <Skeleton className="h-10 w-[100px] bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-[300px] w-full bg-gray-800" />
            </div>
            <div className="md:col-span-3">
              <Skeleton className="h-[400px] w-full bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container max-w-4xl py-10">
          <div className="bg-gray-800 shadow-md rounded-md overflow-hidden border-l-4 border-red-500">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-gray-100">Error</h2>
              <p className="text-gray-400">{error}</p>
            </div>
            <div className="p-6">
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="container max-w-4xl py-10">
          <div className="bg-gray-800 shadow-md rounded-md overflow-hidden border-l-4 border-red-500">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-gray-100">Profile Not Found</h2>
              <p className="text-gray-400">This user profile does not exist.</p>
            </div>
            <div className="p-6">
              <Button onClick={() => router.push("/")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Format the username from the name
  const username = profile.name?.toLowerCase().replace(/\s+/g, "") || `user${profile.id}`

  // Get role configuration
  const roleInfo = roleConfig[profile.role] || {
    label: "Unknown Role",
    color: "bg-gray-400 text-white hover:bg-gray-500",
  }

  // Check if account was created before April 30, 2025
  const earlyAdopterCutoff = new Date("2025-04-30T23:59:59")
  const isEarlyAdopter = profile.createdAt && new Date(profile.createdAt) < earlyAdopterCutoff

  // Determine which join date to use (Discord or website)
  const joinDate = discordInfo?.joinedAt || profile.createdAt
  const joinDateSource = discordInfo?.joinedAt ? "Discord" : "Website"

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="bg-gray-800 shadow-md rounded-md overflow-hidden border-l-4 border-blue-500 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24 border-4 border-gray-700">
                <AvatarImage src={profile.image || "/placeholder.svg"} alt={username} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {profile.name?.substring(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="space-y-0.5">
                  <h2 className="text-2xl font-bold text-gray-100">{profile.name}</h2>
                  <p className="text-gray-400">{profile.discordId ? `@${profile.discordId}` : `@${username}`}</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span
                    className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors", roleInfo.color)}
                  >
                    {roleInfo.label}
                  </span>
                  <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                    Joined {formatJoinDateForBadge(joinDate)}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
                    Last active {formatLastActive(profile.lastActive)}
                  </Badge>
                </div>
                <p className="text-gray-400">{profile.bio}</p>
              </div>
              <div className="flex flex-col gap-2">
                {isOwnProfile ? (
                  <Button onClick={() => setEditProfileOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Follow
                    </Button>
                    <Button variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600">
                      <Mail className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-bold text-gray-100">Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Rank</span>
                  <span className="font-medium text-right break-words max-w-[60%] text-gray-200">
                    {profile.rank || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Department</span>
                  <span className="font-medium text-right break-words max-w-[60%] text-gray-200">
                    {profile.department === "N_A" ? "N/A" : profile.department}
                  </span>
                </div>
                {profile.rnrStatus && profile.rnrStatus !== "NONE" && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-400">R&R Status</span>
                    <span className="font-medium text-right break-words max-w-[60%] text-gray-200">
                      {profile.rnrStatus.replace("RNR_", "").replace("_", " ")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-gray-400">Discord Join</span>
                  <span className="font-medium text-right break-words max-w-[60%] text-gray-200">
                    {discordInfo?.joinedAt
                      ? new Date(discordInfo.joinedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Not in server"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-bold text-gray-100">Stats</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threads</span>
                  <span className="font-medium text-gray-200">{profile.threadCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Posts</span>
                  <span className="font-medium text-gray-200">{profile.postCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Followers</span>
                  <span className="font-medium text-gray-200">{profile.followers || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Following</span>
                  <span className="font-medium text-gray-200">{profile.following || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h3 className="font-bold text-gray-100">Badges</h3>
                <p className="text-sm text-gray-400">Achievements earned</p>
              </div>
              <div className="p-4">
                {(() => {
                  const badges = []

                  if (isEarlyAdopter) {
                    badges.push(
                      <div
                        key="early-adopter"
                        className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800"
                      >
                        Early Adopter
                      </div>,
                    )
                  }

                  if (profile.postCount && profile.postCount > 50) {
                    badges.push(
                      <div
                        key="helpful"
                        className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800"
                      >
                        Helpful
                      </div>,
                    )
                  }

                  if (profile.threadCount && profile.threadCount > 20) {
                    badges.push(
                      <div
                        key="contributor"
                        className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800"
                      >
                        Top Contributor
                      </div>,
                    )
                  }

                  if (badges.length === 0) {
                    return <span className="text-sm text-gray-400">No badges earned yet</span>
                  }

                  return <div className="flex flex-wrap gap-2">{badges}</div>
                })()}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <Tabs defaultValue="threads" className="space-y-4">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger
                  value="threads"
                  className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-gray-100"
                >
                  Threads
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-gray-100"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-gray-100"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-gray-700 text-gray-300 data-[state=active]:text-gray-100"
                >
                  About
                </TabsTrigger>
              </TabsList>
              <TabsContent value="threads">
                <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold text-gray-100">Recent Threads</h3>
                    <p className="text-sm text-gray-400">Threads started by {profile.name}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-400">Recent threads will be displayed here</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="posts">
                <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold text-gray-100">Recent Posts</h3>
                    <p className="text-sm text-gray-400">Posts written by {profile.name}</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-400">Recent posts will be displayed here</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity">
                <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold text-gray-100">Recent Activity</h3>
                    <p className="text-sm text-gray-400">{profile.name}'s recent activity</p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-400">Recent activity will be displayed here</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="about">
                <div className="bg-gray-800 shadow-md rounded-md overflow-hidden">
                  <div className="p-4 border-b border-gray-700">
                    <h3 className="font-bold text-gray-100">About {profile.name}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-200">Bio</h3>
                      <p className="text-gray-400">{profile.bio || "No bio provided."}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200">Member Since</h3>
                      <p className="text-gray-400">
                        {new Date(joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-200">Last Active</h3>
                      <p className="text-gray-400">{formatLastActive(profile.lastActive)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        {isOwnProfile && (
          <EditProfileDialog
            open={editProfileOpen}
            onOpenChange={setEditProfileOpen}
            defaultValues={{
              name: profile.name || "",
              bio: profile.bio || "",
              rank: profile.rank || "",
              department: profile.department || "",
              discordId: profile.discordId || "",
            }}
          />
        )}
      </div>
    </div>
  )
}
