"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { syncDepartmentIfWhitelisted } from "@/app/actions/sync-department"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"

interface SyncDepartmentButtonProps {
  userId: number
}

export function SyncDepartmentButton({ userId }: SyncDepartmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const result = await syncDepartmentIfWhitelisted(userId)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sync department",
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
      size="sm"
      className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
    >
      {isLoading ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Syncing...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Department
        </>
      )}
    </Button>
  )
}
