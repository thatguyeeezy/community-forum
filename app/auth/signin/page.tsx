"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import Link from "next/link"

// Create a separate component that uses useSearchParams
function SignInContent() {
  const [isLoading, setIsLoading] = useState(false)
  
  // Import useSearchParams inside the component
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"
  const error = searchParams?.get("error")

  const handleDiscordSignIn = async () => {
    setIsLoading(true)
    await signIn("discord", { callbackUrl })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Sign in to your account using Discord
        </CardDescription>
        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-4">
            <div className="flex">
              <div className="text-sm text-red-700">
                {error === "OAuthAccountNotLinked" 
                  ? "There was an issue with your Discord sign-in. Please try again."
                  : "An error occurred during sign in. Please try again."}
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-sm text-muted-foreground mb-2">
          Clicking the button below will redirect you to Discord to authorize access to your basic profile information.
        </div>
        <Button 
          variant="outline" 
          onClick={handleDiscordSignIn}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.discord className="mr-2 h-4 w-4" />
          )}
          Continue with Discord
        </Button>
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
            Sign up
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-muted-foreground text-center">
          By signing in, you agree to our{" "}
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
function SignInFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Loading sign-in options...
        </CardDescription>
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
export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<SignInFallback />}>
        <SignInContent />
      </Suspense>
    </div>
  )
}