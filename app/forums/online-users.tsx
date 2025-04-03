import { prisma } from "@/lib/prisma"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export async function OnlineUsers() {
  // In a real application, you would track online status with sessions
  // For this example, we'll just get the most recently active users
  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      name: true,
      image: true,
      role: true,
      status: true,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Online Users</CardTitle>
        <CardDescription>
          {recentUsers.length} users currently online
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUsers.map((user) => (
            <Link key={user.id} href={`/members/${user.id}`} className="flex items-center space-x-4 rounded-md p-2 hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name || ""} />
                <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  {user.role === "ADMIN" && (
                    <Badge className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                      Admin
                    </Badge>
                  )}
                  {user.role === "MODERATOR" && (
                    <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Mod
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{user.status || "Online"}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}