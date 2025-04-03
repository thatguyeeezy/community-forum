import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Building2 } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/" className="flex items-center space-x-2">
        <Building2 className="h-6 w-6" />
        <span className="font-bold hidden md:inline-block">Florida Coast RP</span>
      </Link>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/" className="flex items-center space-x-1">
          <Home className="h-4 w-4" />
          <span>Home</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/community" className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>Community</span>
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/members" className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>Members</span>
        </Link>
      </Button>
    </nav>
  )
}

