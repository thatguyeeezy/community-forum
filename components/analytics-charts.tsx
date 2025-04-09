"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface DataPoint {
  date: string
  count: number
}

interface AnalyticsChartsProps {
  data: {
    userRegistrations: DataPoint[]
    threadCreations: DataPoint[]
    postCreations: DataPoint[]
  }
}

export function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line")

  // Combine all data for the overview chart
  const combinedData = data.userRegistrations.map((item) => {
    const threadData = data.threadCreations.find((t) => t.date === item.date)
    const postData = data.postCreations.find((p) => p.date === item.date)

    return {
      date: item.date,
      users: item.count,
      threads: threadData ? threadData.count : 0,
      posts: postData ? postData.count : 0,
    }
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="threads">Threads</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="overview" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart data={combinedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                          <Line type="monotone" dataKey="threads" stroke="#82ca9d" name="Threads" />
                          <Line type="monotone" dataKey="posts" stroke="#ffc658" name="Posts" />
                        </LineChart>
                      ) : (
                        <BarChart data={combinedData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="users" fill="#8884d8" name="Users" />
                          <Bar dataKey="threads" fill="#82ca9d" name="Threads" />
                          <Bar dataKey="posts" fill="#ffc658" name="Posts" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart data={data.userRegistrations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="count" stroke="#8884d8" name="User Registrations" />
                        </LineChart>
                      ) : (
                        <BarChart data={data.userRegistrations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="User Registrations" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="threads" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart data={data.threadCreations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Thread Creations" />
                        </LineChart>
                      ) : (
                        <BarChart data={data.threadCreations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#82ca9d" name="Thread Creations" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="posts" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" ? (
                        <LineChart data={data.postCreations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="count" stroke="#ffc658" name="Post Creations" />
                        </LineChart>
                      ) : (
                        <BarChart data={data.postCreations}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#ffc658" name="Post Creations" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`px-3 py-1 rounded-md ${
              chartType === "line" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-1 rounded-md ${
              chartType === "bar" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            Bar
          </button>
        </div>
      </div>
    </div>
  )
}
