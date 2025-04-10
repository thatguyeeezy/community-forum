"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Search } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-800">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-blue-600 rounded-sm"></div>
            <span className="inline-block font-bold">Florida Coast RP</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-gray-100",
                pathname === "/" ? "text-gray-100" : "text-gray-300",
              )}
            >
              Home
            </Link>
            <Link
              href="/community"
              className={cn(
                "transition-colors hover:text-gray-100",
                pathname === "/community" || pathname.startsWith("/community/") ? "text-gray-100" : "text-gray-300",
              )}
            >
              Forums
            </Link>
            <Link
              href="/members"
              className={cn(
                "transition-colors hover:text-gray-100",
                pathname === "/members" ? "text-gray-100" : "text-gray-300",
              )}
            >
              Members
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex-1 sm:grow-0">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-100">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
