"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PermissionGuard, useRBAC } from "@/lib/rbac"
import { InventoryManagement } from "@/components/inventory-management"
import { AdvancedAnalytics } from "@/components/advanced-analytics"
import { Shield, Users, BarChart3, Package, Settings, Database, FileText, Download, Upload, Zap } from "lucide-react"

const enterpriseFeatures = [
  {
    title: "Role-Based Access Control",
    description: "Granular permissions and user role management",
    icon: Shield,
    status: "Active",
    users: 12,
  },
  {
    title: "Advanced Analytics",
    description: "Comprehensive business intelligence and reporting",
    icon: BarChart3,
    status: "Active",
    reports: 25,
  },
  {
    title: "Inventory Management",
    description: "Multi-location stock tracking and forecasting",
    icon: Package,
    status: "Active",
    locations: 3,
  },
  {
    title: "Data Import/Export",
    description: "Bulk operations and data synchronization",
    icon: Database,
    status: "Active",
    lastSync: "2 hours ago",
  },
]

export default function EnterpriseAdminPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { userRole, hasPermission } = useRBAC()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Enterprise Admin</h1>
          <p className="text-muted-foreground">Advanced features and system management</p>
          {userRole && (
            <div className="mt-4">
              <Badge variant="outline">Role: {userRole.role.replace("_", " ").toUpperCase()}</Badge>
              {userRole.department && (
                <Badge variant="secondary" className="ml-2">
                  {userRole.department}
                </Badge>
              )}
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="users">Users & Roles</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enterprise Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enterpriseFeatures.map((feature) => (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <feature.icon className="w-8 h-8 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="default">{feature.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {feature.users && `${feature.users} users`}
                        {feature.reports && `${feature.reports} reports`}
                        {feature.locations && `${feature.locations} locations`}
                        {feature.lastSync && `Last sync: ${feature.lastSync}`}
                      </span>
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common enterprise management tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <PermissionGuard permission="export_data">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Download className="w-6 h-6" />
                      <span>Export Data</span>
                    </Button>
                  </PermissionGuard>

                  <PermissionGuard permission="manage_users">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Upload className="w-6 h-6" />
                      <span>Import Data</span>
                    </Button>
                  </PermissionGuard>

                  <PermissionGuard permission="view_reports">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <FileText className="w-6 h-6" />
                      <span>Generate Report</span>
                    </Button>
                  </PermissionGuard>

                  <PermissionGuard permission="manage_settings">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Settings className="w-6 h-6" />
                      <span>System Settings</span>
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system performance and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">99.9%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">245ms</div>
                    <p className="text-sm text-muted-foreground">Avg Response</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.1GB</div>
                    <p className="text-sm text-muted-foreground">Database Size</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15.2K</div>
                    <p className="text-sm text-muted-foreground">API Calls/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <PermissionGuard
              permission="view_analytics"
              fallback={
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">You don't have permission to view analytics.</p>
                  </CardContent>
                </Card>
              }
            >
              <AdvancedAnalytics />
            </PermissionGuard>
          </TabsContent>

          <TabsContent value="inventory">
            <PermissionGuard
              permission="manage_inventory"
              fallback={
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">You don't have permission to manage inventory.</p>
                  </CardContent>
                </Card>
              }
            >
              <InventoryManagement />
            </PermissionGuard>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <PermissionGuard
              permission="manage_users"
              fallback={
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">You don't have permission to manage users.</p>
                  </CardContent>
                </Card>
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>User & Role Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">User management interface would be implemented here</p>
                    <Button className="mt-4">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PermissionGuard>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <PermissionGuard
              permission="export_data"
              fallback={
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">You don't have permission to manage data.</p>
                  </CardContent>
                </Card>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                    <CardDescription>Export business data in various formats</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Products (CSV)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Orders (Excel)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Customers (JSON)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Full Database Backup
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Import</CardTitle>
                    <CardDescription>Import data from external sources</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Products
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Customers
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Inventory
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Update Prices
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </PermissionGuard>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <PermissionGuard
              permission="manage_settings"
              fallback={
                <Card>
                  <CardContent className="p-8 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p className="text-muted-foreground">You don't have permission to manage system settings.</p>
                  </CardContent>
                </Card>
              }
            >
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Advanced system settings and maintenance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Settings className="w-6 h-6" />
                      <span>Global Settings</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Database className="w-6 h-6" />
                      <span>Database Maintenance</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Zap className="w-6 h-6" />
                      <span>Performance Tuning</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Shield className="w-6 h-6" />
                      <span>Security Settings</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <FileText className="w-6 h-6" />
                      <span>Audit Logs</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
                    >
                      <Upload className="w-6 h-6" />
                      <span>System Updates</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </PermissionGuard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
