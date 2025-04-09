"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Search, Eye, Pin, Lock, Trash, Edit } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { toggleThreadPin, toggleThreadLock, deleteThread } from "@/app/actions/admin"

interface ContentTableProps {
  type: "threads" | "posts" | "categories"
  data: any[]
}

export function ContentTable({ type, data }: ContentTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase()

    if (type === "threads") {
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.author.name?.toLowerCase().includes(searchLower) ||
        item.category.name.toLowerCase().includes(searchLower)
      )
    }

    if (type === "posts") {
      return (
        item.content?.toLowerCase().includes(searchLower) ||
        item.author.name?.toLowerCase().includes(searchLower) ||
        item.thread.title.toLowerCase().includes(searchLower)
      )
    }

    if (type === "categories") {
      return item.name.toLowerCase().includes(searchLower) || item.description?.toLowerCase().includes(searchLower)
    }

    return false
  })

  // Handle pin thread
  const handleTogglePin = async (threadId: string) => {
    setIsLoading(threadId)
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
        description: "Failed to toggle pin status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Handle lock thread
  const handleToggleLock = async (threadId: string) => {
    setIsLoading(threadId)
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
        description: "Failed to toggle lock status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Handle delete thread
  const handleDeleteThread = async (threadId: string) => {
    if (!confirm("Are you sure you want to delete this thread? This action cannot be undone.")) {
      return
    }

    setIsLoading(threadId)
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
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete thread",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  // Render threads table
  if (type === "threads") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Replies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((thread) => (
                  <TableRow key={thread.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{thread.title}</TableCell>
                    <TableCell>{thread.author.name || "Anonymous"}</TableCell>
                    <TableCell>{thread.category.name}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell>{thread._count.posts}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {thread.pinned && <Badge variant="outline">Pinned</Badge>}
                        {thread.locked && <Badge variant="outline">Locked</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={isLoading === thread.id}>
                            {isLoading === thread.id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/community/thread/${thread.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Thread
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleTogglePin(thread.id)}>
                            <Pin className="mr-2 h-4 w-4" />
                            {thread.pinned ? "Unpin Thread" : "Pin Thread"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleLock(thread.id)}>
                            <Lock className="mr-2 h-4 w-4" />
                            {thread.locked ? "Unlock Thread" : "Lock Thread"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteThread(thread.id)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Thread
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No threads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Render posts table
  if (type === "posts") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Thread</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{post.content}</TableCell>
                    <TableCell>{post.author.name || "Anonymous"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{post.thread.title}</TableCell>
                    <TableCell>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/community/thread/${post.thread.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View in Thread
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Post
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No posts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // Render categories table
  if (type === "categories") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Threads</TableHead>
                <TableHead>Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
                    <TableCell>{category._count.threads}</TableCell>
                    <TableCell>{category.order}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/community/${category.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Category
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Category
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return null
}
