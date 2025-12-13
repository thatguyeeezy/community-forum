"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Copy, Check } from 'lucide-react'
import { getUserErrorMessage } from "@/lib/error-codes"

// Create a separate component that uses useSearchParams
function AuthErrorContent() {
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const error = searchParams?.get("error") || "Unknown"
  const [copied, setCopied] = useState(false)
  const [errorId, setErrorId] = useState<number | null>(null)

  // Get user-friendly error message and code
  const { code, message } = getUserErrorMessage(error)

  // Log error to backend
  useEffect(() => {
    const logError = async () => {
      try {
        const response = await fetch('/api/errors/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error,
            path: window.location.pathname,
            details: `User encountered auth error page. Original error: ${error}`,
          }),
        })
        const data = await response.json()
        if (data.errorId) {
          setErrorId(data.errorId)
        }
      } catch (e) {
        console.error('Failed to log error:', e)
      }
    }
    logError()
  }, [error])

  const copyErrorCode = () => {
    const fullCode = errorId ? `${code}-${errorId}` : code
    navigator.clipboard.writeText(fullCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayCode = errorId ? `${code}-${errorId}` : code

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-2xl font-bold">Something went wrong</CardTitle>
        </div>
        <CardDescription className="text-base">{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Code Display */}
        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Error Code</p>
              <p className="font-mono text-lg font-semibold">{displayCode}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyErrorCode}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          If this problem persists, please contact support and provide the error code above.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <Button className="w-full" asChild>
          <Link href="/auth/signin">Try Again</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Fallback component to show while loading
function AuthErrorFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground animate-pulse" />
          <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
        </div>
        <CardDescription>Please wait...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[80px] flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </CardContent>
    </Card>
  )
}

// Main page component with Suspense
export default function AuthErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<AuthErrorFallback />}>
        <AuthErrorContent />
      </Suspense>
    </div>
  )
}
