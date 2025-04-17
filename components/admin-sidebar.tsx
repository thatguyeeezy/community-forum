"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, MessageSquare, FileText, Settings, Shield, Home, ChevronLeft } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
      </div>

      <div className="p-4">
        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
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
                isActive("/admin") && !isActive("/admin/users") && !isActive("/admin/forums")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/users"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/users")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <Users size={18} />
              <span>Users</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/forums"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/forums")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <MessageSquare size={18} />
              <span>Forums</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/content"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/content")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <FileText size={18} />
              <span>Content</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/roles"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/roles")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <Shield size={18} />
              <span>Roles</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/admin/settings")
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              } transition-colors`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500">Florida Coast RP Admin</div>
      </div>
    </div>
  )
}
