import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminStats } from "@/components/admin-stats"
import { Users, MessageSquare, FileText } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-muted-foreground">Manage your community forum</p>
          </div>

          <AdminStats />

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent activity across the forum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New user registered</p>
                          <p className="text-xs text-muted-foreground">johndoe joined 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New thread created</p>
                          <p className="text-xs text-muted-foreground">
                            "Getting started with Next.js" in Tutorials & Resources
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New post in thread</p>
                          <p className="text-xs text-muted-foreground">
                            janedoe replied to "What's your favorite UI component library?"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users, roles, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search users..." className="max-w-sm" />
                      <Button variant="outline">Search</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">User list will be displayed here</h3>
                        <p className="text-sm text-muted-foreground">With options to edit, ban, or change roles</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage forums, threads, and posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search content..." className="max-w-sm" />
                      <Button variant="outline">Search</Button>
                    </div>
                    <div className="rounded-md border">
                      <div className="p-4">
                        <h3 className="font-medium">Content list will be displayed here</h3>
                        <p className="text-sm text-muted-foreground">With options to edit, delete, or moderate</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Forum Settings</CardTitle>
                  <CardDescription>Manage forum settings and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">General Settings</h3>
                      <Separator />
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="forum-name" className="text-right">
                            Forum Name
                          </Label>
                          <Input id="forum-name" defaultValue="Community Forum" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="forum-description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="forum-description"
                            defaultValue="A modern community forum platform"
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Registration Settings</h3>
                      <Separator />
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="allow-registration" className="text-right">
                            Allow Registration
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="allow-registration"
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="allow-registration">Enable user registration</Label>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email-verification" className="text-right">
                            Email Verification
                          </Label>
                          <div className="col-span-3 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="email-verification"
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="email-verification">Require email verification</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

