"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { put } from "@vercel/blob" // If using Vercel Blob

export async function updateProfile(formData: FormData) {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to update your profile" }
  }

  const name = formData.get("name") as string
  const bio = formData.get("bio") as string
  const rank = formData.get("rank") as string
  const department = formData.get("department") as string
  const imageFile = formData.get("profileImage") as File | null

  // Explicitly remove any discordId from formData to ensure it can't be changed
  // Even if someone tries to send it in the request

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

    // Handle image upload if provided
    if (imageFile && imageFile.size > 0) {
      // Upload to Vercel Blob
      const blob = await put(`profile-${userId}-${Date.now()}`, imageFile, {
        access: "public",
      })

      // Store the URL in the database
      updateData.image = blob.url
      updateData.useCustomImage = true // Flag to indicate custom image
    }

    console.log("Updating profile for user:", userId, {
      ...updateData,
      imageUpdated: imageFile ? true : false,
    })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    })

    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/members/${userId}`)
    return {
      success: true,
      message: "Profile updated successfully",
      imageUrl: updatedUser.image,
    }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "Failed to update profile" }
  }
}

// Function to reset profile image to Discord avatar
export async function resetProfileImage() {
  const session = await auth()

  if (!session?.user) {
    return { error: "You must be logged in to reset your profile image" }
  }

  try {
    const userId = typeof session.user.id === "string" ? Number.parseInt(session.user.id, 10) : session.user.id

    // Get the user to check if they have a Discord ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true, discordAvatar: true },
    })

    if (!user?.discordId) {
      return { error: "No Discord account linked to your profile" }
    }

    // Update the user to use Discord avatar instead of custom image
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        image: null, // Clear custom image URL
        useCustomImage: false, // Flag to use Discord avatar
      },
    })

    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/members/${userId}`)
    return {
      success: true,
      message: "Profile image reset to Discord avatar",
    }
  } catch (error) {
    console.error("Profile image reset error:", error)
    return { error: "Failed to reset profile image" }
  }
}
