"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // In a real application, you would fetch the department data here
  const departmentId = params.id

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real application, you would submit the form data to your API

    toast({
      title: "Department updated",
      description: "The department information has been updated successfully.",
    })

    setIsSubmitting(false)
    router.push(`/departments/${departmentId}`)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Department: {departmentId.toUpperCase()}</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="bureaus">Bureaus</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Edit the basic information about the department</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input id="name" defaultValue={departmentId.toUpperCase()} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter department description" rows={4} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="logo">Department Logo</Label>
                  <Input id="logo" type="file" />
                  <p className="text-sm text-muted-foreground">
                    Upload a square logo image (recommended size: 200x200px)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="rankStructure">Rank Structure</Label>
                  <Textarea id="rankStructure" placeholder="Enter rank structure (one rank per line)" rows={6} />
                  <p className="text-sm text-muted-foreground">Enter each rank on a new line, from highest to lowest</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bureaus" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bureaus & Divisions</CardTitle>
              <CardDescription>Manage the bureaus and divisions within the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Patrol Bureau</h3>
                  <Textarea
                    placeholder="Enter bureau description"
                    defaultValue="The Patrol Bureau is the backbone of the department, providing 24/7 coverage throughout the jurisdiction."
                    rows={4}
                    className="mb-2"
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Investigations Bureau</h3>
                  <Textarea
                    placeholder="Enter bureau description"
                    defaultValue="The Investigations Bureau handles all criminal investigations, from property crimes to homicides."
                    rows={4}
                    className="mb-2"
                  />
                  <div className="flex justify-end">
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Add New Bureau
                </Button>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Bureaus updated",
                        description: "The bureaus information has been updated successfully.",
                      })
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leadership" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Leadership</CardTitle>
              <CardDescription>Manage the leadership positions within the department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leader1-name">Name</Label>
                      <Input id="leader1-name" defaultValue="John Doe" />
                    </div>
                    <div>
                      <Label htmlFor="leader1-position">Position</Label>
                      <Input id="leader1-position" defaultValue="Chief of Police" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leader2-name">Name</Label>
                      <Input id="leader2-name" defaultValue="Jane Smith" />
                    </div>
                    <div>
                      <Label htmlFor="leader2-position">Position</Label>
                      <Input id="leader2-position" defaultValue="Assistant Chief" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Add New Leader
                </Button>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Leadership updated",
                        description: "The leadership information has been updated successfully.",
                      })
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
              <CardDescription>Manage the department's image gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="relative aspect-square border rounded-md">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground">Image {i}</p>
                      </div>
                      <Button variant="destructive" size="sm" className="absolute top-2 right-2">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="border rounded-md p-4">
                  <Label htmlFor="gallery-upload">Upload New Images</Label>
                  <Input id="gallery-upload" type="file" multiple className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">You can upload multiple images at once</p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      toast({
                        title: "Gallery updated",
                        description: "The gallery has been updated successfully.",
                      })
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

