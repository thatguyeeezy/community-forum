// components/edit-profile-dialog.tsx
"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Camera, RefreshCw } from "lucide-react"
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
import { updateProfile, resetProfileImage } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
}

export function EditProfileDialog({ open, onOpenChange, defaultValues }: EditProfileDialogProps) {
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [rank, setRank] = useState("")
  const [department, setDepartment] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      setImage(defaultValues.image || null)
      setSelectedImage(null)
      setPreviewUrl(null)

      console.log("Default values in dialog:", defaultValues) // Debug log
    }
  }, [open, defaultValues])

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle reset to Discord image
  const handleResetImage = async () => {
    setIsResetting(true)
    setError(null)

    try {
      const result = await resetProfileImage()

      if (result.success) {
        // Update the session with the new image
        if (session) {
          await update({ image: result.discordImage })
        }

        setImage(result.discordImage || null)
        setSelectedImage(null)
        setPreviewUrl(null)

        toast({
          title: "Profile image reset",
          description: "Your profile image has been reset to your Discord avatar.",
        })
      } else {
        setError(result.error || "Failed to reset profile image")
        toast({
          title: "Error",
          description: result.error || "Failed to reset profile image",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Reset image error:", error)
      setError("Failed to reset profile image")
      toast({
        title: "Error",
        description: "Failed to reset profile image",
        variant: "destructive",
      })
    }

    setIsResetting(false)
  }

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

    // Add the selected image if there is one
    if (selectedImage) {
      formData.append("profileImage", selectedImage)
    }

    console.log("Submitting form data:", {
      name,
      bio,
      rank,
      department,
      discordId,
      hasImage: selectedImage ? true : false,
    }) // Debug log

    const result = await updateProfile(formData)

    if (result.success) {
      // Update the session with the new name and image if provided
      if (session) {
        const updateData: { name: string; image?: string } = { name }
        if (result.imageUrl) {
          updateData.image = result.imageUrl
        }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl || image || ""} alt={name} />
                  <AvatarFallback>{name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-2 border-white dark:border-gray-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {(previewUrl || (image && discordId)) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs flex items-center gap-1"
                  onClick={handleResetImage}
                  disabled={isResetting}
                >
                  {isResetting ? (
                    "Resetting..."
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset to Discord avatar
                    </>
                  )}
                </Button>
              )}
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
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">
                Primary Department
              </Label>
              <Select disabled value={department} onValueChange={setDepartment}>
                <SelectTrigger
                  id="department"
                  className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-slate-700">
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Department can only be changed by staff members in the Staff Panel
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="discordId" className="text-gray-700 dark:text-gray-300">
                Discord ID
              </Label>
              <Input
                id="discordId"
                value={discordId}
                readOnly
                disabled
                className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Discord ID is automatically set when you sign in with Discord and cannot be changed
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
  )
}
