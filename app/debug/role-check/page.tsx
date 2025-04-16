import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { hasAdminPermission, hasStaffPermission, isWebmaster, ADMIN_ROLES } from "@/lib/roles"

export default async function RoleCheckDebugPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Session Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to see role information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const userRole = session.user.role as string
  const isAdmin = hasAdminPermission(userRole)
  const isStaff = hasStaffPermission(userRole)
  const isWebmasterRole = isWebmaster(userRole)
  const isExactWebmaster = userRole === "WEBMASTER"

  // Check if the role is in the ADMIN_ROLES array
  const isInAdminRoles = ADMIN_ROLES.includes(userRole)

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Role Check Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">User Information</h2>
            <p>
              <strong>Name:</strong> {session.user.name}
            </p>
            <p>
              <strong>Email:</strong> {session.user.email}
            </p>
            <p>
              <strong>Role:</strong> "{userRole}"
            </p>
            <p>
              <strong>Role Type:</strong> {typeof userRole}
            </p>
            <p>
              <strong>Role Length:</strong> {userRole.length}
            </p>
            <p>
              <strong>Role Character Codes:</strong>{" "}
              {Array.from(userRole)
                .map((c) => c.charCodeAt(0))
                .join(", ")}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold">Role Checks</h2>
            <p>
              <strong>hasAdminPermission:</strong> {String(isAdmin)}
            </p>
            <p>
              <strong>hasStaffPermission:</strong> {String(isStaff)}
            </p>
            <p>
              <strong>isWebmaster:</strong> {String(isWebmasterRole)}
            </p>
            <p>
              <strong>Direct check (userRole === "WEBMASTER"):</strong> {String(isExactWebmaster)}
            </p>
            <p>
              <strong>Is in ADMIN_ROLES array:</strong> {String(isInAdminRoles)}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold">Admin Roles List</h2>
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
              {JSON.stringify(ADMIN_ROLES, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
