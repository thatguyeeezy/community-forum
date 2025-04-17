import type { Metadata } from "next"
import { UserTable } from "@/components/user-table"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the community forum",
}

export default function UsersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage all users in the system</p>
      </div>

      <UserTable />
    </div>
  )
}
