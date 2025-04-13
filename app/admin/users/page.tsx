import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserTable } from "@/components/user-table"
import { Button } from "@/components/ui/button"
import { syncAllUserRoles } from "@/app/actions/discord"
import { hasAdminPermission } from "@/lib/roles"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !hasAdminPermission(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/users")
  }

  // Check if user has senior admin permissions for the sync button
  const canSyncAllRoles = ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(
    session.user.role as string,
  )

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
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Management</h1>
            {canSyncAllRoles && (
              <form action={syncAllUserRoles}>
                <Button type="submit" variant="outline">
                  Sync All Discord Roles
                </Button>
              </form>
            )}
          </div>
          <div>
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
