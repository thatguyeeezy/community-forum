"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <span className="hidden font-bold text-gray-100 sm:inline-block">Florida Coast RP</span>
      </Link>
      <nav className="flex items-center space-x-4 text-sm font-medium text-gray-300">
        <Link
          href="/"
          className={cn("transition-colors hover:text-gray-100", pathname === "/" ? "text-gray-100" : "text-gray-300")}
        >
          Home
        </Link>
        <Link
          href="/community"
          className={cn(
            "transition-colors hover:text-gray-100",
            pathname?.startsWith("/community") ? "text-gray-100" : "text-gray-300",
          )}
        >
          Forums
        </Link>
        <Link
          href="/members"
          className={cn(
            "transition-colors hover:text-gray-100",
            pathname?.startsWith("/members") ? "text-gray-100" : "text-gray-300",
          )}
        >
          Members
        </Link>
      </nav>
    </div>
  )
}
