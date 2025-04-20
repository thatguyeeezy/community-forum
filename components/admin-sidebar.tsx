"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, LayoutDashboard, Users } from "lucide-react"

import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname.startsWith(path) && path !== "/admin"
  }

  return (
    <div className="w-64 bg-card border-r h-screen">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">Staff Panel</h2>
      </div>
      <div className="p-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Site
        </Link>
        <nav className="space-y-1">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive("/admin") ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive("/admin/users") ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        </nav>
      </div>
    </div>
  )
}
