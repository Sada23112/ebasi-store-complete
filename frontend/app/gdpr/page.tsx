"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Shield, Download, Trash2, Edit, Eye, Clock, CheckCircle, AlertCircle, Users, Lock, Globe } from "lucide-react"

export default function GDPRPage() {
  const [requestType, setRequestType] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">GDPR Compliance</h1>
          <p className="text-muted-foreground">
            Your data protection rights under the General Data Protection Regulation
          </p>
        </div>

        <Tabs defaultValue="rights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="rights">Your Rights</TabsTrigger>
            <TabsTrigger value="requests">Data Requests</TabsTrigger>
            <TabsTrigger value="processing">Data Processing</TabsTrigger>
            <TabsTrigger value="contact">Contact DPO</TabsTrigger>
          </TabsList>

          <TabsContent value="rights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Your Data Protection Rights</span>
                </CardTitle>
                <CardDescription>
                  Under GDPR, you have several rights regarding your personal data. Learn about each right and how to
                  exercise them.
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Eye className="w-5 h-5 text-primary" />
                    <span>Right to Access</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You have the right to know what personal data we hold about you and how we use it.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Request a copy of your data</li>
                    <li>• Understand how we process it</li>
                    <li>• Know who we share it with</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Request My Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Edit className="w-5 h-5 text-primary" />
                    <span>Right to Rectification</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You can ask us to correct inaccurate or incomplete personal data.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Update incorrect information</li>
                    <li>• Complete missing data</li>
                    <li>• Ensure data accuracy</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Update My Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Trash2 className="w-5 h-5 text-primary" />
                    <span>Right to Erasure</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Also known as the "right to be forgotten" - you can request deletion of your personal data.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Delete unnecessary data</li>
                    <li>• Remove outdated information</li>
                    <li>• Exercise your right to be forgotten</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Delete My Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Download className="w-5 h-5 text-primary" />
                    <span>Right to Portability</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You can request your data in a structured, machine-readable format.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Export your data</li>
                    <li>• Transfer to another service</li>
                    <li>• Receive in common formats</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Export My Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Lock className="w-5 h-5 text-primary" />
                    <span>Right to Restrict Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You can ask us to limit how we use your personal data in certain circumstances.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Limit data processing</li>
                    <li>• Suspend certain activities</li>
                    <li>• Maintain data without using it</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Restrict Processing
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <span>Right to Object</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You can object to certain types of processing, including direct marketing.
                  </p>
                  <ul className="text-sm space-y-1 mb-4">
                    <li>• Stop marketing communications</li>
                    <li>• Object to profiling</li>
                    <li>• Opt-out of certain processing</li>
                  </ul>
                  <Button size="sm" variant="outline">
                    Object to Processing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Data Request</CardTitle>
                <CardDescription>
                  Use this form to exercise your data protection rights. We'll respond within 30 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Select Request Type</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: "access", label: "Access My Data", icon: Eye },
                      { id: "rectify", label: "Correct My Data", icon: Edit },
                      { id: "erase", label: "Delete My Data", icon: Trash2 },
                      { id: "portability", label: "Export My Data", icon: Download },
                      { id: "restrict", label: "Restrict Processing", icon: Lock },
                      { id: "object", label: "Object to Processing", icon: AlertCircle },
                    ].map((option) => (
                      <div
                        key={option.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          requestType === option.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                        }`}
                        onClick={() => setRequestType(option.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <option.icon className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Processing Timeline</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Request Acknowledgment:</span>
                      <span className="font-medium">Within 72 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Identity Verification:</span>
                      <span className="font-medium">1-3 business days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Request Processing:</span>
                      <span className="font-medium">Up to 30 days</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full" disabled={!requestType}>
                  Submit Request
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
                <CardDescription>Track the status of your data protection requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Data Export Request</p>
                        <p className="text-xs text-muted-foreground">Submitted on Jan 10, 2024</p>
                      </div>
                    </div>
                    <Badge variant="default" className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>Completed</span>
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Edit className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">Data Correction Request</p>
                        <p className="text-xs text-muted-foreground">Submitted on Jan 8, 2024</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Processing</span>
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How We Process Your Data</CardTitle>
                <CardDescription>Transparency about our data processing activities and legal bases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Legal Bases for Processing</h4>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-1">Contract Performance</h5>
                      <p className="text-sm text-muted-foreground">
                        Processing necessary to fulfill our contract with you (order processing, delivery, customer
                        service)
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-1">Legitimate Interest</h5>
                      <p className="text-sm text-muted-foreground">
                        Processing for our legitimate business interests (fraud prevention, website analytics, product
                        improvement)
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-1">Consent</h5>
                      <p className="text-sm text-muted-foreground">
                        Processing based on your explicit consent (marketing communications, cookies, newsletters)
                      </p>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-medium mb-1">Legal Obligation</h5>
                      <p className="text-sm text-muted-foreground">
                        Processing required by law (tax records, regulatory compliance, law enforcement requests)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Data Categories We Process</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Identity Data</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Name and contact details</li>
                        <li>• Account credentials</li>
                        <li>• Profile information</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Transaction Data</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Purchase history</li>
                        <li>• Payment information</li>
                        <li>• Delivery details</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Technical Data</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• IP address and device info</li>
                        <li>• Browser and usage data</li>
                        <li>• Cookies and tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Marketing Data</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Communication preferences</li>
                        <li>• Marketing responses</li>
                        <li>• Interest and behavior data</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Data Protection Officer</span>
                </CardTitle>
                <CardDescription>
                  Contact our Data Protection Officer for any privacy-related questions or concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Name:</strong> Rajesh Kumar
                      </p>
                      <p>
                        <strong>Title:</strong> Data Protection Officer
                      </p>
                      <p>
                        <strong>Email:</strong> dpo@ebasistore.com
                      </p>
                      <p>
                        <strong>Phone:</strong> +91 1800-123-4567
                      </p>
                      <p>
                        <strong>Response Time:</strong> Within 48 hours
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Office Address</h4>
                    <div className="text-sm text-muted-foreground">
                      <p>EBASI STORE Private Limited</p>
                      <p>Data Protection Office</p>
                      <p>123 Fashion Street</p>
                      <p>Mumbai, Maharashtra 400001</p>
                      <p>India</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">When to Contact Our DPO</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Questions about our privacy practices</li>
                    <li>• Concerns about data processing</li>
                    <li>• Complaints about privacy violations</li>
                    <li>• Requests for data protection impact assessments</li>
                    <li>• Guidance on exercising your rights</li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>Supervisory Authority</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    You also have the right to lodge a complaint with your local data protection authority:
                  </p>
                  <p className="text-sm">
                    <strong>India:</strong> Personal Data Protection Authority (when established)
                  </p>
                  <p className="text-sm">
                    <strong>EU:</strong> Your local Data Protection Authority
                  </p>
                </div>

                <Button className="w-full">Contact Data Protection Officer</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
