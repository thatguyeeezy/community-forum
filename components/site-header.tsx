"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, LogOut, Settings, Shield } from "lucide-react"

export function SiteHeader() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isLoading = status === "loading"

  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SENIOR_ADMIN" || session?.user?.role === "HEAD_ADMIN"
  const isModerator = session?.user?.role === "MODERATOR"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold text-gray-100 sm:inline-block">Florida Coast RP</span>
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium">
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

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-100 hover:bg-gray-800">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <ModeToggle />

          {!isLoading &&
            (session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback className="bg-gray-700 text-gray-100">
                        {session.user?.name?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
                  <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                    <Link href={`/profile/${session.user.id}`}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {(isAdmin || isModerator) && (
                    <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="hover:bg-gray-700 focus:bg-gray-700">
                    <Link href="/auth/signout">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            ))}
        </div>
      </div>
    </header>
  )
}
