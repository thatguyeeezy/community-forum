import Link from "next/link"
import { Stats } from "@/components/stats"
import { OnlineUsers } from "@/components/online-users"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f1116]">
      {/* Hero Section */}
      <div className="py-16 bg-[#0f1116]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to Florida Coast RP</h1>
          <p className="text-gray-300 mb-6">
            Join our realistic FiveM roleplay community and experience immersive law enforcement, emergency services,
            and civilian interactions.
          </p>
          <div className="flex gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="https://discord.gg/DaPzAREBGp">Join Discord</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-[#1e2330] hover:text-white"
            >
              <Link href="/community">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <Stats />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Recent Activity - Left Column */}
          <div className="md:col-span-3">
            <div className="bg-[#1e2330] rounded-md overflow-hidden">
              <div className="border-b border-[#2d3139] px-4 py-3">
                <h2 className="text-lg font-bold">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium">New police vehicles added</h3>
                    <p className="text-sm text-gray-400">Posted by Admin, 2h ago</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium">Server maintenance</h3>
                    <p className="text-sm text-gray-400">Posted by Moderator, 5h ago</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-4">
                    <h3 className="font-medium">Welcome to our newest members</h3>
                    <p className="text-sm text-gray-400">Posted by Community Manager, 1d ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories - Middle Column */}
          <div className="md:col-span-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Categories</h2>
              <Link href="/community" className="text-blue-400 hover:text-blue-300 text-sm">
                View All Categories
              </Link>
            </div>
            <div className="space-y-4">
              {/* Community Announcements */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Community Announcements</h3>
                      <p className="text-sm text-gray-400">Official announcements from the team</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Updates */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Latest Updates</h3>
                      <p className="text-sm text-gray-400">Recent updates and news</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Announcements</h3>
                      <p className="text-sm text-gray-400">Recruitment announcements</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Chat */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Community Chat</h3>
                      <p className="text-sm text-gray-400">General chat about anything and everything</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recruitment and Retention */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Recruitment and Retention</h3>
                      <p className="text-sm text-gray-400">Information about joining and staying with us</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Server Changelogs */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Server Changelogs</h3>
                      <p className="text-sm text-gray-400">Detailed server update logs</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Important Info</h3>
                      <p className="text-sm text-gray-400">Essential information for applicants</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Introductions */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">Introductions</h3>
                      <p className="text-sm text-gray-400">Introduce yourself to the community</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* General Discussion */}
              <div className="bg-[#1e2330] rounded-md overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">General Discussion</h3>
                      <p className="text-sm text-gray-400">General topics and community discussions</p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>0 threads</div>
                      <div>0 posts</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-3 space-y-6">
            {/* Featured Event */}
            <div className="bg-[#1e2330] rounded-md overflow-hidden">
              <div className="border-b border-[#2d3139] px-4 py-3">
                <h2 className="text-lg font-bold">Featured Event</h2>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Grand Opening Weekend</h3>
                <p className="text-sm text-gray-300 mt-2">
                  Join us this weekend for the grand opening of the new shopping mall!
                </p>
                <p className="text-sm text-gray-400 mt-2">Saturday, 8PM EST</p>
              </div>
            </div>

            {/* Server Status */}
            <div className="bg-[#1e2330] rounded-md overflow-hidden">
              <div className="border-b border-[#2d3139] px-4 py-3">
                <h2 className="text-lg font-bold">Server Status</h2>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Online: 34 players</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">1,250</p>
                    <p className="text-sm text-gray-400">Members</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3,705</p>
                    <p className="text-sm text-gray-400">Discord</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Online Users */}
            <OnlineUsers />
          </div>
        </div>
      </div>
    </div>
  )
}
