"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Search, Eye, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"

interface ErrorLog {
  id: number
  code: string
  category: string
  severity: string
  userMessage: string
  adminMessage: string
  details: string | null
  userId: number | null
  discordId: string | null
  ipAddress: string | null
  userAgent: string | null
  path: string | null
  resolved: boolean
  resolvedAt: string | null
  resolvedBy: number | null
  createdAt: string
}

interface ErrorStats {
  critical: number
  high: number
  medium: number
  low: number
  total: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [stats, setStats] = useState<ErrorStats>({ critical: 0, high: 0, medium: 0, low: 0, total: 0 })
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25, total: 0, pages: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null)
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [resolvedFilter, setResolvedFilter] = useState<string>("false")
  const [searchCode, setSearchCode] = useState("")

  const fetchErrors = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", pagination.page.toString())
      params.set("limit", pagination.limit.toString())
      if (categoryFilter !== "all") params.set("category", categoryFilter)
      if (severityFilter !== "all") params.set("severity", severityFilter)
      if (resolvedFilter !== "all") params.set("resolved", resolvedFilter)
      if (searchCode) params.set("code", searchCode)

      const response = await fetch(`/api/admin/errors?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch errors")
      
      const data = await response.json()
      setErrors(data.errors)
      setStats(data.stats)
      setPagination(prev => ({ ...prev, ...data.pagination }))
    } catch (error) {
      console.error("Error fetching errors:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, categoryFilter, severityFilter, resolvedFilter, searchCode])

  useEffect(() => {
    fetchErrors()
  }, [fetchErrors])

  const handleResolve = async (id: number, resolved: boolean) => {
    try {
      const response = await fetch("/api/admin/errors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, resolved }),
      })
      if (!response.ok) throw new Error("Failed to update error")
      
      // Refresh the list
      fetchErrors()
      setSelectedError(null)
    } catch (error) {
      console.error("Error updating error:", error)
    }
  }

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "secondary" | "outline", icon: React.ReactNode }> = {
      critical: { variant: "destructive", icon: <XCircle className="w-3 h-3 mr-1" /> },
      high: { variant: "destructive", icon: <AlertCircle className="w-3 h-3 mr-1" /> },
      medium: { variant: "secondary", icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
      low: { variant: "outline", icon: <Clock className="w-3 h-3 mr-1" /> },
    }
    const config = variants[severity] || variants.low
    return (
      <Badge variant={config.variant} className="flex items-center">
        {config.icon}
        {severity.toUpperCase()}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      AUTH: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      DISCORD: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      DATABASE: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      PERMISSION: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      SYSTEM: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return (
      <Badge variant="outline" className={colors[category] || ""}>
        {category}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Error Logs</h1>
              <p className="text-muted-foreground">View and manage system error logs</p>
            </div>
            <Button onClick={fetchErrors} variant="outline" size="sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-red-500">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.critical}</div>
              </CardContent>
            </Card>
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-orange-500">High</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.high}</div>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-yellow-500">Medium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.medium}</div>
              </CardContent>
            </Card>
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-green-500">Low</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.low}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code..."
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="AUTH">AUTH</SelectItem>
                    <SelectItem value="DISCORD">DISCORD</SelectItem>
                    <SelectItem value="DATABASE">DATABASE</SelectItem>
                    <SelectItem value="PERMISSION">PERMISSION</SelectItem>
                    <SelectItem value="SYSTEM">SYSTEM</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="false">Unresolved</SelectItem>
                    <SelectItem value="true">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error Table */}
          <Card>
            <CardHeader>
              <CardTitle>Error Logs</CardTitle>
              <CardDescription>
                {pagination.total} total errors • Showing {errors.length} of {pagination.total}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : errors.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <p>No errors found.</p>
                  <p className="text-sm mt-2">All systems are running smoothly!</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>User Message</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {errors.map((error) => (
                        <TableRow key={error.id}>
                          <TableCell className="font-mono font-medium">
                            {error.code}-{error.id}
                          </TableCell>
                          <TableCell>{getCategoryBadge(error.category)}</TableCell>
                          <TableCell>{getSeverityBadge(error.severity)}</TableCell>
                          <TableCell className="max-w-xs truncate">{error.userMessage}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(error.createdAt)}
                          </TableCell>
                          <TableCell>
                            {error.resolved ? (
                              <Badge variant="outline" className="text-green-500 border-green-500/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-yellow-500 border-yellow-500/20">
                                <Clock className="w-3 h-3 mr-1" />
                                Open
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedError(error)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page >= pagination.pages}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Detail Dialog */}
      <Dialog open={!!selectedError} onOpenChange={() => setSelectedError(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedError && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono">{selectedError.code}-{selectedError.id}</span>
                  {getSeverityBadge(selectedError.severity)}
                </DialogTitle>
                <DialogDescription>
                  Error details and resolution
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedError.resolved 
                        ? `Resolved on ${formatDate(selectedError.resolvedAt!)}` 
                        : "Unresolved - requires attention"}
                    </p>
                  </div>
                  <Button
                    variant={selectedError.resolved ? "outline" : "default"}
                    onClick={() => handleResolve(selectedError.id, !selectedError.resolved)}
                  >
                    {selectedError.resolved ? (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reopen
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Resolved
                      </>
                    )}
                  </Button>
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">User Message (what user sees)</h4>
                    <p className="text-sm p-3 rounded-lg bg-muted">{selectedError.userMessage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Admin Message (full details)</h4>
                    <p className="text-sm p-3 rounded-lg bg-muted">{selectedError.adminMessage}</p>
                  </div>
                  {selectedError.details && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Additional Details</h4>
                      <pre className="text-xs p-3 rounded-lg bg-muted overflow-x-auto whitespace-pre-wrap">
                        {selectedError.details}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Context */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Category</h4>
                    {getCategoryBadge(selectedError.category)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Occurred At</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedError.createdAt)}</p>
                  </div>
                  {selectedError.path && (
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium mb-1">Path</h4>
                      <code className="text-xs p-2 rounded bg-muted block">{selectedError.path}</code>
                    </div>
                  )}
                </div>

                {/* User Info */}
                {(selectedError.userId || selectedError.discordId) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">User Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedError.userId && (
                        <div>
                          <span className="text-muted-foreground">User ID:</span> {selectedError.userId}
                        </div>
                      )}
                      {selectedError.discordId && (
                        <div>
                          <span className="text-muted-foreground">Discord ID:</span> {selectedError.discordId}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Technical Info */}
                {(selectedError.ipAddress || selectedError.userAgent) && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2">Technical Information</h4>
                    <div className="space-y-2 text-xs">
                      {selectedError.ipAddress && (
                        <div>
                          <span className="text-muted-foreground">IP Address:</span>{" "}
                          <code className="bg-muted px-1 rounded">{selectedError.ipAddress}</code>
                        </div>
                      )}
                      {selectedError.userAgent && (
                        <div>
                          <span className="text-muted-foreground">User Agent:</span>
                          <code className="bg-muted px-1 rounded block mt-1 whitespace-pre-wrap">
                            {selectedError.userAgent}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

