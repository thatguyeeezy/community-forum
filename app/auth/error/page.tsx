"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from 'lucide-react'

// Create a separate component that uses useSearchParams
function AuthErrorContent() {
  // Import useSearchParams inside the component
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")

  let errorMessage = "An error occurred during authentication."
  let errorDescription = "Please try again or contact support if the problem persists."

  // Handle specific error types
  if (error === "OAuthCallback") {
    errorMessage = "Discord authentication error"
    errorDescription = "There was a problem with the Discord authentication. Please try again."
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "Discord account not linked"
    errorDescription = "This Discord account is not linked to any existing account. Please try signing up instead."
  } else if (error === "OAuthSignin") {
    errorMessage = "Discord sign in error"
    errorDescription = "There was a problem starting the Discord sign in flow. Please try again."
  } else if (error === "Callback") {
    errorMessage = "Authentication callback error"
    errorDescription = "There was a problem with the authentication callback. Please try again."
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied"
    errorDescription = "You do not have permission to access this resource. Admin access is required."
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle className="text-2xl font-bold">{errorMessage}</CardTitle>
        </div>
        <CardDescription>{errorDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You can try signing in again or return to the home page.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
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
        <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
        <CardDescription>Loading error details...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Please wait while we load the error details.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </CardFooter>
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