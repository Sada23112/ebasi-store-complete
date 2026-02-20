import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MessageCircle } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "We offer free shipping on orders over ₹999. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in your account dashboard.",
        },
        {
          question: "What if I need to change my shipping address?",
          answer:
            "You can change your shipping address within 2 hours of placing your order. After that, please contact our customer service team.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day return policy for all items in original condition with tags attached. Custom or personalized items cannot be returned.",
        },
        {
          question: "How do I initiate a return?",
          answer:
            "Log into your account, go to 'My Orders', and click 'Return Item' next to the product you want to return. Follow the instructions to print a return label.",
        },
        {
          question: "When will I receive my refund?",
          answer:
            "Refunds are processed within 5-7 business days after we receive your returned item. The refund will be credited to your original payment method.",
        },
      ],
    },
    {
      category: "Products & Sizing",
      questions: [
        {
          question: "How do I find the right size?",
          answer:
            "Each product page has a detailed size chart. You can also use our virtual fitting tool or contact our style consultants for personalized sizing advice.",
        },
        {
          question: "Are your products authentic?",
          answer:
            "Yes, all our products are 100% authentic and sourced directly from authorized dealers and artisans. We guarantee the quality and authenticity of every item.",
        },
        {
          question: "Do you offer custom tailoring?",
          answer:
            "Yes, we offer custom tailoring services for select items. Additional charges and longer delivery times may apply. Contact us for more details.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search FAQs..." className="pl-10" />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="mb-8">
              <CardHeader>
                <CardTitle className="font-serif text-2xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">Our customer support team is here to help you 24/7.</p>
              <Button asChild className="w-full">
                <a href="/contact">Contact Support</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      
    </div>
  )
}
