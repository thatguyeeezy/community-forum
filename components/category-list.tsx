import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Users, FileText, Shield } from "lucide-react"

// Mock data - in a real app, this would come from your database
const categories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General topics and community discussions",
    threadCount: 124,
    postCount: 1453,
    icon: MessageSquare,
  },
  {
    id: 2,
    name: "Introductions",
    description: "Introduce yourself to the community",
    threadCount: 87,
    postCount: 342,
    icon: Users,
  },
  {
    id: 3,
    name: "Tutorials & Resources",
    description: "Share helpful tutorials and resources",
    threadCount: 56,
    postCount: 789,
    icon: FileText,
  },
  {
    id: 4,
    name: "Announcements",
    description: "Official announcements from the team",
    threadCount: 12,
    postCount: 145,
    icon: Shield,
  },
]

export function CategoryList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
        <Link href="/forums" className="text-sm text-primary hover:underline">
          View All Categories
        </Link>
      </div>
      <div className="grid gap-4">
        {categories.map((category) => (
          <Link key={category.id} href={`/forums/${category.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    {category.threadCount} threads
                  </div>
                  <div className="flex items-center">
                    <FileText className="mr-1 h-4 w-4" />
                    {category.postCount} posts
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

