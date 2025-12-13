import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasAdminPermission } from '@/lib/roles'

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !hasAdminPermission(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const category = searchParams.get('category')
    const severity = searchParams.get('severity')
    const resolved = searchParams.get('resolved')
    const code = searchParams.get('code')

    // Build where clause
    const where: any = {}
    if (category) where.category = category
    if (severity) where.severity = severity
    if (resolved !== null && resolved !== undefined) {
      where.resolved = resolved === 'true'
    }
    if (code) where.code = { contains: code }

    // Fetch errors with pagination
    const [errors, total] = await Promise.all([
      prisma.errorLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.errorLog.count({ where }),
    ])

    // Get summary stats
    const stats = await prisma.errorLog.groupBy({
      by: ['severity'],
      where: { resolved: false },
      _count: true,
    })

    return NextResponse.json({
      errors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        critical: stats.find(s => s.severity === 'critical')?._count || 0,
        high: stats.find(s => s.severity === 'high')?._count || 0,
        medium: stats.find(s => s.severity === 'medium')?._count || 0,
        low: stats.find(s => s.severity === 'low')?._count || 0,
        total: stats.reduce((acc, s) => acc + s._count, 0),
      },
    })
  } catch (error) {
    console.error('Error fetching error logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Mark error as resolved
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.role || !hasAdminPermission(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, resolved } = body

    const errorLog = await prisma.errorLog.update({
      where: { id },
      data: {
        resolved,
        resolvedAt: resolved ? new Date() : null,
        resolvedBy: resolved ? parseInt(session.user.id as string) : null,
      },
    })

    return NextResponse.json({ success: true, errorLog })
  } catch (error) {
    console.error('Error updating error log:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

