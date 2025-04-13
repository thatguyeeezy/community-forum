"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, UserCog, Shield, Ban, Eye, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { updateUserRole, banUser } from "@/app/actions/admin"
import { syncUserRole } from "@/app/actions/discord"
import { useSession } from "next-auth/react"
import { ROLE_HIERARCHY, canAssignRole, formatRoleDisplay } from "@/lib/roles"

interface UserData {
  id: number
  name: string | null
  email: string | null
  role: string
  department: string | null
  createdAt: Date
  lastActive: Date | null
  status: string | null
  _count: {
    threads: number
    posts: number
  }
}

interface UserTableProps {
  users: UserData[]
}

export function UserTable({ users }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState<number | null>(null)
  const [syncingUser, setSyncingUser] = useState<number | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const currentUserRole = session?.user?.role as string

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      false ||
      user.email?.toLowerCase().includes(searchLower) ||
      false ||
      user.role.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower) ||
      false
    )
  })

  // Handle role change
  const handleRoleChange = async (userId: number, newRole: string) => {
    // Check if the current user can assign this role
    if (!canAssignRole(currentUserRole, newRole)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to assign this role",
        variant: "destructive",
      })
      return
    }

    setIsLoading(userId)
    try {
      const result = await updateUserRole(userId.toString(), newRole)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: `User role updated to ${formatRoleDisplay(newRole)}`,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Handle ban/unban
  const handleBanToggle = async (userId: number, currentStatus: string | null) => {
    const isBanned = currentStatus === "Banned"
    setIsLoading(userId)

    try {
      const result = await banUser(userId.toString(), !isBanned)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: isBanned ? "User has been unbanned" : "User has been banned",
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user ban status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Handle Discord role sync
  const handleDiscordRoleSync = async (userId: number) => {
    setSyncingUser(userId)
    try {
      const result = await syncUserRole(userId)

      if (result.success) {
        toast({
          title: "Role Synced",
          description: result.message,
        })
        router.refresh()
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync Discord role",
        variant: "destructive",
      })
    } finally {
      setSyncingUser(null)
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "WEBMASTER":
        return <Badge className="bg-black text-white">Webmaster</Badge>
      case "HEAD_ADMIN":
        return <Badge className="bg-cyan-500 text-white">Head Admin</Badge>
      case "SENIOR_ADMIN":
        return <Badge className="bg-purple-500 text-white">Senior Admin</Badge>
      case "SPECIAL_ADVISOR":
        return <Badge className="bg-blue-800 text-white">Special Advisor</Badge>
      case "ADMIN":
        return <Badge className="bg-red-800 text-white">Admin</Badge>
      case "JUNIOR_ADMIN":
        return <Badge className="bg-blue-600 text-white">Junior Admin</Badge>
      case "SENIOR_STAFF":
        return <Badge className="bg-green-800 text-white">Senior Staff</Badge>
      case "STAFF":
        return <Badge className="bg-yellow-500 text-black">Staff</Badge>
      case "STAFF_IN_TRAINING":
        return <Badge className="bg-red-400 text-white">Staff Trainee</Badge>
      case "MEMBER":
        return <Badge className="bg-blue-400 text-white">Member</Badge>
      case "APPLICANT":
        return <Badge className="bg-gray-400 text-white">Applicant</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  // Get assignable roles based on current user's role
  const getAssignableRoleItems = () => {
    // Get the current user's role index
    const userRoleIndex = ROLE_HIERARCHY.indexOf(currentUserRole as any)
    if (userRoleIndex === -1) return []

    // Return all roles that have a higher index (lower rank) than the user's role
    const assignableRoles = ROLE_HIERARCHY.filter((_, index) => index > userRoleIndex)

    return assignableRoles.map((role) => (
      <DropdownMenuItem key={role} onClick={() => handleRoleChange(user.id, role)}>
        <Shield className="mr-2 h-4 w-4" />
        Make {formatRoleDisplay(role)}
      </DropdownMenuItem>
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{user.name || "Anonymous"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                      {user.status === "Banned" && (
                        <Badge variant="destructive" className="mt-1 w-fit">
                          Banned
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{user.department || "N/A"}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</TableCell>
                  <TableCell>
                    {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs">
                      <span>{user._count.threads} threads</span>
                      <span>{user._count.posts} posts</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading === user.id || syncingUser === user.id}>
                          {isLoading === user.id || syncingUser === user.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <MoreHorizontal className="h-4 w-4" />
                          )}
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/profile/${user.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        {/* Dynamically generate role options based on current user's permissions */}
                        {getAssignableRoleItems()}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleBanToggle(user.id, user.status)}
                          className={user.status === "Banned" ? "text-green-600" : "text-red-600"}
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          {user.status === "Banned" ? "Unban User" : "Ban User"}
                        </DropdownMenuItem>
                        {/* Add Discord role sync option */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDiscordRoleSync(user.id)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Discord Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
