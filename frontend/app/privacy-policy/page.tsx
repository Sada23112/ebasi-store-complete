import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Globe, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 15, 2024 • Effective Date: January 15, 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Our Commitment to Your Privacy</span>
                </CardTitle>
                <CardDescription>
                  At EBASI STORE, we are committed to protecting your privacy and ensuring the security of your personal
                  information. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                  information when you visit our website and use our services.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Name, email address, phone number</li>
                    <li>Billing and shipping addresses</li>
                    <li>Payment information (processed securely by our payment partners)</li>
                    <li>Account credentials and preferences</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Browsing behavior and purchase history</li>
                    <li>Device information and IP address</li>
                    <li>Cookies and similar tracking technologies</li>
                    <li>Communication preferences and interactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send order confirmations, shipping updates, and important notices</li>
                  <li>Personalize your shopping experience and product recommendations</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Improve our website, products, and services</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Information Sharing and Disclosure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We do not sell, trade, or rent your personal information to third parties. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>With service providers who assist in our operations (payment processors, shipping companies)</li>
                  <li>When required by law or to protect our rights and safety</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and employee training</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Control cookie preferences</li>
                  <li>Request data portability</li>
                  <li>Lodge complaints with supervisory authorities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your information may be transferred to and processed in countries other than your own. We ensure
                  appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">privacy@ebasistore.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Data Protection Officer</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      
    </div>
  )
}
