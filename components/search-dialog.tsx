"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search for topics, posts, or users</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input id="search" placeholder="Type your search query here..." className="col-span-3" autoFocus />
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent Searches</h3>
            <ul className="space-y-1 text-sm">
              <li className="rounded-md p-2 hover:bg-muted">How to use Next.js with TypeScript</li>
              <li className="rounded-md p-2 hover:bg-muted">Best practices for React hooks</li>
              <li className="rounded-md p-2 hover:bg-muted">Tailwind CSS tips and tricks</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

