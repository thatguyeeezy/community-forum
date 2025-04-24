import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasRnRPermission } from "@/lib/roles"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(params.id, 10)

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    // Check if the user is requesting their own applications or has RNR permissions
    const isOwnProfile = session.user.id === userId.toString()
    const hasRnRAccess = hasRnRPermission(session.user.role as string)

    if (!isOwnProfile && !hasRnRAccess) {
      return NextResponse.json({ error: "You don't have permission to view these applications" }, { status: 403 })
    }

    // Fetch the user's applications
    const applications = await prisma.application.findMany({
      where: {
        userId,
      },
      include: {
        template: {
          select: {
            name: true,
            departmentId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching user applications:", error)
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 })
  }
}
