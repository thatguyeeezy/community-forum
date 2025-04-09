import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)

  // Check if user is authorized to access admin panel
  if (!session?.user || !["ADMIN", "SENIOR_ADMIN", "HEAD_ADMIN"].includes(session.user.role as string)) {
    redirect("/auth/signin?callbackUrl=/admin/settings")
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure forum settings</p>
          </div>

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Basic forum configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="forum-name" className="text-right">
                          Forum Name
                        </Label>
                        <Input id="forum-name" defaultValue="Florida Coast RP" className="col-span-3" />
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact-email" className="text-right">
                          Contact Email
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          defaultValue="admin@example.com"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="registration">
              <Card>
                <CardHeader>
                  <CardTitle>Registration Settings</CardTitle>
                  <CardDescription>Configure user registration options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-registration">Allow Registration</Label>
                          <p className="text-sm text-muted-foreground">Enable or disable new user registration</p>
                        </div>
                        <Switch id="allow-registration" defaultChecked />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-verification">Email Verification</Label>
                          <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                        </div>
                        <Switch id="email-verification" defaultChecked />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="discord-required">Require Discord</Label>
                          <p className="text-sm text-muted-foreground">
                            Require Discord authentication for registration
                          </p>
                        </div>
                        <Switch id="discord-required" defaultChecked />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the look and feel of your forum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="primary-color" className="text-right">
                          Primary Color
                        </Label>
                        <div className="col-span-3 flex items-center gap-2">
                          <Input id="primary-color" type="color" defaultValue="#3b82f6" className="w-16 h-10" />
                          <Input defaultValue="#3b82f6" className="w-32" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="logo-upload" className="text-right">
                          Logo
                        </Label>
                        <div className="col-span-3">
                          <Input id="logo-upload" type="file" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="favicon-upload" className="text-right">
                          Favicon
                        </Label>
                        <div className="col-span-3">
                          <Input id="favicon-upload" type="file" />
                        </div>
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Advanced configuration options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                          <p className="text-sm text-muted-foreground">Put the forum in maintenance mode</p>
                        </div>
                        <Switch id="maintenance-mode" />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="debug-mode">Debug Mode</Label>
                          <p className="text-sm text-muted-foreground">Enable debug information for administrators</p>
                        </div>
                        <Switch id="debug-mode" />
                      </div>

                      <Separator />

                      <div className="grid gap-2">
                        <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                        <Input id="cache-ttl" type="number" defaultValue="3600" />
                        <p className="text-sm text-muted-foreground">Time to live for cached data in seconds</p>
                      </div>
                    </div>
                    <Button>Save Changes</Button>
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
