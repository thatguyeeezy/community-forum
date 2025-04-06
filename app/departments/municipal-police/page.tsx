import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MunicipalPolicePage() {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative w-full h-64 mb-6">
            <Image
              src="/placeholder.svg?height=400&width=800"
              alt="Municipal Police Banner"
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 text-center text-blue-800 dark:text-blue-400">Municipal Police</h1>
            <p className="text-lg text-center mb-6">
              Municipal Police is responsible for community development, delivery, enforcement of law and order, and
              maintaining training standards of Municipal, San Andreas Bay Transit Police, and Environmental Police
              Officers performing police duties and functions.
            </p>

            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-400 mb-2 text-center">
                Mission Statement
              </h2>
              <p className="text-center">
                Municipal Police Agencies will partner with the community to promote open communication, education,
                cooperation, fair and equal treatment to improve the quality of life, promote unity, encourage respect,
                and make San Andreas a safe community.
              </p>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2 text-center">
                Code of Ethics
              </h2>
              <p className="text-center">
                A code of ethics sets forth values, principles, and standards to which professionals aspire and judge
                their actions. As Law Enforcement Officers, our fundamental duty is to serve the community to safeguard
                lives and property to protect the innocent against deception, the weak against oppression or
                intimidation, and the peaceful against violence or disorder, and to respect the constitutional rights of
                all to liberty, equality, and justice.
              </p>
            </div>
          </div>

          <Tabs defaultValue="bureaus" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bureaus">Bureaus</TabsTrigger>
              <TabsTrigger value="salec">SALEC</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="bureaus" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="bg-blue-800 text-white rounded-t-lg">
                  <CardTitle>Bureau of Professional Development</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Committed to excellence, our Bureau of Professional Development is the cornerstone of skill
                    enhancement and knowledge acquisition for our officers. Led by experienced Field Training Officers
                    (FTOs), we prioritize continuous training to empower our personnel with the latest techniques and
                    best practices, fostering a culture of continuous improvement.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-indigo-800 text-white rounded-t-lg">
                  <CardTitle>Bureau of Investigations</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    In collaboration with the San Andreas Fusion Center, our Bureau of Investigations is at the
                    forefront of unraveling complex cases and dismantling criminal networks. Specializing in thorough
                    investigations and targeted operations, we are dedicated to maintaining a proactive stance against
                    criminal, gang, and illegal activities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-amber-700 text-white rounded-t-lg">
                  <CardTitle>Bureau of Field Services</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Dynamic and responsive, our Bureau of Field Services is equipped with cutting-edge resources,
                    including K9 Units and Drone Operations. This ensures our ability to swiftly adapt and address a
                    spectrum of situations, reinforcing public safety through innovative and effective law enforcement
                    practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-slate-700 text-white rounded-t-lg">
                  <CardTitle>Bureau of Transportation</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Enforcing order on our streets and safeguarding public transit, the Bureau of Transportation plays a
                    vital role in ensuring secure and seamless mobility. From managing traffic with precision through
                    our Traffic Enforcement Division to vigilant oversight by the Transit Police, we are committed to
                    creating a safe environment for all commuters.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="bg-stone-700 text-white rounded-t-lg">
                  <CardTitle>Bureau of Professional Standards</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p>
                    Upholding the highest ethical standards is non-negotiable at our Bureau of Professional Standards.
                    Here, we oversee departmental complaints, material development, and policy implementation,
                    maintaining transparency and professionalism. Our commitment to ethical conduct is central to
                    building trust within the community and fostering a positive relationship between law enforcement
                    and the public.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="salec" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="SALEC Logo"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-center text-amber-600">San Andreas Law Enforcement Council</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    The San Andreas Law Enforcement Council (SALEC) is an association of law enforcement departments
                    within Los Santos County. Member agencies operate by sharing resources and personnel, collectively
                    providing services to each other that might not be available to one. SALEC coordinates this sharing
                    of personnel and resources to provide its member agencies with the ability to provide supplemental
                    services to the 250,000 people in the 30.84 square miles they serve.
                  </p>
                  <p>
                    SALEC is a professional organization directed by its members' priorities and needs. This means that
                    officers from SALEC agencies can be made available in other communities during an emergency or event
                    that requires police services beyond what local police may have. SALEC coordinates the provision of
                    mutual aid and the sharing of these officers between agencies in accordance with the San Andreas
                    Legislature. Simply stated, a law enforcement council coordinates a collaborative partnership of
                    police agencies in a region that shares knowledge, resources, and personnel to benefit public
                    safety.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=300&text=Police+Image+${item}`}
                      alt={`Police Image ${item}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Department Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <Image
                  src="/placeholder.svg?height=200&width=200&text=Department+Logo"
                  alt="Department Logo"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
              <div className="text-center mb-4">
                <Badge variant="destructive" className="text-sm">
                  Recruitment Status: Closed
                </Badge>
              </div>
              <p className="text-center text-sm">
                Stay informed and connected with the latest updates from Municipal Police. Visit the{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Municipal Police Portal
                </a>{" "}
                for real-time information, important announcements, and access to our monthly newsletter.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Leadership</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Matthew P.", position: "Police Commissioner", image: "/placeholder.svg?height=100&width=100" },
                { name: "Sam K.", position: "Chief of Police", image: "/placeholder.svg?height=100&width=100" },
                { name: "Oliver S.", position: "Deputy Chief", image: "/placeholder.svg?height=100&width=100" },
                { name: "Alex L.", position: "Commander", image: "/placeholder.svg?height=100&width=100" },
                { name: "Shadow S.", position: "Patrol Captain", image: "/placeholder.svg?height=100&width=100" },
              ].map((leader, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image src={leader.image || "/placeholder.svg"} alt={leader.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium">{leader.name}</p>
                    <p className="text-sm text-muted-foreground">{leader.position}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-red-600">Rank Structure</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-red-600">Police Administration</h4>
                  <ul className="list-none pl-2">
                    <li>Police Commissioner</li>
                    <li>Chief of Police</li>
                    <li>Deputy Chief</li>
                    <li>Commander</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-orange-600">Police Senior Staff</h4>
                  <ul className="list-none pl-2">
                    <li>Patrol Captain</li>
                    <li>Patrol Lieutenant</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-yellow-600">Police Staff</h4>
                  <ul className="list-none pl-2">
                    <li>Patrol Sergeant</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-600">Police Staff in Training</h4>
                  <ul className="list-none pl-2">
                    <li>Patrol Sergeant</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-600">Police Officers</h4>
                  <ul className="list-none pl-2">
                    <li>Senior Patrol Officer</li>
                    <li>Patrol Officer III</li>
                    <li>Patrol Officer II</li>
                    <li>Patrol Officer I</li>
                    <li>Probationary Patrol Officer</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">Reserve Police Officers</h4>
                  <ul className="list-none pl-2">
                    <li>Senior Reserve Officer</li>
                    <li>Reserve Officer</li>
                    <li>Probationary Reserve Officer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

