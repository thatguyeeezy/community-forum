import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { UserBadges } from "@/components/user-badges"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = Number.parseInt(params.id, 10)

  // Check if this is the user's own profile
  const isOwnProfile = session?.user?.id === userId

  try {
    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      notFound()
    }

    // Format join date
    const joinDate = formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })

    // Check if user is an early adopter (joined before April 30, 2025)
    const earlyAdopterCutoff = new Date("2025-04-30T23:59:59")
    const isEarlyAdopter = user.createdAt < earlyAdopterCutoff

    // Get department name
    const departmentName = user.department || "N/A"

    return (
      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">{user.name}</CardTitle>
                    <CardDescription>{user.discordId && `Discord ID: ${user.discordId}`}</CardDescription>
                  </div>
                  {isOwnProfile && (
                    <EditProfileDialog
                      open={false}
                      onOpenChange={() => {}}
                      defaultValues={{
                        name: user.name || "",
                        bio: user.bio || "",
                        rank: user.rank || "",
                        department: user.department || "",
                        discordId: user.discordId || "",
                      }}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                    <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Rank</p>
                    <p className="font-medium">{user.rank || "N/A"}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{departmentName}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{joinDate}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    <UserBadges isEarlyAdopter={isEarlyAdopter} />
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="information" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="information" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap break-words">{user.bio || "No bio provided."}</p>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Department Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Primary Department</p>
                      <p className="font-medium">{departmentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Rank</p>
                      <p className="font-medium">{user.rank || "N/A"}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>
                      <div className="space-y-6">
                        <div className="relative pl-8">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-background"></div>
                          </div>
                          <div>
                            <p className="font-medium">Joined the community</p>
                            <p className="text-sm text-muted-foreground">{joinDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching profile:", error)
    notFound()
  }
}

