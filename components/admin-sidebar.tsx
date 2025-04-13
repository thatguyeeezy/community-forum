"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboardIcon as Dashboard, Users, FileText, Settings, AlertTriangle } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: Dashboard,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/admin/content",
      label: "Content",
      icon: FileText,
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
    },
    {
      href: "/admin/reports",
      label: "Reports",
      icon: AlertTriangle,
    },
    {
      href: "/admin/analytics",
      label: "Analytics",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-3 py-2 text-sm font-medium hover:bg-secondary hover:text-secondary-foreground",
                pathname === route.href ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
