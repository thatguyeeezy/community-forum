"use client"

import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, LogOut, Settings, User, Shield } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { data: session, status } = useSession()

  // Early return if no session to avoid rendering issues
  if (status !== "authenticated" || !session || !session.user) {
    return null
  }

  // Safely extract user data
  const userName = typeof session.user.name === "string" ? session.user.name : "User"
  const userEmail = typeof session.user.email === "string" ? session.user.email : ""
  const userImage = typeof session.user.image === "string" ? session.user.image : "/placeholder.svg?height=32&width=32"
  const userInitials = userName.substring(0, 2).toUpperCase()
  const userRole = typeof session.user.role === "string" ? session.user.role : "MEMBER"
  const userId = session.user.id // Get the user ID from the session

  const isAdmin = userRole === "ADMIN"
  const isModerator = userRole === "MODERATOR"

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="icon">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/profile/${userId}`} className="cursor-pointer flex w-full">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            {(isAdmin || isModerator) && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer flex w-full">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Staff Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
