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
import { completeOnboarding } from "@/app/actions/onboarding"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [department, setDepartment] = useState("")
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated or if needsOnboarding is false
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (session?.user && session.user.needsOnboarding === false) {
      router.push("/")
    }
  }, [status, session, router])

  // Load user data from session
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")

      // If we have departments from Main Discord, set them as available options
      if (session.user.mainDiscordDepartments && Array.isArray(session.user.mainDiscordDepartments)) {
        setAvailableDepartments(session.user.mainDiscordDepartments)

        // Set the first department as default if available
        if (session.user.mainDiscordDepartments.length > 0) {
          setDepartment(session.user.mainDiscordDepartments[0])
        }
      }

      // We're not setting discordId here, ensuring it can't be changed
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

    try {
      // Note: We're only sending name, bio, and department - NOT discordId
      const result = await completeOnboarding({
        name,
        bio,
        department,
      })

      if (result.success) {
        toast({
          title: "Profile setup complete",
          description: "Welcome to Florida Coast RP! Your profile has been set up successfully.",
        })

        // Force a hard refresh to ensure the session is updated
        window.location.href = "/"
      } else {
        setError(result.error || "Failed to complete profile setup")
        toast({
          title: "Error",
          description: result.error || "Failed to complete profile setup",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error setting up profile:", err)
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred while setting up your profile",
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
      <h1 className="text-3xl font-bold mb-6 dark:text-gray-100">Welcome to Florida Coast RP!</h1>
      <p className="text-lg mb-8 dark:text-gray-300">
        We've detected that you're a member of our Main Discord server. Let's set up your profile with your information.
      </p>

      <Card className="dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl dark:text-gray-100">Complete Your Profile</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Customize your profile information before getting started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Image Display (Not Editable) */}
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div>
                <Avatar className="h-24 w-24">
                  <AvatarImage src={session?.user?.image || ""} alt={name} />
                  <AvatarFallback className="text-lg">{name?.slice(0, 2).toUpperCase() || "FC"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-sm dark:text-gray-400 mb-2">
                  Your Discord profile picture is automatically used as your avatar. To change your avatar, update it on
                  Discord.
                </p>
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
              <p className="text-xs dark:text-gray-400">
                We've pre-filled your Discord username, but you can change it if you prefer.
              </p>
            </div>

            {/* Department */}
            <div className="grid gap-2">
              <Label htmlFor="department" className="dark:text-gray-300">
                Primary Department
              </Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department" className="dark:bg-gray-700 dark:text-gray-200">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  {availableDepartments.length > 0 ? (
                    availableDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="BSFR">BSFR</SelectItem>
                      <SelectItem value="BSO">BSO</SelectItem>
                      <SelectItem value="MPD">MPD</SelectItem>
                      <SelectItem value="FHP">FHP</SelectItem>
                      <SelectItem value="COMMS">COMMS</SelectItem>
                      <SelectItem value="FWC">FWC</SelectItem>
                      <SelectItem value="CIV">CIV</SelectItem>
                      <SelectItem value="DEV">Dev</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs dark:text-gray-400">
                {availableDepartments.length > 0
                  ? "These departments are based on your roles in the Main Discord server."
                  : "Select your primary department."}
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
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing Setup...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
