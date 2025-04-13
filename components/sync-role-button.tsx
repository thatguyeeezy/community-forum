"use client"

import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { useState } from "react"
import { syncCurrentUserRole } from "@/app/actions/discord"
import { useToast } from "@/hooks/use-toast"

export function SyncRoleButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    try {
      setIsLoading(true)
      const result = await syncCurrentUserRole()

      if (result.success) {
        toast({
          title: "Role synced successfully",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Failed to sync role",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while syncing your role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={isLoading}
      variant="outline"
      className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Discord Role
        </>
      )}
    </Button>
  )
}
