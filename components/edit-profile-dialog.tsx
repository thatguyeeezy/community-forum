// components/edit-profile-dialog.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  CustomDialog as Dialog,
  CustomDialogContent as DialogContent,
  CustomDialogDescription as DialogDescription,
  CustomDialogFooter as DialogFooter,
  CustomDialogHeader as DialogHeader,
  CustomDialogTitle as DialogTitle,
} from "@/components/custom-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RefreshCw, Lock } from "lucide-react"
import { syncDepartmentIfWhitelisted } from "@/app/actions/sync-department"
import { SelectDepartmentDialog } from "@/components/select-department-dialog"

// Update the interface to include userId
interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: {
    name: string
    bio: string
    rank?: string
    department?: string
    discordId?: string
    image?: string
  }
  userId?: number // Add userId prop
}

export function EditProfileDialog({ open, onOpenChange, defaultValues, userId }: EditProfileDialogProps) {
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [rank, setRank] = useState("")
  const [department, setDepartment] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add states for department sync
  const [isSyncingDepartment, setIsSyncingDepartment] = useState(false)
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false)
  const [departments, setDepartments] = useState<string[]>([])

  const router = useRouter()
  const { data: session, update } = useSession()
  const { toast } = useToast()

  // Initialize form with defaultValues when dialog opens or defaultValues change
  useEffect(() => {
    if (open && defaultValues) {
      setName(defaultValues.name || "")
      setBio(defaultValues.bio || "")
      setRank(defaultValues.rank || "")
      setDepartment(defaultValues.department || "N_A")
      setDiscordId(defaultValues.discordId || "")
    }
  }, [open, defaultValues])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim()) {
      setError("Name is required")
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("bio", bio)
    formData.append("rank", rank)
    formData.append("department", department)
    formData.append("discordId", discordId)

    const result = await updateProfile(formData)

    if (result.success) {
      // Update the session with the new name and image if provided
      if (session) {
        const updateData: { name: string } = { name }
        await update(updateData)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      onOpenChange(false)
      router.refresh()
    } else {
      setError(result.error || "Failed to update profile")
      toast({
        title: "Error",
        description: result.error || "Failed to update profile",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  // Add function to handle department sync
  const handleSyncDepartment = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID is missing",
        variant: "destructive",
      })
      return
    }

    setIsSyncingDepartment(true)
    try {
      const result = await syncDepartmentIfWhitelisted(userId)

      if (result.success) {
        if (result.multipleDepartments && result.departments && result.departments.length > 1) {
          // Show the department selection dialog if multiple departments were found
          setDepartments(result.departments)
          setShowDepartmentDialog(true)
        } else {
          toast({
            title: "Success",
            description: result.message,
          })

          // Update the department field if a department was found
          if (result.department) {
            setDepartment(result.department)
          }
        }
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync department",
        variant: "destructive",
      })
    } finally {
      setIsSyncingDepartment(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile information. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={defaultValues.image || ""} alt={name} />
                  <AvatarFallback>{name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your Discord profile picture is used as your avatar
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                  className={`bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 ${
                    error && !name.trim() ? "border-red-500" : ""
                  }`}
                />
                {error && !name.trim() && <p className="text-sm text-red-500">Name is required</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rank" className="text-gray-700 dark:text-gray-300">
                  Rank
                </Label>
                <Input
                  id="rank"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="Your rank"
                  maxLength={30}
                  className="bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">{rank.length}/30 characters</p>
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                    Department
                  </Label>
                  {userId && (
                    <Button
                      type="button"
                      onClick={handleSyncDepartment}
                      disabled={isSyncingDepartment}
                      className="h-8 px-3 bg-gray-800 hover:bg-gray-700 text-gray-100"
                    >
                      {isSyncingDepartment ? (
                        <>
                          <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-1 h-3 w-3" />
                          Sync from Discord
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md text-gray-800 dark:text-gray-200">
                    {department || "Not set"}
                  </div>
                  <div className="ml-2 text-gray-500 dark:text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Department can only be updated via "Sync from Discord"
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={5}
                  maxLength={500}
                  className="resize-none bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">{bio.length}/500 characters</p>
              </div>
            </div>

            {error && error !== "Name is required" && <p className="text-sm text-red-500 mb-4">{error}</p>}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add the department selection dialog */}
      {userId && (
        <SelectDepartmentDialog
          open={showDepartmentDialog}
          onOpenChange={setShowDepartmentDialog}
          userId={userId}
          departments={departments}
          onSuccess={(selectedDepartment) => {
            // Update the department field with the selected department
            setDepartment(selectedDepartment)
          }}
        />
      )}
    </>
  )
}
