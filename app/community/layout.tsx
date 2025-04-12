import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community - Florida Coast RP",
  description: "Browse discussions, resources, and departments in our community",
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="flex min-h-screen flex-col">{children}</div>
}
