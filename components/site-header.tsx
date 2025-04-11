"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Moon, Search, User } from "lucide-react"
import { useSession } from "next-auth/react"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e2330] bg-[#1e2330]">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-blue-600 rounded-sm"></div>
            <span className="inline-block font-bold">Florida Coast RP</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn("transition-colors hover:text-white", pathname === "/" ? "text-white" : "text-gray-300")}
            >
              Home
            </Link>
            <Link
              href="/community"
              className={cn(
                "transition-colors hover:text-white",
                pathname === "/community" || pathname.startsWith("/community/") ? "text-white" : "text-gray-300",
              )}
            >
              Forums
            </Link>
            <Link
              href="/members"
              className={cn(
                "transition-colors hover:text-white",
                pathname === "/members" ? "text-white" : "text-gray-300",
              )}
            >
              Members
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Moon className="h-5 w-5" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {session ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
