"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { toggleThreadPin, toggleThreadLock, deleteThread } from "@/app/actions/admin"
import { MoreHorizontal, Pin, Lock, Trash } from "lucide-react"
import { useSession } from "next-auth/react"
import { hasStaffPermission } from "@/lib/roles"

interface ThreadActionsProps {
  threadId: string
  isPinned: boolean
  isLocked: boolean
}

export function ThreadActions({ threadId, isPinned, isLocked }: ThreadActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()

  // Check if user has staff permissions
  const isStaff = session?.user?.role ? hasStaffPermission(session.user.role as string) : false

  // If user doesn't have staff permissions, don't render the component
  if (!isStaff) return null

  const handleTogglePin = async () => {
    setIsLoading(true)
    try {
      const result = await toggleThreadPin(threadId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: result.message,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleLock = async () => {
    setIsLoading(true)
    try {
      const result = await toggleThreadLock(threadId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: result.message,
        })
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      const result = await deleteThread(threadId)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Thread deleted successfully",
        })
        router.push("/forums")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isLoading}>
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Thread actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleTogglePin}>
          <Pin className="mr-2 h-4 w-4" />
          {isPinned ? "Unpin Thread" : "Pin Thread"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleLock}>
          <Lock className="mr-2 h-4 w-4" />
          {isLocked ? "Unlock Thread" : "Lock Thread"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Thread
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
