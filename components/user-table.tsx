"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Edit, ExternalLink, Search, RefreshCw, AlertCircle, UserX, UserCheck } from "lucide-react"
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
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
  email: string
  image: string | null
  role: string
  department: string | null
  discordId: string | null
  createdAt: string
  lastActive: string | null
  discordJoinedAt?: string | null
  isBanned?: boolean
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncingRoles, setSyncingRoles] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.discordId?.toLowerCase().includes(query) ||
            user.role.toLowerCase().includes(query) ||
            (user.department && user.department.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      console.log("Fetched users data:", data)
      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
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
      console.error("Date formatting error:", e, "for date:", dateString)
      return "Never"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "WEBMASTER":
        return "bg-gray-500 text-white hover:bg-gray-600"
      case "HEAD_ADMIN":
        return "bg-cyan-500 text-white hover:bg-cyan-600"
      case "SENIOR_ADMIN":
        return "bg-blue-800 text-white hover:bg-blue-900"
      case "SPECIAL_ADVISOR":
        return "bg-purple-700 text-white hover:bg-purple-800"
      case "ADMIN":
        return "bg-red-800 text-white hover:bg-red-900"
      case "JUNIOR_ADMIN":
        return "bg-blue-600 text-white hover:bg-blue-900"
      case "SENIOR_STAFF":
        return "bg-green-800 text-white hover:bg-green-900"
      case "STAFF":
        return "bg-yellow-500 text-black hover:bg-yellow-600"
      case "STAFF_IN_TRAINING":
        return "bg-red-400 text-white hover:bg-red-500"
      case "MEMBER":
        return "bg-blue-400 text-white hover:bg-blue-500"
      default:
        return "bg-slate-500 text-white dark:bg-slate-600"
    }
  }

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <h3 className="text-lg font-medium text-red-400">Failed to load users</h3>
        <p className="text-red-300 mb-4">{error}</p>
        <Button onClick={fetchUsers} disabled={loading} variant="outline">
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-900 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <Button
          onClick={syncAllDiscordRoles}
          disabled={syncingRoles}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {syncingRoles ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Discord Roles
            </>
          )}
        </Button>
      </div>

      <div className="text-sm text-slate-400 mb-2">{filteredUsers.length} users found</div>

      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-400">User</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Department</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Created</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Discord Joined</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Last Active</th>
                <th className="px-4 py-3 text-right font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`${user.isBanned ? "bg-red-900/20" : "bg-slate-950"} hover:bg-slate-900/50`}
                  >
                    <td className="px-4 py-3">
                      <Link href={`/profile/${user.id}`} className="flex items-center gap-3 hover:underline">
                        <Avatar className="h-10 w-10 border border-slate-700">
                          {user.image ? (
                            <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                          ) : (
                            <AvatarFallback className="bg-slate-800 text-slate-200">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium text-white">
                            {user.name}
                            {user.isBanned && (
                              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">DISABLED</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[180px]">{user.email}</div>
                          {user.discordId && (
                            <div className="text-xs text-slate-500 truncate max-w-[180px]">
                              Discord: {user.discordId}
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
                    <td className="px-4 py-3 text-slate-300">{formatDepartment(user.department)}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDate(user.discordJoinedAt)}</td>
                    <td className="px-4 py-3 text-slate-300">{formatDate(user.lastActive)}</td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                          <DropdownMenuLabel className="text-slate-300">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user.id)}
                            className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewProfile(user.id)}
                            className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Profile
                          </DropdownMenuItem>
                          {user.isBanned ? (
                            <DropdownMenuItem className="text-green-400 focus:bg-slate-800 focus:text-green-300 cursor-pointer">
                              <UserCheck className="mr-2 h-4 w-4" />
                              Enable Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-red-400 focus:bg-slate-800 focus:text-red-300 cursor-pointer">
                              <UserX className="mr-2 h-4 w-4" />
                              Disable Account
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
