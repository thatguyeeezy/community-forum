"use client"

import { Button } from "@/components/ui/button"
import { syncCurrentUserRole } from "@/app/actions/discord"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export function SyncRoleButton() {
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = async () => {
    try {
      setIsSyncing(true)
      const result = await syncCurrentUserRole()

      if (result.success) {
        toast({
          title: "Role Synced",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Sync Failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync role",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="mt-4">
      {isSyncing ? "Syncing..." : "Sync Discord Role"}
    </Button>
  )
}
