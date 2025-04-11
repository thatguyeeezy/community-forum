"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const { setTheme, theme } = useTheme()

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative mr-3">
              <img
                src="/placeholder.svg?height=40&width=40"
                alt="Florida Coast RP Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
            <span className="font-semibold text-xl">Florida Coast RP</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600",
                    pathname === "/" ? "text-gray-100 border-blue-500" : "border-transparent",
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600",
                    pathname === "/community" || pathname.startsWith("/community/")
                      ? "text-gray-100 border-blue-500"
                      : "border-transparent",
                  )}
                >
                  Forums
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-gray-300 hover:text-gray-100 border-b-2 border-transparent hover:border-gray-600",
                    pathname === "/members" ? "text-gray-100 border-blue-500" : "border-transparent",
                  )}
                >
                  Members
                </Link>
              </li>
              {!isLoading && !session && (
                <li>
                  <Link
                    href="/auth/signin"
                    className="inline-block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
                  >
                    Join
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-gray-300 hover:text-gray-100"
              aria-label="Toggle dark/light mode"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
            <Link href="/search" className="p-2 text-gray-300 hover:text-gray-100" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
            {!isLoading &&
              (session ? (
                <Link
                  href="/profile"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-300">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  )}
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-gray-300"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </header>
  )
}
