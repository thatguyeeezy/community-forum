"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

const departments = [
  { name: "Municipal Police", href: "/departments/municipal-police" },
  { name: "State Police", href: "/departments/state-police" },
  { name: "Fire & EMS", href: "/departments/fire-ems" },
  { name: "Civilian Operations", href: "/departments/civilian-operations" },
  { name: "Judicial Services", href: "/departments/judicial-services" },
  { name: "State 911", href: "/departments/state-911" },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
            <span className="font-bold">Community Portal</span>
          </Link>
        </div>
        <div className="flex flex-col space-y-3 mt-6">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={cn(
              "px-7 py-2 text-base font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Home
          </Link>

          <div className="px-7 py-2">
            <h4 className="mb-1 text-base font-medium">Departments</h4>
            <div className="flex flex-col space-y-2 pl-2">
              {departments.map((department) => (
                <Link
                  key={department.href}
                  href={department.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm transition-colors hover:text-primary",
                    pathname === department.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {department.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/members"
            onClick={() => setOpen(false)}
            className={cn(
              "px-7 py-2 text-base font-medium transition-colors hover:text-primary",
              pathname === "/members" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Members
          </Link>

          <Link
            href="/resources"
            onClick={() => setOpen(false)}
            className={cn(
              "px-7 py-2 text-base font-medium transition-colors hover:text-primary",
              pathname === "/resources" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Resources
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

