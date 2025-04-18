"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateProfile } from "@/app/actions/profile"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [rank, setRank] = useState("")
  const [department, setDepartment] = useState("")
  const [discordId, setDiscordId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Load user data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setBio(session.user.bio || "")
      setRank(session.user.rank || "")
      setDepartment(session.user.department || "")
      setDiscordId(session.user.discordId || "")
    }
  }, [session])

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

    try {
      const result = await updateProfile(formData)

      if (result.success) {
        // Update the session with the new data
        if (session) {
          await update({
            name,
            bio,
            rank,
          })
        }

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })

        router.refresh()
      } else {
        setError(result.error || "Failed to update profile")
        toast({
          title: "Error",
          description: result.error || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating your profile",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Account Settings</h1>

      <Card className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-gray-100">Profile Information</CardTitle>
          <CardDescription className="dark:text-gray-400">Update your account information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Image - Discord Only */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={session?.user?.image || ""} alt={name} />
                <AvatarFallback className="text-lg">{name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <p className="text-sm dark:text-gray-400 mb-2">Your Discord profile picture is used as your avatar.</p>
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="dark:text-gray-300">
                Display Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className={`dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 ${error && !name.trim() ? "border-red-500" : ""}`}
              />
              {error && !name.trim() && <p className="text-sm text-red-500">Name is required</p>}
            </div>

            {/* Rank */}
            <div className="grid gap-2">
              <Label htmlFor="rank" className="dark:text-gray-300">
                Rank
              </Label>
              <Input
                id="rank"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Your rank"
                maxLength={30}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              <p className="text-sm dark:text-gray-400">{rank.length}/30 characters</p>
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department" className="dark:text-gray-300">
                Primary Department
              </Label>
              <Select disabled value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department" className="dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
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
              <p className="text-xs dark:text-gray-400">
                Department can only be changed by staff members in the Staff Panel
              </p>
            </div>

            {/* Discord ID */}
            <div className="grid gap-2">
              <Label htmlFor="discordId" className="dark:text-gray-300">
                Discord ID
              </Label>
              <Input
                id="discordId"
                value={discordId}
                readOnly
                disabled
                className="dark:bg-gray-600 dark:text-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs dark:text-gray-400">
                Discord ID is automatically set when you sign in with Discord and cannot be changed
              </p>
            </div>

            {/* Bio */}
            <div className="grid gap-2">
              <Label htmlFor="bio" className="dark:text-gray-300">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                rows={5}
                maxLength={500}
                className="resize-none dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
              <p className="text-sm dark:text-gray-400">{bio.length}/500 characters</p>
            </div>

            {error && error !== "Name is required" && <p className="text-sm text-red-500">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
