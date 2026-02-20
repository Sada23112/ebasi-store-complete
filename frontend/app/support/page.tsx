"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Phone, Mail, Star, Search, ChevronRight, Video, AlertCircle } from "lucide-react"

const faqCategories = [
  {
    id: "orders",
    name: "Orders & Shipping",
    icon: "📦",
    questions: [
      {
        q: "How can I track my order?",
        a: "You can track your order by logging into your account and visiting the 'My Orders' section, or by using the tracking link sent to your email.",
      },
      {
        q: "What are the shipping charges?",
        a: "We offer free shipping on orders above ₹999. For orders below ₹999, shipping charges are ₹99 within India.",
      },
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3-5 business days. Express delivery (available in select cities) takes 1-2 business days.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Exchanges",
    icon: "🔄",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Items must be in original condition with tags attached.",
      },
      {
        q: "How do I initiate a return?",
        a: "You can initiate a return through your account dashboard or by contacting our customer service team.",
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are processed within 5-7 business days after we receive your returned item.",
      },
    ],
  },
  {
    id: "sizing",
    name: "Sizing & Fit",
    icon: "📏",
    questions: [
      {
        q: "How do I find my size?",
        a: "Use our size guide available on each product page. You can also chat with our styling experts for personalized recommendations.",
      },
      {
        q: "What if the size doesn't fit?",
        a: "We offer free size exchanges within 30 days. You can also use our virtual fitting tool for better size selection.",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Payment",
    icon: "👤",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click on 'Sign Up' at the top of our website and follow the simple registration process.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.",
      },
    ],
  },
]

const supportAgents = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Senior Customer Success Manager",
    avatar: "/agent-priya.jpg",
    rating: 4.9,
    reviews: 324,
    specialties: ["Orders", "Returns", "Product Info"],
    languages: ["English", "Hindi", "Marathi"],
    status: "online",
  },
  {
    id: 2,
    name: "Anjali Gupta",
    role: "Fashion Consultant",
    avatar: "/agent-anjali.jpg",
    rating: 4.8,
    reviews: 256,
    specialties: ["Styling", "Size Guide", "Trends"],
    languages: ["English", "Hindi", "Punjabi"],
    status: "online",
  },
  {
    id: 3,
    name: "Kavya Reddy",
    role: "Technical Support Specialist",
    avatar: "/agent-kavya.jpg",
    rating: 4.7,
    reviews: 189,
    specialties: ["Website Issues", "Account Help", "Payments"],
    languages: ["English", "Telugu", "Kannada"],
    status: "busy",
  },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("orders")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")

  const filteredFAQs =
    faqCategories
      .find((cat) => cat.id === selectedCategory)
      ?.questions.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Customer Support</h1>
          <p className="text-muted-foreground">We're here to help you with any questions or concerns</p>
        </div>

        <Tabs defaultValue="help" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="help">Help Center</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="agents">Our Team</TabsTrigger>
            <TabsTrigger value="ticket">Submit Ticket</TabsTrigger>
          </TabsList>

          <TabsContent value="help" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Live Chat</h3>
                  <p className="text-xs text-muted-foreground">Get instant help</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Call Us</h3>
                  <p className="text-xs text-muted-foreground">1800-123-4567</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Video Call</h3>
                  <p className="text-xs text-muted-foreground">Personal styling</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:border-primary/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Email</h3>
                  <p className="text-xs text-muted-foreground">support@ebasistore.com</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for help articles, FAQs, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories and Questions */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold mb-3">Categories</h3>
                {faqCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="lg:col-span-3">
                <h3 className="font-semibold mb-4">
                  {faqCategories.find((cat) => cat.id === selectedCategory)?.name} - Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>{faq.q}</span>
                          <ChevronRight className="w-4 h-4" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>Phone Support</span>
                  </CardTitle>
                  <CardDescription>Speak directly with our customer service team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">Customer Service</p>
                    <p className="text-sm text-muted-foreground">1800-123-4567 (Toll-free)</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                  <div>
                    <p className="font-semibold">Fashion Consultation</p>
                    <p className="text-sm text-muted-foreground">1800-123-4568</p>
                    <p className="text-xs text-muted-foreground">Mon-Sat, 10 AM - 8 PM</p>
                  </div>
                  <Button className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <span>Live Chat</span>
                  </CardTitle>
                  <CardDescription>Get instant help from our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">3 agents online</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Average response time: &lt; 2 minutes</p>
                    <p>Available 24/7</p>
                  </div>
                  <Button className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>Email Support</span>
                  </CardTitle>
                  <CardDescription>Send us a detailed message</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">General Support</p>
                    <p className="text-sm text-muted-foreground">support@ebasistore.com</p>
                  </div>
                  <div>
                    <p className="font-semibold">Business Inquiries</p>
                    <p className="text-sm text-muted-foreground">business@ebasistore.com</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Response time: Within 24 hours</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-primary" />
                    <span>Video Consultation</span>
                  </CardTitle>
                  <CardDescription>Personal styling and fit guidance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p>Book a 1-on-1 video session with our fashion experts</p>
                    <p>Duration: 30 minutes</p>
                    <p>Available: Mon-Sat, 10 AM - 6 PM</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Video className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meet Our Support Team</CardTitle>
                <CardDescription>Our experienced team is here to provide you with exceptional service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {supportAgents.map((agent) => (
                    <Card key={agent.id}>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="relative inline-block">
                            <Avatar className="w-16 h-16 mx-auto">
                              <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                agent.status === "online" ? "bg-green-500" : "bg-yellow-500"
                              }`}
                            ></div>
                          </div>
                          <h3 className="font-semibold mt-2">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground">{agent.role}</p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{agent.rating}</span>
                            <span className="text-sm text-muted-foreground">({agent.reviews} reviews)</span>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">Specialties:</p>
                            <div className="flex flex-wrap gap-1">
                              {agent.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-1">Languages:</p>
                            <p className="text-xs text-muted-foreground">{agent.languages.join(", ")}</p>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Video className="w-3 h-3 mr-1" />
                              Video
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ticket" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Ticket</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Submit a detailed support request and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ticket-category">Category</Label>
                    <select id="ticket-category" className="w-full mt-2 border rounded px-3 py-2">
                      <option>Select a category</option>
                      <option>Order Issues</option>
                      <option>Returns & Exchanges</option>
                      <option>Payment Problems</option>
                      <option>Website Issues</option>
                      <option>Product Information</option>
                      <option>Account Help</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select id="priority" className="w-full mt-2 border rounded px-3 py-2">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ticket-subject">Subject</Label>
                  <Input
                    id="ticket-subject"
                    placeholder="Brief description of your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="ticket-message">Message</Label>
                  <Textarea
                    id="ticket-message"
                    placeholder="Please provide detailed information about your issue..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="mt-2 min-h-32"
                  />
                </div>

                <div>
                  <Label>Attachments (Optional)</Label>
                  <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground">Drag and drop files here, or click to browse</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Response Time</p>
                      <p className="text-xs text-muted-foreground">
                        We typically respond to support tickets within 24 hours. High priority tickets are handled
                        within 4 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" disabled={!ticketSubject || !ticketMessage}>
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
