import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function canEditDepartment(departmentId: string): Promise<boolean> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return false
  }

  // Get user information
  const userDepartment = session.user.department as string
  const userRole = session.user.role as string

  // Check if user is in Dev department and is a Junior Administrator
  if (userDepartment === "Dev" && userRole === "JUNIOR_ADMIN") {
    return true
  }

  // Check if user has Leadership role
  if (userRole === "HEAD_ADMIN" || userRole === "SENIOR_ADMIN" || userRole === "ADMIN") {
    return true
  }

  // Check if user is an administrator of their own department
  if (userDepartment === departmentId && userRole === "ADMIN") {
    return true
  }

  return false
}

