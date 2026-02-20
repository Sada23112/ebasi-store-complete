import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="pt-24 max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 15, 2024 | Effective Date: January 15, 2024</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Agreement to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Welcome to EBASI STORE. These Terms of Service ("Terms") govern your use of our website, mobile
                application, and services. By accessing or using our services, you agree to be bound by these Terms.
              </p>
              <p className="text-muted-foreground">
                If you do not agree to these Terms, please do not use our services. We reserve the right to modify these
                Terms at any time, and your continued use of our services constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          {/* Account Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Account Registration and Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Creation</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>You must be at least 18 years old to create an account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>You must provide accurate and complete information during registration</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>You are responsible for all activities that occur under your account</span>
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Account Responsibilities</h3>
                <p className="text-muted-foreground mb-3">You agree to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Keep your account information up to date</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Notify us immediately of any unauthorized use of your account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use your account only for lawful purposes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Not share your account with others</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Shopping and Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <span>Shopping and Orders</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Product Information</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      We strive to display accurate product information, including colors, sizes, and descriptions
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Colors may vary slightly due to monitor settings and photography</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>We reserve the right to correct any errors in product information or pricing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Order Acceptance</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>All orders are subject to acceptance and availability</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>We may refuse or cancel orders at our discretion</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Order confirmation does not guarantee product availability</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing and Availability</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Prices are subject to change without notice</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>All prices are in Indian Rupees (INR) and include applicable taxes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Product availability is not guaranteed until payment is processed</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span>Payment Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Accepted Payment Methods</h3>
                <p className="text-muted-foreground mb-3">We accept the following payment methods:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Credit Cards (Visa, MasterCard, American Express)</li>
                    <li>• Debit Cards</li>
                    <li>• Net Banking</li>
                    <li>• UPI (Unified Payments Interface)</li>
                  </ul>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Digital Wallets (Paytm, PhonePe, Google Pay)</li>
                    <li>• Cash on Delivery (COD)</li>
                    <li>• EMI Options</li>
                    <li>• Gift Cards</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Processing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Payment must be received before order processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>We use secure payment processing systems to protect your financial information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Failed payments may result in order cancellation</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-primary" />
                <span>Shipping and Delivery</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Policy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>We ship to addresses within India</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Shipping costs are calculated based on weight, size, and destination</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Free shipping may be available for orders above certain amounts</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Delivery times are estimates and may vary due to external factors</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Delivery Responsibility</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>You must provide accurate delivery information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Risk of loss transfers to you upon delivery</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>We are not responsible for delays caused by incorrect addresses</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span>Returns and Refunds</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Return Policy</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Returns must be initiated within 30 days of delivery</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Items must be in original condition with tags attached</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Some items may not be eligible for return (intimate wear, customized items)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Return shipping costs may apply unless the item is defective</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Refunds are processed within 5-7 business days after return approval</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Refunds are issued to the original payment method</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span>Shipping charges are non-refundable unless the return is due to our error</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <span>Prohibited Uses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You may not use our services for any unlawful purpose or to:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Violate any applicable laws or regulations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Infringe on intellectual property rights</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Transmit harmful or malicious code</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Engage in fraudulent activities</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Harass or harm other users</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Attempt to gain unauthorized access</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use automated systems to access our services</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Resell our products without authorization</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the property of
                EBASI STORE or our licensors and is protected by copyright, trademark, and other intellectual property
                laws.
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Your Rights</h4>
                  <p className="text-sm text-muted-foreground">
                    You may view, download, and print content for personal, non-commercial use only.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Restrictions</h4>
                  <p className="text-sm text-muted-foreground">
                    You may not modify, reproduce, distribute, or create derivative works from our content without
                    written permission.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                To the maximum extent permitted by law, EBASI STORE shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
              <p className="text-muted-foreground">
                Our total liability for any claim arising from your use of our services shall not exceed the amount you
                paid for the specific product or service giving rise to the claim.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>Governing Law and Jurisdiction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction of
                the courts in Mumbai, Maharashtra.
              </p>
              <p className="text-muted-foreground">
                We encourage you to contact us first to resolve any disputes informally before pursuing legal action.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                If you have any questions about these Terms of Service, please contact us:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="font-medium">Email: legal@ebasistore.com</p>
                  <p className="font-medium">Phone: +91 98765 43210</p>
                  <p className="font-medium">Business Hours: 9:00 AM - 6:00 PM IST</p>
                </div>
                <div>
                  <p className="font-medium mb-2">Mailing Address</p>
                  <div className="text-sm text-muted-foreground">
                    <p>EBASI STORE</p>
                    <p>Legal Department</p>
                    <p>123 Fashion Street</p>
                    <p>Mumbai, Maharashtra 400001</p>
                    <p>India</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
    </div>
  )
}
