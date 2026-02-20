import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Cookie, Settings, Shield, BarChart3, Target } from "lucide-react"

const cookieCategories = [
  {
    id: "essential",
    name: "Essential Cookies",
    description: "Required for the website to function properly",
    icon: Shield,
    required: true,
    examples: ["Authentication", "Shopping cart", "Security"],
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website",
    icon: BarChart3,
    required: false,
    examples: ["Google Analytics", "Page views", "User behavior"],
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "Used to deliver personalized advertisements",
    icon: Target,
    required: false,
    examples: ["Facebook Pixel", "Google Ads", "Retargeting"],
  },
  {
    id: "preferences",
    name: "Preference Cookies",
    description: "Remember your settings and preferences",
    icon: Settings,
    required: false,
    examples: ["Language", "Currency", "Theme"],
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Learn about how we use cookies and similar technologies on our website
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cookie className="w-5 h-5 text-primary" />
                <span>What Are Cookies?</span>
              </CardTitle>
              <CardDescription>
                Cookies are small text files that are placed on your device when you visit our website. They help us
                provide you with a better browsing experience by remembering your preferences and analyzing how you use
                our site.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie Preferences</CardTitle>
              <CardDescription>
                Manage your cookie preferences below. Essential cookies cannot be disabled as they are necessary for the
                website to function.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {cookieCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <category.icon className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{category.name}</h3>
                          {category.required && <Badge variant="secondary">Required</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {category.examples.map((example) => (
                            <Badge key={example} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id={category.id} disabled={category.required} defaultChecked={category.required} />
                      <Label htmlFor={category.id} className="sr-only">
                        {category.name}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button className="flex-1">Accept Selected</Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Accept All
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Reject All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Session Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  Temporary cookies that are deleted when you close your browser. These help maintain your session while
                  browsing our website.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  Cookies that remain on your device for a specified period or until you delete them. These remember
                  your preferences across visits.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">First-Party Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  Cookies set directly by our website to provide core functionality and improve your experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Third-Party Cookies</h4>
                <p className="text-muted-foreground text-sm">
                  Cookies set by external services we use, such as analytics providers and advertising networks.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Managing Your Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">You can control and manage cookies in several ways:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use our cookie preference center above</li>
                <li>Adjust your browser settings to block or delete cookies</li>
                <li>Use browser extensions that manage cookies</li>
                <li>Opt-out of specific third-party services</li>
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Disabling certain cookies may affect the functionality of our website and your
                  user experience.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Google Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    We use Google Analytics to understand how visitors use our website.
                  </p>
                  <Button variant="outline" size="sm">
                    Opt-out of Google Analytics
                  </Button>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Social Media Plugins</h4>
                  <p className="text-sm text-muted-foreground">
                    Our website includes social media sharing buttons that may set cookies from social media platforms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an
                updated revision date. We encourage you to review this policy periodically.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
