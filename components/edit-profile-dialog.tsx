// components/edit-profile-dialog.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProfile } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues: {
    name: string
    bio: string
    rank?: string
    department?: string
    discordId?: string
  }
}

export function EditProfileDialog({ open, onOpenChange, defaultValues }: EditProfileDialogProps) {
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [rank, setRank] = useState("")
  const [department, setDepartment] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      console.log("Default values in dialog:", defaultValues) // Debug log
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

    console.log("Submitting form data:", {
      name,
      bio,
      rank,
      department,
      discordId,
    }) // Debug log

    const result = await updateProfile(formData)

    if (result.success) {
      // Update the session with the new name
      if (session) {
        await update({ name })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className={error && !name.trim() ? "border-red-500" : ""}
              />
              {error && !name.trim() && <p className="text-sm text-red-500">Name is required</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rank">Rank</Label>
              <Input
                id="rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Your rank"
                maxLength={30}
              />
              <p className="text-sm text-muted-foreground">{rank.length}/30 characters</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Primary Department</Label>
              <Select disabled value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department" className="bg-muted">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BSFR">BSFR</SelectItem>
                  <SelectItem value="BSO">BSO</SelectItem>
                  <SelectItem value="MPD">MPD</SelectItem>
                  <SelectItem value="FHP">FHP</SelectItem>
                  <SelectItem value="COMMS">COMMS</SelectItem>
                  <SelectItem value="FWC">FWC</SelectItem>
                  <SelectItem value="CIV">CIV</SelectItem>
                  <SelectItem value="DEV">Dev</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Department can only be changed by staff members in the Staff Panel
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discordId">Discord ID</Label>
              <Input
                id="discordId"
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="Your Discord ID"
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Discord ID is automatically set when you sign in with Discord
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={5}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground">{bio.length}/500 characters</p>
            </div>
          </div>

          {error && error !== "Name is required" && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

