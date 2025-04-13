"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DiscordTestPage() {
  const [discordId, setDiscordId] = useState("325305414705086465")
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testDiscordAPI = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/discord/test")
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setError("Failed to test Discord API: " + String(err))
    } finally {
      setLoading(false)
    }
  }

  const testUserRoles = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/discord/roles/${discordId}`)
      const data = await response.json()
      setTestResult(data)
    } catch (err) {
      setError("Failed to fetch user roles: " + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Discord Integration Test</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Discord API</CardTitle>
            <CardDescription>Test if the Discord bot can access the guild and members</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testDiscordAPI} disabled={loading}>
              {loading ? "Testing..." : "Test Discord API"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test User Roles</CardTitle>
            <CardDescription>Test if the Discord bot can fetch a user's roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input
                value={discordId}
                onChange={(e) => setDiscordId(e.target.value)}
                placeholder="Discord User ID"
                className="max-w-xs"
              />
              <Button onClick={testUserRoles} disabled={loading}>
                {loading ? "Testing..." : "Test User Roles"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>}

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
