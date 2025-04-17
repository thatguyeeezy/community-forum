"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Edit, ExternalLink, ArrowLeft } from "lucide-react"
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

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

  const handleViewProfile = (userId: string) => {
    router.push(`/profile/${userId}`)
  }

  const syncAllDiscordRoles = async () => {
    setSyncingRoles(true)
    try {
      const response = await fetch("/api/discord/sync-all-roles", {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to sync Discord roles")

      const result = await response.json()

      toast({
        title: "Success",
        description: result.message || "Discord roles synced successfully",
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

  const formatDepartment = (dept: string | null | undefined) => {
    if (!dept) return "Not Set"
    if (dept === "N_A") return "Not Set"
    return dept.replace(/_/g, " ")
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) return "Never"
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      return "Never"
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="mr-4 border-slate-200 dark:border-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">View and manage all users in the system</p>
          </div>
        </div>
        <Button
          onClick={syncAllDiscordRoles}
          disabled={syncingRoles}
          className="bg-slate-700 hover:bg-slate-800 text-white"
        >
          {syncingRoles ? "Syncing..." : "Sync All Discord Roles"}
        </Button>
      </div>

      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{users.length} users found</div>

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
                      <Link href={`/profile/${user.id}`} className="flex items-center gap-3 hover:underline">
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
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                              {user.discordId}
                            </div>
                          )}
                        </div>
                      </Link>
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
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(user.id)}
                            className="text-slate-700 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-slate-800"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Profile
                          </DropdownMenuItem>
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
