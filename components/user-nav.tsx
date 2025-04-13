"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield, UserCircle } from "lucide-react"

export function UserNav() {
  const { data: session } = useSession()

  // Check if user has admin or staff role
  const isAdmin =
    session?.user?.role && ["HEAD_ADMIN", "SENIOR_ADMIN", "ADMIN", "SPECIAL_ADVISOR"].includes(session.user.role)
  const isStaff =
    session?.user?.role && ["STAFF", "SENIOR_STAFF", "STAFF_IN_TRAINING", "JUNIOR_ADMIN"].includes(session.user.role)
  const hasStaffAccess = isAdmin || isStaff

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:bg-gray-800 bg-white" align="end" forceMount>
        {session ? (
          <>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium dark:text-gray-100 text-gray-900">{session.user.name}</p>
                <p className="text-sm dark:text-gray-400 text-gray-500">{session.user.email}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="dark:bg-gray-700 bg-gray-200" />
            <DropdownMenuItem asChild>
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
              >
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            {hasStaffAccess && (
              <DropdownMenuItem asChild>
                <Link
                  href="/admin"
                  className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Staff Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link
                href="/account"
                className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="dark:bg-gray-700 bg-gray-200" />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link
                href="/auth/signin"
                className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Sign in</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/auth/signup"
                className="flex items-center cursor-pointer dark:text-gray-300 text-gray-600 dark:hover:text-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 hover:bg-gray-100"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Sign up</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
