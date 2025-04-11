"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useState, useRef } from "react"
import { Shield, Users, Anchor, Flame, Fish } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

const departments = [
  {
    id: "bcfr",
    name: "Fire Rescue",
    color: "text-red-400",
  },
  {
    id: "bso",
    name: "Sheriff's Office",
    color: "text-amber-400",
  },
  {
    id: "civ",
    name: "Civilian",
    color: "text-blue-400",
  },
  {
    id: "fhp",
    name: "Highway Patrol",
    color: "text-green-400",
  },
  {
    id: "fwc",
    name: "Fish and Wildlife",
    color: "text-teal-400",
  },
  {
    id: "mpd",
    name: "Police Department",
    color: "text-purple-400",
  },
  {
    id: "rnr",
    name: "R&R Team",
    color: "text-cyan-400",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const [isDeptsOpen, setIsDeptsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsDeptsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDeptsOpen(false)
    }, 150)
  }

  return (
    <header className="dark:bg-gray-800 bg-white border-b dark:border-gray-700 border-gray-200">
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
            <span className="font-semibold text-xl dark:text-gray-100 text-gray-900">Florida Coast RP</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "inline-block px-2 py-1 font-medium dark:text-gray-300 text-gray-600 hover:dark:text-gray-100 hover:text-gray-900 border-b-2 border-transparent hover:dark:border-gray-600 hover:border-gray-300",
                    pathname === "/" ? "dark:text-gray-100 text-gray-900 border-blue-500" : "border-transparent",
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className={cn(
                    "inline-block px-2 py-1 font-medium dark:text-gray-300 text-gray-600 hover:dark:text-gray-100 hover:text-gray-900 border-b-2 border-transparent hover:dark:border-gray-600 hover:border-gray-300",
                    pathname === "/community" || pathname.startsWith("/community/")
                      ? "dark:text-gray-100 text-gray-900 border-blue-500"
                      : "border-transparent",
                  )}
                >
                  Forums
                </Link>
              </li>
              <li
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setIsDeptsOpen(!isDeptsOpen)}
                  className={cn(
                    "inline-block px-2 py-1 font-medium dark:text-gray-300 text-gray-600 hover:dark:text-gray-100 hover:text-gray-900 border-b-2 border-transparent hover:dark:border-gray-600 hover:border-gray-300",
                    pathname.startsWith("/departments/")
                      ? "dark:text-gray-100 text-gray-900 border-blue-500"
                      : "border-transparent",
                  )}
                >
                  Departments
                </button>
                {/* Dropdown menu */}
                {isDeptsOpen && (
                  <div 
                    className="absolute left-0 top-full pt-1 w-64 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 rounded shadow-lg">
                      <div className="py-1">
                        {departments.map((dept) => (
                          <Link
                            key={dept.id}
                            href={`/departments/${dept.id}`}
                            className="flex items-center px-4 py-2 dark:text-gray-300 text-gray-600 hover:dark:bg-gray-700 hover:bg-gray-100 hover:dark:text-gray-100 hover:text-gray-900"
                            onClick={() => setIsDeptsOpen(false)}
                          >
                            <span>{dept.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/members"
                  className={cn(
                    "inline-block px-2 py-1 font-medium dark:text-gray-300 text-gray-600 hover:dark:text-gray-100 hover:text-gray-900 border-b-2 border-transparent hover:dark:border-gray-600 hover:border-gray-300",
                    pathname === "/members" ? "dark:text-gray-100 text-gray-900 border-blue-500" : "border-transparent",
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
            {/* Use the ModeToggle component */}
            <ModeToggle />

            <Link
              href="/search"
              className="p-2 dark:text-gray-300 text-gray-600 hover:dark:text-gray-100 hover:text-gray-900"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
            {!isLoading &&
              (session ? (
                <Link
                  href={`/profile/${session.user?.id || ""}`}
                  className="w-10 h-10 dark:bg-gray-700 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="dark:text-gray-300 text-gray-600">
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
                  className="w-10 h-10 dark:bg-gray-700 bg-gray-200 rounded-full flex items-center justify-center dark:text-gray-300 text-gray-600"
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
