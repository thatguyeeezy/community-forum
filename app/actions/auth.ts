'use server'

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string

  if (!name || !email || !password) {
    return { error: "All fields are required" }
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" }
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
      },
    })

    revalidatePath("/auth/signin")
    return { success: true, message: "Registration successful. You can now sign in." }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}