"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Barsha D.",
    location: "Assam",
    rating: 5,
    comment:
      "The authentic Muga silk Mekhela Sador quality from Ms Ebasi Store is unmatched. The Guna zari work and weaving precision are exceptional.",
    product: "Muga Silk Mekhela Sador",
  },
  {
    id: 2,
    name: "Rupali D.",
    location: "Guwahati",
    rating: 5,
    comment:
      "Ordered a traditional Deori Egu-Jokasiba set via WhatsApp. The direct assistance and prompt dispatch from Dhemaji made the whole experience delightful.",
    product: "Deori Traditional Attire",
  },
  {
    id: 3,
    name: "Nabanita S.",
    location: "Delhi",
    rating: 5,
    comment:
      "Beautiful handloom texture and vibrant color. It feels wonderful supporting genuine traditional Northeast weavers through EBASI STORE.",
    product: "Handwoven Cotton Saree",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 lg:py-24 bg-muted/50 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who love our collection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
