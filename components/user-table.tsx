"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface User {
  id: number | string
  name: string
  email: string
  role: string
  department: string
  discordId: string | null
  createdAt: string
  lastActive: string | null
  isBanned: boolean
  discordJoinedAt?: string | null
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log("Fetching users from API")
      const response = await fetch("/api/users")

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || "Failed to fetch users")
      }

      const data = await response.json()
      console.log("Fetched users data:", data) // Debug log

      // For users with Discord IDs, fetch their Discord join dates
      const usersWithDiscordInfo = await Promise.all(
        data.map(async (user: User) => {
          if (user.discordId) {
            try {
              const discordResponse = await fetch(`/api/discord/member/${user.discordId}`)
              if (discordResponse.ok) {
                const discordData = await discordResponse.json()
                return {
                  ...user,
                  discordJoinedAt: discordData.joinedAt || null,
                }
              }
            } catch (err) {
              console.error(`Error fetching Discord info for user ${user.id}:`, err)
            }
          }
          return user
        }),
      )

      setUsers(usersWithDiscordInfo)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid date"

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (err) {
      console.error("Error formatting date:", err)
      return "Error"
    }
  }

  const formatDepartment = (department: string | null) => {
    if (!department || department === "N_A") return "Not Set"
    return department.replace(/_/g, " ")
  }

  const getInitials = (name: string | null) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "WEBMASTER":
        return "bg-gray-500 text-white"
      case "HEAD_ADMIN":
        return "bg-cyan-500 text-white"
      case "SENIOR_ADMIN":
        return "bg-blue-800 text-white"
      case "SPECIAL_ADVISOR":
        return "bg-purple-700 text-white"
      case "ADMIN":
        return "bg-red-800 text-white"
      case "JUNIOR_ADMIN":
        return "bg-blue-600 text-white"
      case "SENIOR_STAFF":
        return "bg-green-800 text-white"
      case "STAFF":
        return "bg-yellow-500 text-black"
      case "STAFF_IN_TRAINING":
        return "bg-red-400 text-white"
      case "MEMBER":
        return "bg-blue-400 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  const formatRole = (role: string) => {
    return role.replace(/_/g, " ")
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchUsers} disabled={loading}>
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

  // Check if any user has Discord join date
  const hasDiscordJoinDates = users.some((user) => user.discordJoinedAt)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Created</TableHead>
            {hasDiscordJoinDates && <TableHead>Discord Joined</TableHead>}
            <TableHead>Last Active</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={hasDiscordJoinDates ? 10 : 9} className="text-center py-10">
                <div className="flex items-center justify-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading users...
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={hasDiscordJoinDates ? 10 : 9} className="text-center py-10">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-medium text-white">
                      {getInitials(user.name)}
                    </div>
                    <span>{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(user.role)}`}>{formatRole(user.role)}</Badge>
                </TableCell>
                <TableCell>{formatDepartment(user.department)}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                {hasDiscordJoinDates && <TableCell>{formatDate(user.discordJoinedAt)}</TableCell>}
                <TableCell>{formatDate(user.lastActive)}</TableCell>
                <TableCell>
                  {user.isBanned ? (
                    <Badge variant="destructive">Disabled</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/admin/users/${user.id}`)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
