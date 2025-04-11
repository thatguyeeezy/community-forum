import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Departments - Florida Coast RP",
  description: "Explore our roleplay departments and divisions",
}

export default function DepartmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}
