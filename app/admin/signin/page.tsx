"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import Link from "next/link"

// Create a separate component that uses useSearchParams
function AdminSignInForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  // Import useSearchParams inside the component
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Invalid email or password. Admin access only.")
        setIsLoading(false)
        return
      }

      // Redirect to admin dashboard on success
      window.location.href = callbackUrl
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
        <CardDescription>Sign in to access the admin dashboard</CardDescription>
        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-4">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </CardFooter>
      </form>
      <div className="px-8 pb-8">
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-4 hover:text-primary">
            Return to home page
          </Link>
        </div>
      </div>
    </Card>
  )
}

// Fallback component to show while loading
function AdminSignInFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
        <CardDescription>Loading sign-in form...</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="h-[200px] flex items-center justify-center">
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
export default function AdminSignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Suspense fallback={<AdminSignInFallback />}>
        <AdminSignInForm />
      </Suspense>
    </div>
  )
}
