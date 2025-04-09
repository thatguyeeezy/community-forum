import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserTable } from "@/components/user-table"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !["ADMIN", "MODERATOR", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/users")
  }

  // Fetch users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      department: true,
      createdAt: true,
      lastActive: true,
      status: true,
      _count: {
        select: {
          threads: true,
          posts: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage users, roles, and permissions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <UserTable users={users} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
