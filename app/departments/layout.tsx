import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Departments - Florida Coast RP",
  description: "Explore our departments and their operations",
}

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}

