"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Download,
  Trash2,
  Eye,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Key,
  Globe,
  FileText,
} from "lucide-react"

const activeSessions = [
  {
    id: 1,
    device: "Chrome on Windows",
    location: "Mumbai, India",
    lastActive: "Active now",
    current: true,
  },
  {
    id: 2,
    device: "Safari on iPhone",
    location: "Mumbai, India",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: 3,
    device: "Chrome on Android",
    location: "Delhi, India",
    lastActive: "1 day ago",
    current: false,
  },
]

export default function PrivacyControlsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Controls</h1>
          <p className="text-muted-foreground">Manage your privacy settings and data controls</p>
        </div>

        <Tabs defaultValue="data" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="data">My Data</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>Download, view, or delete your personal data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Download className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">Download My Data</h4>
                        <p className="text-sm text-muted-foreground">Get a copy of all your data</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Request Data Export
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Eye className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold">View My Data</h4>
                        <p className="text-sm text-muted-foreground">See what data we have about you</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Data Summary
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Data Categories</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Profile Information", size: "2.3 KB", items: "Name, email, phone" },
                      { name: "Order History", size: "45.7 KB", items: "12 orders, payment details" },
                      { name: "Browsing Data", size: "8.9 KB", items: "Page views, search history" },
                      { name: "Preferences", size: "1.2 KB", items: "Settings, notifications" },
                    ].map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.items}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{category.size}</p>
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Data Export Timeline</p>
                      <p className="text-xs text-muted-foreground">
                        Data exports are typically ready within 24-48 hours. You'll receive an email when your export is
                        ready for download.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Protect your account with additional security measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    {twoFactorEnabled && <Badge variant="default">Enabled</Badge>}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Login Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage devices that are currently logged into your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{session.device}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.current && <Badge variant="default">Current</Badge>}
                        {!session.current && (
                          <Button variant="outline" size="sm">
                            End Session
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  End All Other Sessions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Privacy Preferences</span>
                </CardTitle>
                <CardDescription>Control how your data is used and shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Personalized Recommendations</p>
                      <p className="text-sm text-muted-foreground">Use my data to suggest relevant products</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-muted-foreground">Receive promotional emails and offers</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Analytics & Performance</p>
                      <p className="text-sm text-muted-foreground">Help improve our website and services</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Third-Party Sharing</p>
                      <p className="text-sm text-muted-foreground">
                        Share data with trusted partners for better service
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Location Tracking</p>
                      <p className="text-sm text-muted-foreground">Use location for delivery and local offers</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Data Retention</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Browsing History</p>
                        <p className="text-xs text-muted-foreground">Automatically delete after 12 months</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear Now
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Search History</p>
                        <p className="text-xs text-muted-foreground">Automatically delete after 6 months</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Account Management</span>
                </CardTitle>
                <CardDescription>Manage your account settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Account Status</h4>
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Account is active and verified</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="account-email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input id="account-email" value="priya@example.com" disabled className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="account-phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input id="account-phone" value="+91 98765 43210" disabled className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Account Actions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Deactivate Account</p>
                        <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Deactivate
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Export Account Data</p>
                        <p className="text-sm text-muted-foreground">Download all your account information</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span>Danger Zone</span>
                  </h4>
                  <div className="border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>

                    {showDeleteConfirm && (
                      <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <p className="text-sm font-medium text-destructive mb-2">
                          Are you sure you want to delete your account?
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          This will permanently delete all your data including orders, reviews, and preferences. You
                          will receive a confirmation email before the deletion is processed.
                        </p>
                        <div className="flex space-x-2">
                          <Button variant="destructive" size="sm">
                            Yes, Delete My Account
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
