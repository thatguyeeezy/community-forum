"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Shield, Users, Anchor, Flame, Fish } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

// Department data with appropriate icons
const departments = [
  {
    id: "bcfr",
    name: "BCFR – Broward County Fire Rescue",
    icon: Flame,
    color: "text-red-400",
  },
  {
    id: "bso",
    name: "BSO – Broward Sheriff's Office",
    icon: Shield,
    color: "text-amber-400",
  },
  {
    id: "civ",
    name: "CIV – Civilian",
    icon: Users,
    color: "text-blue-400",
  },
  {
    id: "fhp",
    name: "FHP – Florida Highway Patrol",
    icon: Shield,
    color: "text-green-400",
  },
  {
    id: "fwc",
    name: "FWC – Florida Fish and Wildlife",
    icon: Fish,
    color: "text-teal-400",
  },
  {
    id: "mpd",
    name: "MPD – Miami Police Department",
    icon: Shield,
    color: "text-purple-400",
  },
  {
    id: "nscg",
    name: "NSCG – Naval Sea Coast Guard",
    icon: Anchor,
    color: "text-cyan-400",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const [hoveredDept, setHoveredDept] = useState(false)

  return (
    <header className="bg-background border-b border-border">
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
            <span className="font-semibold text-xl text-foreground">Florida Coast RP</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border",
                    pathname === "/" ? "text-foreground border-primary" : "border-transparent",
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border",
                    pathname === "/community" || pathname.startsWith("/community/")
                      ? "text-foreground border-primary"
                      : "border-transparent",
                  )}
                >
                  Forums
                </Link>
              </li>
              <li
                className="relative"
                onMouseEnter={() => setHoveredDept(true)}
                onMouseLeave={() => setHoveredDept(false)}
              >
                {/* Non-clickable span instead of Link */}
                <span
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border cursor-default",
                    pathname.startsWith("/departments/") ? "text-foreground border-primary" : "border-transparent",
                  )}
                >
                  Departments
                </span>
                {/* Dropdown menu */}
                {hoveredDept && (
                  <div className="absolute left-0 mt-1 w-64 bg-background border border-border rounded shadow-lg z-50">
                    <div className="py-1">
                      {departments.map((dept) => {
                        const DeptIcon = dept.icon
                        return (
                          <Link
                            key={dept.id}
                            href={`/departments/${dept.id}`}
                            className="flex items-center px-4 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            <DeptIcon className={`h-4 w-4 mr-2 ${dept.color}`} />
                            <span>{dept.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/members"
                  className={cn(
                    "inline-block px-2 py-1 font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border",
                    pathname === "/members" ? "text-foreground border-primary" : "border-transparent",
                  )}
                >
                  Members
                </Link>
              </li>
              {!isLoading && !session && (
                <li>
                  <Link
                    href="/auth/signin"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded"
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

            <Link href="/search" className="p-2 text-muted-foreground hover:text-foreground" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </Link>
            {!isLoading &&
              (session ? (
                <Link
                  href={`/profile/${session.user?.id || ""}`}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">
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
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground"
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
