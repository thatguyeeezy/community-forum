"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, LayoutDashboard, Users } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/admin" && pathname === "/admin") {
      return true
    }
    return pathname.startsWith(path) && path !== "/admin"
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Staff Panel</h2>
        <ModeToggle />
      </div>

      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={18} />
          <span>Back to Site</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin") && !isActive("/admin/users")
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              } transition-colors`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/users") ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-700 hover:text-white"
              } transition-colors`}
            >
              <Users size={18} />
              <span>Users</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">Florida Coast RP Staff</div>
      </div>
    </div>
  )
}
