import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { hasAdminPermission } from "@/lib/roles"

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin/reports")
  }

  const userRole = session.user.role as string

  // Allow WEBMASTER role explicitly or any admin role
  if (!(userRole === "WEBMASTER" || hasAdminPermission(userRole))) {
    redirect("/auth/error?error=AccessDenied")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">View and manage user reports</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Reports submitted by users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10 text-muted-foreground">
                <p>No reports found.</p>
                <p className="text-sm mt-2">When users report content, it will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
