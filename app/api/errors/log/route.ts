import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ERROR_CODES, getErrorCodeFromNextAuth } from '@/lib/error-codes'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      error,        // Can be error code or NextAuth error string
      details,      // Additional context
      userId,
      discordId,
      path 
    } = body

    // Get the error code (convert NextAuth errors if needed)
    const errorCode = ERROR_CODES[error] ? error : getErrorCodeFromNextAuth(error)
    const errorInfo = ERROR_CODES[errorCode] || ERROR_CODES['SYS_001']

    // Get IP and user agent from headers
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || undefined

    // Log to database
    const errorLog = await prisma.errorLog.create({
      data: {
        code: errorInfo.code,
        category: errorInfo.category,
        severity: errorInfo.severity,
        userMessage: errorInfo.userMessage,
        adminMessage: errorInfo.adminMessage,
        details: details || null,
        userId: userId ? parseInt(userId) : null,
        discordId: discordId || null,
        ipAddress,
        userAgent,
        path: path || null,
      },
    })

    // Also log to console for server logs
    console.error(`[ERROR ${errorInfo.code}] ${errorInfo.adminMessage}`, {
      id: errorLog.id,
      details,
      userId,
      discordId,
      path,
    })

    return NextResponse.json({ 
      success: true, 
      errorId: errorLog.id,
      code: errorInfo.code,
    })
  } catch (err) {
    console.error('Failed to log error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

