import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DebugPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug Information</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Data</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Role Helper Functions</h2>
        <Card>
          <CardContent className="mt-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 text-left">Function</th>
                  <th className="border p-2 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">hasAdminPermission(session?.user?.role)</td>
                  <td className="border p-2">
                    {String(
                      session?.user?.role &&
                        ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "ADMIN"].includes(
                          session.user.role as string,
                        ),
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">isWebmaster(session?.user?.role)</td>
                  <td className="border p-2">{String(session?.user?.role === "WEBMASTER")}</td>
                </tr>
                <tr>
                  <td className="border p-2">Role value</td>
                  <td className="border p-2">{session?.user?.role || "undefined"}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
