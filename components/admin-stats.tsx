import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageSquare, FileText, Activity } from "lucide-react"

export function AdminStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Users</span>
            <span className="text-2xl font-bold">2,543</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Threads</span>
            <span className="text-2xl font-bold">1,259</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Total Posts</span>
            <span className="text-2xl font-bold">15,832</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex flex-row items-center justify-between p-6">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">Active Today</span>
            <span className="text-2xl font-bold">243</span>
          </div>
          <div className="rounded-full bg-primary/10 p-3">
            <Activity className="h-6 w-6 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

