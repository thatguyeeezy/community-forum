"use client"

import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="container mx-auto py-6 px-4 md:px-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1 space-y-2 text-center md:text-left">
                <Skeleton className="h-8 w-[200px] mx-auto md:mx-0" />
                <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <Skeleton className="h-5 w-[80px]" />
                  <Skeleton className="h-5 w-[120px]" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-[100px]" />
                <Skeleton className="h-10 w-[100px]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="md:col-span-3">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>This user profile does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardContent>
        </Card>
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
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card className="mb-6 bg-card text-foreground border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={profile.image || "/placeholder.svg"} alt={username} />
              <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="space-y-0.5">
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.discordId ? `@${profile.discordId}` : `@${username}`}</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span
                  className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors", roleInfo.color)}
                >
                  {roleInfo.label}
                </span>
                <Badge variant="outline">Joined {formatJoinDateForBadge(joinDate)}</Badge>
                <Badge variant="outline">Last active {formatLastActive(profile.lastActive)}</Badge>
              </div>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
            <div className="flex flex-col gap-2">
              {isOwnProfile ? (
                <Button onClick={() => setEditProfileOpen(true)} className="hover:bg-accent">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button className="hover:bg-accent">
                    <Users className="mr-2 h-4 w-4" />
                    Follow
                  </Button>
                  <Button variant="outline" className="hover:bg-accent">
                    <Mail className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card text-foreground border-border">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Rank</span>
                <span className="font-medium text-right break-words max-w-[60%]">{profile.rank || "Not set"}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium text-right break-words max-w-[60%]">
                  {profile.department === "N_A" ? "N/A" : profile.department}
                </span>
              </div>
              {profile.rnrStatus && profile.rnrStatus !== "NONE" && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">R&R Status</span>
                  <span className="font-medium text-right break-words max-w-[60%]">
                    {profile.rnrStatus.replace("RNR_", "").replace("_", " ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Discord Join</span>
                <span className="font-medium text-right break-words max-w-[60%]">
                  {discordInfo?.joinedAt
                    ? new Date(discordInfo.joinedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Not in server"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card text-foreground border-border">
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Threads</span>
                <span className="font-medium">{profile.threadCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts</span>
                <span className="font-medium">{profile.postCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers</span>
                <span className="font-medium">{profile.followers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Following</span>
                <span className="font-medium">{profile.following || 0}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card text-foreground border-border">
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>Achievements earned</CardDescription>
            </CardHeader>
            <CardContent>
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
                  return <span className="text-sm text-muted-foreground">No badges earned yet</span>
                }

                return <div className="flex flex-wrap gap-2">{badges}</div>
              })()}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Tabs defaultValue="threads" className="space-y-4">
            <TabsList>
              <TabsTrigger value="threads">Threads</TabsTrigger>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="threads">
              <Card className="bg-card text-foreground border-border">
                <CardHeader>
                  <CardTitle>Recent Threads</CardTitle>
                  <CardDescription>Threads started by {profile.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recent threads will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="posts">
              <Card className="bg-card text-foreground border-border">
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Posts written by {profile.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recent posts will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="activity">
              <Card className="bg-card text-foreground border-border">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>{profile.name}'s recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Recent activity will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about">
              <Card className="bg-card text-foreground border-border">
                <CardHeader>
                  <CardTitle>About {profile.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Bio</h3>
                    <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Member Since</h3>
                    <p className="text-muted-foreground">
                      {new Date(joinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Last Active</h3>
                    <p className="text-muted-foreground">{formatLastActive(profile.lastActive)}</p>
                  </div>
                </CardContent>
              </Card>
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
  )
}
