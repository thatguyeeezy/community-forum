import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Building2, Users, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to FCRP</h1>
            <p className="text-muted-foreground">Your central hub for department information and community resources</p>
          </div>
          <Button asChild size="lg">
            <Link href="https://discord.gg/DaPzAREBGp">Join the Discord</Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="py-12 md:py-24 bg-muted/50 rounded-lg">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Florida Coast Roleplay Community
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore our departments, meet our members, and discover what makes our community special.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild>
                  <Link href="/departments/bso">Explore Departments</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/members">View Members</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-8">What We Offer</h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Department Information</h3>
                  <p className="text-muted-foreground">
                    Explore detailed information about each department, their mission, and structure.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Member Profiles</h3>
                  <p className="text-muted-foreground">View member profiles, badges, and department affiliations.</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Resources</h3>
                  <p className="text-muted-foreground">
                    Access important community resources, guidelines, and documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Departments Preview */}
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Our Departments</h2>
              <Button variant="link" asChild>
                <Link href="/departments">View All</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* BSO Card */}
              <Link href="/departments/bso">
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">BSO</h3>
                        <p className="text-sm text-muted-foreground">Broward Sheriff's Office</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      County law enforcement agency serving Broward County.
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* MPD Card */}
              <Link href="/departments/mpd">
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">MPD</h3>
                        <p className="text-sm text-muted-foreground">Miami Police Department</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">City law enforcement agency serving Miami.</p>
                  </CardContent>
                </Card>
              </Link>

              {/* FHP Card */}
              <Link href="/departments/fhp">
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">FHP</h3>
                        <p className="text-sm text-muted-foreground">Florida Highway Patrol</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      State law enforcement agency patrolling Florida's highways.
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

