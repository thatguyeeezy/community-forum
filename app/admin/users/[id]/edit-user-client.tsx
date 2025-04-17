"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Save, RefreshCw, Shield, Ban, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { hasAdminPermission, isWebmaster } from "@/lib/roles"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

const departments = [
  { id: "N_A", name: "Not Set" },
  { id: "FHP", name: "Florida Highway Patrol" },
  { id: "BSO", name: "Broward Sheriff's Office" },
  { id: "MPD", name: "Municipal Police Department" },
  { id: "BCFR", name: "Fire Rescue" },
  { id: "FWC", name: "Fish and Wildlife" },
  { id: "CIV", name: "Civilian Operations" },
  { id: "RNR", name: "Recruitment & Retention" },
  { id: "DEV", name: "Development" },
  { id: "LEADERSHIP", name: "Leadership" },
]

const roles = [
  { id: "APPLICANT", name: "Applicant" },
  { id: "MEMBER", name: "Member" },
  { id: "STAFF_IN_TRAINING", name: "Staff in Training" },
  { id: "STAFF", name: "Staff" },
  { id: "SENIOR_STAFF", name: "Senior Staff" },
  { id: "JUNIOR_ADMIN", name: "Junior Admin" },
  { id: "ADMIN", name: "Admin" },
  { id: "SENIOR_ADMIN", name: "Senior Admin" },
  { id: "SPECIAL_ADVISOR", name: "Special Advisor" },
  { id: "HEAD_ADMIN", name: "Head Admin" },
  { id: "WEBMASTER", name: "Webmaster" },
]

interface EditUserClientProps {
  userId: string
}

export default function EditUserClient({ userId }: EditUserClientProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [syncingDiscord, setSyncingDiscord] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
  })

  useEffect(() => {
    fetchUser()
  }, [userId])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}`)
      if (!response.ok) throw new Error("Failed to fetch user")
      const data = await response.json()
      setUser(data)
      setFormData({
        name: data.name,
        role: data.role,
        department: data.department,
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "Failed to load user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const canEditRole = () => {
    const currentUserRole = session?.user?.role as string

    // Webmaster can edit any role
    if (isWebmaster(currentUserRole)) return true

    // Admins can only edit roles below Junior Admin
    if (hasAdminPermission(currentUserRole)) {
      const editingRole = user?.role || ""
      return !["JUNIOR_ADMIN", "ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR", "HEAD_ADMIN", "WEBMASTER"].includes(
        editingRole,
      )
    }

    return false
  }

  const canEditDepartment = () => {
    const currentUserRole = session?.user?.role as string

    // Webmaster and admins can edit any department
    if (isWebmaster(currentUserRole) || hasAdminPermission(currentUserRole)) return true

    // Junior Admins and Senior Staff can edit departments except leadership and dev
    if (["JUNIOR_ADMIN", "SENIOR_STAFF"].includes(currentUserRole)) {
      return formData.department !== "LEADERSHIP" && formData.department !== "DEV"
    }

    return false
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Check permissions for role editing
      if (formData.role !== user?.role && !canEditRole()) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to change this user's role",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // Check permissions for department editing
      if (formData.department !== user?.department && !canEditDepartment()) {
        toast({
          title: "Permission Denied",
          description: "You don't have permission to change this department",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to update user")

      toast({
        title: "Success",
        description: "User updated successfully",
      })

      // Refresh user data
      fetchUser()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleBanUser = async () => {
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
        body: JSON.stringify({ isBanned: !user?.isBanned }),
      })

      if (!response.ok) throw new Error("Failed to update user")

      toast({
        title: "Success",
        description: `User ${user?.isBanned ? "unbanned" : "banned"} successfully`,
      })

      // Refresh user data
      fetchUser()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const canDeleteUser = () => {
    const currentUserRole = session?.user?.role as string
    return currentUserRole === "WEBMASTER" || currentUserRole === "HEAD_ADMIN"
  }

  const handleDeleteUser = async () => {
    // Only Head Admin and Webmaster can delete users
    if (!canDeleteUser()) {
      toast({
        title: "Permission Denied",
        description: "Only Head Admin and Webmaster can delete users",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")

      toast({
        title: "Success",
        description: "User deleted successfully",
      })

      // Redirect back to users list
      router.push("/admin/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const syncDiscordRoles = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID is missing",
        variant: "destructive",
      })
      return
    }

    setSyncingDiscord(true)
    try {
      // Call the server action to sync user role
      const response = await fetch("/api/discord/sync-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) throw new Error("Failed to sync Discord roles")

      const result = await response.json()

      toast({
        title: "Success",
        description: result.message || "Discord roles synced successfully",
      })

      // Refresh user data
      fetchUser()
    } catch (error) {
      console.error("Error syncing Discord roles:", error)
      toast({
        title: "Error",
        description: "Failed to sync Discord roles",
        variant: "destructive",
      })
    } finally {
      setSyncingDiscord(false)
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">User not found</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">The user you are looking for does not exist.</p>
          <Button
            onClick={() => router.push("/admin/users")}
            className="mt-4 bg-slate-700 hover:bg-slate-800 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.push("/admin/users")}
          variant="outline"
          className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={() => router.push(`/profile/${user.id}`)}
            variant="outline"
            className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Profile
          </Button>

          {user.discordId && (
            <Button
              onClick={syncDiscordRoles}
              disabled={syncingDiscord}
              className="bg-slate-700 hover:bg-slate-800 text-white"
            >
              {syncingDiscord ? (
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
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">User Profile</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              User information and details
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              {user.image ? (
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>

              {user.discordId && (
                <p className="text-sm text-blue-500 dark:text-blue-400 mt-1">Discord ID: {user.discordId}</p>
              )}

              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Account Created:</span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">{formatDate(user.createdAt)}</span>
                </div>

                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Discord Joined:</span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">{formatDate(user.discordJoinedAt)}</span>
                </div>

                <div>
                  <span className="font-medium text-slate-700 dark:text-slate-300">Last Active:</span>{" "}
                  <span className="text-slate-600 dark:text-slate-400">{formatDate(user.lastActive)}</span>
                </div>
              </div>

              {user.isBanned && (
                <div className="mt-4">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    BANNED
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Edit User</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400">
              Update user information and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700 dark:text-slate-300">
                Role
                {!canEditRole() && (
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    (You don't have permission to change this)
                  </span>
                )}
              </Label>
              <Select
                disabled={!canEditRole()}
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id} className="text-slate-700 dark:text-slate-300">
                      <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        {role.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-slate-700 dark:text-slate-300">
                Department
                {!canEditDepartment() && (
                  <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                    (You don't have permission to change this)
                  </span>
                )}
              </Label>
              <Select
                disabled={!canEditDepartment()}
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-slate-700 dark:text-slate-300">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex justify-between w-full">
              <Button onClick={handleSave} disabled={saving} className="bg-slate-700 hover:bg-slate-800 text-white">
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>

              {hasAdminPermission(session?.user?.role as string) && (
                <Button
                  onClick={handleBanUser}
                  variant="outline"
                  className={user?.isBanned ? "border-green-200 text-green-700" : "border-red-200 text-red-700"}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  {user?.isBanned ? "Unban User" : "Ban User"}
                </Button>
              )}
            </div>

            {canDeleteUser() && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete User
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user account and remove all
                      associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
