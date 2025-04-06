import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { DepartmentEditButton } from "@/components/department-edit-button"
import { canEditDepartment } from "@/lib/permissions"
import Image from "next/image"
import { notFound } from "next/navigation"

// This would come from your database in a real application
const departmentData = {
  bsfr: {
    name: "Broward Sheriff Fire Rescue",
    shortName: "BSFR",
    description: "County Fire and Emergency Medical Services",
    logo: "/placeholder.svg?height=160&width=160&text=BSFR+Logo",
    leadership: [
      { name: "John Smith", position: "Fire Chief", avatar: "JS" },
      { name: "Sarah Johnson", position: "Deputy Chief", avatar: "SJ" },
    ],
    ranks: [
      "Fire Chief",
      "Deputy Chief",
      "Battalion Chief",
      "Captain",
      "Lieutenant",
      "Driver Engineer",
      "Firefighter/Paramedic",
      "Firefighter/EMT",
      "Probationary Firefighter",
    ],
    bureaus: [
      {
        name: "Operations Bureau",
        description:
          "The Operations Bureau is responsible for emergency response, including fire suppression, emergency medical services, and technical rescue operations.",
      },
      {
        name: "Training Bureau",
        description:
          "The Training Bureau ensures all personnel are properly trained and certified in fire suppression, emergency medical services, and special operations.",
      },
      {
        name: "Fire Prevention Bureau",
        description:
          "The Fire Prevention Bureau conducts inspections, reviews plans, and educates the public to prevent fires and ensure code compliance.",
      },
    ],
    salec: {
      description:
        "BSFR works closely with other agencies in the South Atlantic Law Enforcement Coalition (SALEC) to provide coordinated emergency services.",
      agencies: ["Broward Sheriff's Office", "Miami Police Department", "Florida Highway Patrol"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  bso: {
    name: "Broward Sheriff's Office",
    shortName: "BSO",
    description: "County Law Enforcement Agency",
    logo: "/placeholder.svg?height=160&width=160&text=BSO+Logo",
    leadership: [
      { name: "Robert Davis", position: "Sheriff", avatar: "RD" },
      { name: "Michael Wilson", position: "Undersheriff", avatar: "MW" },
    ],
    ranks: [
      "Sheriff",
      "Undersheriff",
      "Colonel",
      "Major",
      "Captain",
      "Lieutenant",
      "Sergeant",
      "Corporal",
      "Deputy Sheriff",
    ],
    bureaus: [
      {
        name: "Patrol Bureau",
        description:
          "The Patrol Bureau provides law enforcement services throughout Broward County, responding to calls for service and conducting proactive patrols.",
      },
      {
        name: "Criminal Investigations Bureau",
        description:
          "The Criminal Investigations Bureau investigates crimes ranging from property crimes to homicides, working to bring justice to victims.",
      },
      {
        name: "Detention Bureau",
        description:
          "The Detention Bureau operates the county jail facilities, ensuring the safe and secure custody of inmates.",
      },
    ],
    salec: {
      description:
        "BSO is a founding member of the South Atlantic Law Enforcement Coalition (SALEC), which facilitates information sharing and mutual aid between agencies.",
      agencies: ["Broward Sheriff Fire Rescue", "Miami Police Department", "Florida Highway Patrol"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  mpd: {
    name: "Miami Police Department",
    shortName: "MPD",
    description: "City Law Enforcement Agency",
    logo: "/placeholder.svg?height=160&width=160&text=MPD+Logo",
    leadership: [
      { name: "John Doe", position: "Chief of Police", avatar: "JD" },
      { name: "Jane Smith", position: "Assistant Chief", avatar: "JS" },
    ],
    ranks: [
      "Chief of Police",
      "Assistant Chief",
      "Major",
      "Captain",
      "Lieutenant",
      "Sergeant",
      "Corporal",
      "Officer",
      "Recruit",
    ],
    bureaus: [
      {
        name: "Patrol Bureau",
        description:
          "The Patrol Bureau is the backbone of the Miami Police Department, providing 24/7 coverage throughout the city.",
      },
      {
        name: "Investigations Bureau",
        description:
          "The Investigations Bureau handles all criminal investigations, from property crimes to homicides.",
      },
      {
        name: "Special Operations Bureau",
        description:
          "The Special Operations Bureau includes specialized units such as SWAT, K-9, Marine Patrol, and Aviation.",
      },
    ],
    salec: {
      description:
        "The South Atlantic Law Enforcement Coalition (SALEC) is a partnership between law enforcement agencies in the region. The Miami Police Department is a proud member of this coalition.",
      agencies: ["Broward Sheriff's Office", "Florida Highway Patrol", "Florida Fish and Wildlife Conservation"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  fhp: {
    name: "Florida Highway Patrol",
    shortName: "FHP",
    description: "State Law Enforcement Agency",
    logo: "/placeholder.svg?height=160&width=160&text=FHP+Logo",
    leadership: [
      { name: "Thomas Brown", position: "Colonel", avatar: "TB" },
      { name: "Elizabeth Clark", position: "Lieutenant Colonel", avatar: "EC" },
    ],
    ranks: [
      "Colonel",
      "Lieutenant Colonel",
      "Major",
      "Captain",
      "Lieutenant",
      "Sergeant",
      "Corporal",
      "Trooper First Class",
      "Trooper",
    ],
    bureaus: [
      {
        name: "Patrol Operations",
        description:
          "Patrol Operations is responsible for enforcing traffic laws and ensuring safety on Florida's highways.",
      },
      {
        name: "Criminal Investigations",
        description:
          "The Criminal Investigations unit handles complex cases related to traffic homicide, drug interdiction, and other crimes on state highways.",
      },
      {
        name: "Special Operations",
        description: "Special Operations includes the Aviation Unit, K-9 Unit, and Tactical Response Teams.",
      },
    ],
    salec: {
      description:
        "FHP works closely with other agencies in the South Atlantic Law Enforcement Coalition (SALEC) to ensure coordinated law enforcement efforts across jurisdictions.",
      agencies: ["Broward Sheriff's Office", "Miami Police Department", "Florida Fish and Wildlife Conservation"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  comms: {
    name: "Communications",
    shortName: "COMMS",
    description: "Emergency Communications Center",
    logo: "/placeholder.svg?height=160&width=160&text=COMMS+Logo",
    leadership: [
      { name: "Patricia Harris", position: "Communications Director", avatar: "PH" },
      { name: "David Martinez", position: "Assistant Director", avatar: "DM" },
    ],
    ranks: [
      "Communications Director",
      "Assistant Director",
      "Shift Supervisor",
      "Communications Training Officer",
      "Senior Dispatcher",
      "Dispatcher",
      "Trainee",
    ],
    bureaus: [
      {
        name: "911 Call Center",
        description: "The 911 Call Center receives emergency calls and dispatches appropriate resources to incidents.",
      },
      {
        name: "Training Division",
        description:
          "The Training Division ensures all dispatchers are properly trained in emergency telecommunications.",
      },
      {
        name: "Technical Services",
        description: "Technical Services maintains the communications infrastructure and implements new technologies.",
      },
    ],
    salec: {
      description:
        "Communications serves as the central hub for the South Atlantic Law Enforcement Coalition (SALEC), coordinating responses between multiple agencies.",
      agencies: [
        "Broward Sheriff's Office",
        "Miami Police Department",
        "Florida Highway Patrol",
        "Broward Sheriff Fire Rescue",
      ],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  fwc: {
    name: "Florida Fish and Wildlife Conservation",
    shortName: "FWC",
    description: "State Conservation Law Enforcement",
    logo: "/placeholder.svg?height=160&width=160&text=FWC+Logo",
    leadership: [
      { name: "James Wilson", position: "Director", avatar: "JW" },
      { name: "Rebecca Taylor", position: "Deputy Director", avatar: "RT" },
    ],
    ranks: [
      "Director",
      "Deputy Director",
      "Regional Commander",
      "Captain",
      "Lieutenant",
      "Sergeant",
      "Officer",
      "Recruit",
    ],
    bureaus: [
      {
        name: "Law Enforcement",
        description:
          "The Law Enforcement division enforces conservation laws and regulations throughout Florida's lands and waters.",
      },
      {
        name: "Wildlife Management",
        description:
          "Wildlife Management oversees the conservation and management of Florida's diverse wildlife species.",
      },
      {
        name: "Boating and Waterways",
        description: "Boating and Waterways ensures safety on Florida's waterways and enforces boating regulations.",
      },
    ],
    salec: {
      description:
        "FWC participates in the South Atlantic Law Enforcement Coalition (SALEC) to coordinate conservation law enforcement efforts with other agencies.",
      agencies: ["Broward Sheriff's Office", "Miami Police Department", "Florida Highway Patrol"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
  civ: {
    name: "Civilian Operations",
    shortName: "CIV",
    description: "Civilian Roleplay and Activities",
    logo: "/placeholder.svg?height=160&width=160&text=CIV+Logo",
    leadership: [
      { name: "Emily Rodriguez", position: "Civilian Director", avatar: "ER" },
      { name: "Daniel Kim", position: "Assistant Director", avatar: "DK" },
    ],
    ranks: ["Civilian Director", "Assistant Director", "Business Owner", "Entrepreneur", "Citizen", "Visitor"],
    bureaus: [
      {
        name: "Business Operations",
        description:
          "Business Operations oversees civilian-owned businesses and commercial activities within the community.",
      },
      {
        name: "Community Events",
        description: "Community Events organizes and coordinates civilian-led events and activities.",
      },
      {
        name: "Civilian Training",
        description: "Civilian Training provides guidance and resources for new civilian roleplayers.",
      },
    ],
    salec: {
      description:
        "Civilian Operations works with the South Atlantic Law Enforcement Coalition (SALEC) to ensure realistic civilian-law enforcement interactions.",
      agencies: ["Broward Sheriff's Office", "Miami Police Department", "Florida Highway Patrol"],
    },
    gallery: [1, 2, 3, 4, 5, 6],
  },
}

export default async function DepartmentPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()

  // Check if the department exists
  if (!departmentData[slug as keyof typeof departmentData]) {
    notFound()
  }

  const department = departmentData[slug as keyof typeof departmentData]

  // Check if the user can edit this department
  const canEdit = await canEditDepartment(slug)

  return (
    <div className="container py-10">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">{department.name}</h1>
        {canEdit && <DepartmentEditButton departmentId={slug} canEdit={canEdit} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar with Department Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>{department.name}</CardTitle>
              <CardDescription>{department.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="relative w-40 h-40">
                  <Image
                    src={department.logo || "/placeholder.svg"}
                    alt={`${department.shortName} Logo`}
                    width={160}
                    height={160}
                    className="rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Department Information</h3>
                  <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium">Leadership</h3>
                  <div className="mt-2 space-y-2">
                    {department.leadership.map((leader, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{leader.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{leader.name}</p>
                          <p className="text-xs text-muted-foreground">{leader.position}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium">Rank Structure</h3>
                  <div className="mt-2 space-y-1">
                    {department.ranks.map((rank, index) => (
                      <Badge key={index} className="mr-1 mb-1">
                        {rank}
                      </Badge>
                    ))}
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
              {department.bureaus.map((bureau, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{bureau.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{bureau.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="salec" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>SALEC Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{department.salec.description}</p>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">SALEC Agencies</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {department.salec.agencies.map((agency, index) => (
                        <li key={index}>{agency}</li>
                      ))}
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
                    {department.gallery.map((i) => (
                      <div key={i} className="aspect-square relative">
                        <Image
                          src={`/placeholder.svg?height=200&width=200&text=${department.shortName}+Image+${i}`}
                          alt={`${department.shortName} Image ${i}`}
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

