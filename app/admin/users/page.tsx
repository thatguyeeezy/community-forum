import type { Metadata } from "next"
import { UserTable } from "@/components/user-table"
import { AdminSidebar } from "@/components/admin-sidebar"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the community forum",
}

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-100">User Management</h1>
          <p className="text-gray-400">View and manage all users in the system</p>
        </div>

        <UserTable />
      </div>
    </div>
  )
}
