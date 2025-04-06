import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Image from "next/image"
import { notFound } from "next/navigation"

// Function to check if user can edit department
async function canEditDepartment(departmentSlug: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return false
  }

  // Get user information
  const userDepartment = session.user.department as string
  const userRole = session.user.role as string

  // Check if user is in Dev department and is a Junior Administrator
  if (userDepartment === "DEV" && userRole === "JUNIOR_ADMIN") {
    return true
  }

  // Check if user has Leadership role
  if (userRole === "HEAD_ADMIN" || userRole === "SENIOR_ADMIN" || userRole === "ADMIN") {
    return true
  }

  // Check if user is an administrator of their own department
  if (userDepartment === departmentSlug && userRole === "ADMIN") {
    return true
  }

  return false
}

export default async function DepartmentPage({ params }: { params: { slug: string } }) {
  const departmentSlug = params.slug.toUpperCase()

  // Get department info from database
  try {
    // For now, we'll use a mapping of department slugs to their full names
    const departmentNames: Record<string, string> = {
      BSFR: "Broward Sheriff Fire Rescue",
      BSO: "Broward Sheriff's Office",
      MPD: "Miami Police Department",
      FHP: "Florida Highway Patrol",
      COMMS: "Communications",
      FWC: "Florida Fish and Wildlife Conservation",
      CIV: "Civilian Operations",
    }

    const departmentName = departmentNames[departmentSlug] || departmentSlug

    // Check if the user can edit this department
    const canEdit = await canEditDepartment(departmentSlug)

    return (
      <div className="container py-10">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{departmentName}</h1>
          {canEdit && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/admin/departments/${departmentSlug}/edit`} className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Department
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with Department Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{departmentName}</CardTitle>
                <CardDescription>Department Information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center mb-4">
                  <div className="relative w-40 h-40">
                    <Image
                      src={`/placeholder.svg?height=160&width=160&text=${departmentSlug}+Logo`}
                      alt={`${departmentSlug} Logo`}
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
                      Information about the {departmentName} department.
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
                          <p className="text-sm">Department Head</p>
                          <p className="text-xs text-muted-foreground">Position</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium">Rank Structure</h3>
                    <div className="mt-2 space-y-1">
                      <Badge className="mr-1 mb-1">Rank 1</Badge>
                      <Badge className="mr-1 mb-1">Rank 2</Badge>
                      <Badge className="mr-1 mb-1">Rank 3</Badge>
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
                    <CardTitle>Bureau 1</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Description of Bureau 1.</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bureau 2</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Description of Bureau 2.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salec" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>SALEC Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Information about SALEC (South Atlantic Law Enforcement Coalition).</p>

                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2">SALEC Agencies</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Agency 1</li>
                        <li>Agency 2</li>
                        <li>Agency 3</li>
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
                            src={`/placeholder.svg?height=200&width=200&text=${departmentSlug}+Image+${i}`}
                            alt={`${departmentSlug} Image ${i}`}
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
  } catch (error) {
    console.error("Error fetching department:", error)
    notFound()
  }
}

