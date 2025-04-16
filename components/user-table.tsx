"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Trash2, Edit, Ban, Copy, UserCheck, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { hasAdminPermission, isWebmaster } from "@/lib/roles"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  department: string
  discordId: string | null
  createdAt: string
  lastActive: string | null
  discordJoinedAt?: string | null
  isBanned?: boolean
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [syncingRoles, setSyncingRoles] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    // Only Admin+ can ban users
    if (!hasAdminPermission(session?.user?.role as string)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to ban users",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !isBanned }),
      })

      if (!response.ok) throw new Error("Failed to update user")

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, isBanned: !isBanned } : user)))

      toast({
        title: "Success",
        description: `User ${isBanned ? "unbanned" : "banned"} successfully`,
      })
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    // Only Webmaster can delete users
    if (!isWebmaster(session?.user?.role as string)) {
      toast({
        title: "Permission Denied",
        description: "Only Webmaster can delete users",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      // Update local state
      setUsers(users.filter((user) => user.id !== userId))

      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleCopyDiscordId = (discordId: string) => {
    navigator.clipboard.writeText(discordId)
    toast({
      title: "Copied",
      description: "Discord ID copied to clipboard",
    })
  }

  const syncAllDiscordRoles = async () => {
    setSyncingRoles(true)
    try {
      const response = await fetch("/api/discord/sync-all-roles", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to sync Discord roles")

      toast({
        title: "Success",
        description: "Discord roles synced successfully",
      })

      // Refresh the user list
      fetchUsers()
    } catch (error) {
      console.error("Error syncing Discord roles:", error)
      toast({
        title: "Error",
        description: "Failed to sync Discord roles",
        variant: "destructive",
      })
    } finally {
      setSyncingRoles(false)
    }
  }

  const formatDepartment = (dept: string) => {
    if (dept === "N_A") return "Not Set"
    return dept.replace(/_/g, " ")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (e) {
      return "Invalid date"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "WEBMASTER":
        return "bg-purple-500 text-white"
      case "HEAD_ADMIN":
        return "bg-red-500 text-white"
      case "SENIOR_ADMIN":
        return "bg-orange-500 text-white"
      case "ADMIN":
        return "bg-yellow-500 text-black"
      case "JUNIOR_ADMIN":
        return "bg-blue-500 text-white"
      case "SENIOR_STAFF":
        return "bg-green-500 text-white"
      case "STAFF":
        return "bg-teal-500 text-white"
      default:
        return "bg-slate-500 text-white dark:bg-slate-600"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-500 dark:text-slate-400">{users.length} users found</div>
        <Button
          onClick={syncAllDiscordRoles}
          disabled={syncingRoles}
          className="bg-slate-700 hover:bg-slate-800 text-white"
        >
          {syncingRoles ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Sync All Discord Roles
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border dark:border-slate-700 border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Department</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Discord Joined</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Last Active</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-slate-500 dark:text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className={`${
                      user.isBanned ? "bg-red-50 dark:bg-red-900/20" : ""
                    } hover:bg-slate-50 dark:hover:bg-slate-800/50`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {user.image ? (
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                          ) : (
                            <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {user.name}
                            {user.isBanned && (
                              <span className="ml-2 text-xs bg-red-500 text-white px-1 py-0.5 rounded">BANNED</span>
                            )}
                          </div>
                          {user.discordId && (
                            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                              <span className="truncate max-w-[120px]">{user.discordId}</span>
                              <button
                                onClick={() => handleCopyDiscordId(user.discordId!)}
                                className="ml-1 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {formatDepartment(user.department)}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDate(user.discordJoinedAt)}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatDate(user.lastActive)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        >
                          <DropdownMenuLabel className="text-slate-700 dark:text-slate-300">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user.id)}
                            className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>

                          {hasAdminPermission(session?.user?.role as string) && (
                            <DropdownMenuItem
                              onClick={() => handleBanUser(user.id, !!user.isBanned)}
                              className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              {user.isBanned ? "Unban User" : "Ban User"}
                            </DropdownMenuItem>
                          )}

                          {isWebmaster(session?.user?.role as string) && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 dark:text-red-400 focus:bg-slate-100 dark:focus:bg-slate-800"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
