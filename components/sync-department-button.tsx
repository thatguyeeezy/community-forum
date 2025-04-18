"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { syncDepartmentIfWhitelisted } from "@/app/actions/sync-department"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"
import { SelectDepartmentDialog } from "@/components/select-department-dialog"

interface SyncDepartmentButtonProps {
  userId: number
}

export function SyncDepartmentButton({ userId }: SyncDepartmentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false)
  const [departments, setDepartments] = useState<string[]>([])
  const { toast } = useToast()

  const handleSync = async () => {
    setIsLoading(true)
    try {
      const result = await syncDepartmentIfWhitelisted(userId)

      if (result.success) {
        if (result.multipleDepartments && result.departments && result.departments.length > 1) {
          // Show the department selection dialog if multiple departments were found
          setDepartments(result.departments)
          setShowDepartmentDialog(true)
        } else {
          toast({
            title: "Success",
            description: result.message,
          })
        }
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
    <>
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

      <SelectDepartmentDialog
        open={showDepartmentDialog}
        onOpenChange={setShowDepartmentDialog}
        userId={userId}
        departments={departments}
        onSuccess={() => {
          // Refresh the page to show the updated department
          window.location.reload()
        }}
      />
    </>
  )
}
