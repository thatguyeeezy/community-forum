import type React from "react"
import { SiteHeader } from "@/components/site-header"

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </>
  )
}

