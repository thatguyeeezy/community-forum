"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

// Create a separate component for the sign-up content
function SignUpContent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDiscordSignUp = async () => {
    setIsLoading(true)
    // Use the callbackUrl to redirect to the home page after successful sign-up
    await signIn("discord", { callbackUrl: "/" })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Sign up for an account using your Discord account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground mb-2">
          Clicking the button below will redirect you to Discord to authorize access to your basic profile information.
          After authorization, you'll be redirected back and automatically signed in.
        </div>
        <Button variant="outline" onClick={handleDiscordSignUp} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.discord className="mr-2 h-4 w-4" />
          )}
          Continue with Discord
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </div>
      </CardFooter>
    </Card>
  )
}

// Fallback component to show while loading
function SignUpFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>Loading sign-up options...</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="h-[100px] flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-4 hover:text-primary">
            Return to home page
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

// Main page component with Suspense
export default function SignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<SignUpFallback />}>
        <SignUpContent />
      </Suspense>
    </div>
  )
}

