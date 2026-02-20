import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Ear, Hand, Brain, Keyboard, MousePointer, Smartphone, Mail } from "lucide-react"

const accessibilityFeatures = [
  {
    icon: Eye,
    title: "Visual Accessibility",
    features: [
      "High contrast color schemes",
      "Scalable text and images",
      "Screen reader compatibility",
      "Alternative text for images",
      "Clear visual hierarchy",
    ],
  },
  {
    icon: Ear,
    title: "Audio Accessibility",
    features: [
      "Captions for video content",
      "Audio descriptions",
      "Visual indicators for audio cues",
      "Text alternatives for audio content",
    ],
  },
  {
    icon: Hand,
    title: "Motor Accessibility",
    features: [
      "Keyboard navigation support",
      "Large clickable areas",
      "Drag and drop alternatives",
      "Customizable interface controls",
    ],
  },
  {
    icon: Brain,
    title: "Cognitive Accessibility",
    features: [
      "Clear and simple language",
      "Consistent navigation",
      "Error prevention and correction",
      "Progress indicators",
      "Timeout warnings",
    ],
  },
]

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Accessibility Statement</h1>
          <p className="text-muted-foreground">
            EBASI STORE is committed to ensuring digital accessibility for people with disabilities
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Our Commitment</CardTitle>
              <CardDescription>
                We are committed to providing an inclusive shopping experience for all our customers. We strive to make
                our website accessible to everyone, regardless of ability or technology used.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="default">WCAG 2.1 AA Compliant</Badge>
                <Badge variant="outline">Continuously Improving</Badge>
              </div>
              <p className="text-muted-foreground">
                Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at the AA level.
                These guidelines help make web content more accessible to people with disabilities.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessibilityFeatures.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <category.icon className="w-5 h-5 text-primary" />
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Features</CardTitle>
              <CardDescription>Key accessibility features implemented on our website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Keyboard className="w-4 h-4 text-primary" />
                    <span>Keyboard Navigation</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Tab through all interactive elements</li>
                    <li>• Skip navigation links</li>
                    <li>• Keyboard shortcuts for common actions</li>
                    <li>• Visible focus indicators</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <MousePointer className="w-4 h-4 text-primary" />
                    <span>Mouse & Touch</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Large clickable areas (minimum 44px)</li>
                    <li>• Hover and focus states</li>
                    <li>• Touch-friendly interface</li>
                    <li>• Gesture alternatives</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span>Visual Design</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• High contrast ratios (4.5:1 minimum)</li>
                    <li>• Scalable text up to 200%</li>
                    <li>• Color is not the only indicator</li>
                    <li>• Consistent layout and navigation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    <span>Mobile Accessibility</span>
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Responsive design</li>
                    <li>• Touch target sizing</li>
                    <li>• Screen reader compatibility</li>
                    <li>• Orientation support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assistive Technology Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our website is designed to work with assistive technologies, including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li>• Screen readers (JAWS, NVDA, VoiceOver)</li>
                  <li>• Voice recognition software</li>
                  <li>• Switch navigation devices</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• Magnification software</li>
                  <li>• Alternative keyboards</li>
                  <li>• Eye-tracking devices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Known Issues & Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We are continuously working to improve accessibility. Currently known issues include:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Some third-party embedded content may not be fully accessible</li>
                <li>• PDF documents are being updated for better accessibility</li>
                <li>• Some complex interactive elements are being enhanced</li>
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg mt-4">
                <p className="text-sm">
                  <strong>Timeline:</strong> We are working to address these issues by March 2024.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We provide several tools to help customize your browsing experience:
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  Increase Text Size
                </Button>
                <Button variant="outline" size="sm">
                  High Contrast Mode
                </Button>
                <Button variant="outline" size="sm">
                  Reduce Motion
                </Button>
                <Button variant="outline" size="sm">
                  Focus Indicators
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feedback & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter any accessibility
                barriers or have suggestions for improvement, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">accessibility@ebasistore.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Phone: +91 1800-123-4567 (Toll-free)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Response time: Within 2 business days</span>
                </div>
              </div>
              <div className="mt-4">
                <Button>Report Accessibility Issue</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Standards We Follow</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</li>
                    <li>• Section 508 of the Rehabilitation Act</li>
                    <li>• Americans with Disabilities Act (ADA)</li>
                    <li>• European Accessibility Act (EAA)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Regular Testing</h4>
                  <p className="text-sm text-muted-foreground">
                    We conduct regular accessibility audits and testing with real users, including people with
                    disabilities, to ensure our website remains accessible and user-friendly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
