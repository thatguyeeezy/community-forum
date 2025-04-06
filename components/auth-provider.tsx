"use client"

import { SessionProvider } from "@/components/session-provider"
import type { ReactNode } from "react"

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}