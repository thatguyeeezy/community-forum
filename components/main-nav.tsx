import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, Users, Building2, ChevronDown } from "lucide-react"

// Define the departments
const departments = [
  { name: "BSFR", href: "/departments/bsfr" },
  { name: "BSO", href: "/departments/bso" },
  { name: "MPD", href: "/departments/mpd" },
  { name: "FHP", href: "/departments/fhp" },
  { name: "COMMS", href: "/departments/comms" },
  { name: "FWC", href: "/departments/fwc" },
  { name: "CIV", href: "/departments/civ" },
]

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

      {/* Departments Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1">
            <Building2 className="h-4 w-4" />
            <span>Departments</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {departments.map((dept) => (
            <DropdownMenuItem key={dept.name} asChild>
              <Link href={dept.href}>{dept.name}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" asChild>
        <Link href="/members" className="flex items-center space-x-1">
          <Users className="h-4 w-4" />
          <span>Members</span>
        </Link>
      </Button>
    </nav>
  )
}

