import type { Metadata } from "next"
import { UserTable } from "@/components/user-table"
import { AdminSidebar } from "@/components/admin-sidebar"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the community forum",
}

export default function UsersPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <AdminSidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">View and manage all users in the system</p>
        </div>

        <UserTable />
      </div>
    </div>
  )
}
