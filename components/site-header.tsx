"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { SearchDialog } from "@/components/search-dialog"

export function SiteHeader() {
  const { status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <SearchDialog />
            {isAuthenticated ? (
              <UserNav />
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="text-gray-300 hover:text-gray-100">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
