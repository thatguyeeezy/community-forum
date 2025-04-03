// app/api/thread/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const categoryId = searchParams.get("categoryId")

  try {
    const threads = await prisma.thread.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        author: true,
        category: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Error fetching threads:", error)
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 })
  }
}

