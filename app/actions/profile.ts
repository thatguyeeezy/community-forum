"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to update your profile" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const rank = formData.get("rank") as string
  const department = formData.get("department") as string

  if (!name) {
    return { error: "Name is required" }
  }

  try {
    const userId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    // Prepare update data
    const updateData: any = {
      name,
      bio: bio || "",
      rank: rank || null,
      department: department ? (department as any) : "N_A",
    }

    // Explicitly ensure discordId is NOT included in updateData
    // This prevents any attempts to change it

    console.log("Updating profile for user:", userId, updateData)

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/members/${userId}`)
    return {
      success: true,
      message: "Profile updated successfully",
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}

// Remove the resetProfileImage function since we're not allowing custom images
