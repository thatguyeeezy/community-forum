import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function MPDPage() {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with Department Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Miami Police Department</CardTitle>
              <CardDescription>City Law Enforcement Agency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-40">
                  <Image
                    src="/placeholder.svg?height=160&width=160&text=MPD+Logo"
                    alt="MPD Logo"
                    width={160}
                    height={160}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Department Information</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The Miami Police Department serves and protects the citizens of Miami with integrity and
                    professionalism.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium">Leadership</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">Chief John Doe</p>
                        <p className="text-xs text-muted-foreground">Chief of Police</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm">Jane Smith</p>
                        <p className="text-xs text-muted-foreground">Assistant Chief</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium">Rank Structure</h3>
                  <div className="mt-2 space-y-1">
                    <Badge className="mr-1">Chief of Police</Badge>
                    <Badge className="mr-1">Assistant Chief</Badge>
                    <Badge className="mr-1">Major</Badge>
                    <Badge className="mr-1">Captain</Badge>
                    <Badge className="mr-1">Lieutenant</Badge>
                    <Badge className="mr-1">Sergeant</Badge>
                    <Badge className="mr-1">Corporal</Badge>
                    <Badge className="mr-1">Officer</Badge>
                    <Badge className="mr-1">Recruit</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="bureaus" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bureaus">Bureaus</TabsTrigger>
              <TabsTrigger value="salec">SALEC</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="bureaus" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patrol Bureau</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The Patrol Bureau is the backbone of the Miami Police Department, providing 24/7 coverage throughout
                    the city. Officers respond to calls for service, conduct traffic enforcement, and engage in
                    community policing initiatives.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investigations Bureau</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The Investigations Bureau handles all criminal investigations, from property crimes to homicides.
                    Detectives work tirelessly to solve cases and bring justice to victims.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Special Operations Bureau</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The Special Operations Bureau includes specialized units such as SWAT, K-9, Marine Patrol, and
                    Aviation. These units provide tactical support and specialized services to the department.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salec" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>SALEC Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    The South Atlantic Law Enforcement Coalition (SALEC) is a partnership between law enforcement
                    agencies in the region. The Miami Police Department is a proud member of this coalition, which
                    facilitates information sharing and mutual aid.
                  </p>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">SALEC Agencies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Miami Police Department</li>
                      <li>Broward Sheriff's Office</li>
                      <li>Florida Highway Patrol</li>
                      <li>Florida Fish and Wildlife Conservation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="aspect-square relative">
                        <Image
                          src={`/placeholder.svg?height=200&width=200&text=MPD+Image+${i}`}
                          alt={`MPD Image ${i}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ))}
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

