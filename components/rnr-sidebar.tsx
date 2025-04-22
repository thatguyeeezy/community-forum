"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ClipboardList, FileText, Settings } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useSession } from "next-auth/react"

export function RnRSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin =
    session?.user?.role === "RNR_ADMINISTRATION" ||
    ["WEBMASTER", "HEAD_ADMIN", "SENIOR_ADMIN", "SPECIAL_ADVISOR"].includes(session?.user?.role as string)

  const isActive = (path: string) => {
    if (path === "/rnr" && pathname === "/rnr") {
      return true
    }
    return pathname.startsWith(path) && path !== "/rnr"
  }

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">R&R Panel</h2>
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
              href="/rnr"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                isActive("/rnr") && !pathname.includes("/applications") && !pathname.includes("/templates")
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              } transition-colors`}
            >
              <ClipboardList size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/rnr/applications"
              className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                pathname.includes("/applications")
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              } transition-colors`}
            >
              <FileText size={18} />
              <span>Applications</span>
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                href="/rnr/templates"
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                  pathname.includes("/templates")
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                } transition-colors`}
              >
                <Settings size={18} />
                <span>Templates</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">Florida Coast RP R&R</div>
      </div>
    </div>
  )
}
