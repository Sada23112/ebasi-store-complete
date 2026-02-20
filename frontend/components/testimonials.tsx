"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    comment:
      "Absolutely love the quality of sarees from EBASI STORE. The fabric is premium and the designs are stunning. Highly recommended!",
    avatar: "/customer-priya.jpg",
    product: "Silk Saree Collection",
  },
  {
    id: 2,
    name: "Anita Patel",
    location: "Delhi",
    rating: 5,
    comment:
      "Fast delivery and excellent customer service. The kurti I ordered fits perfectly and the color is exactly as shown in the pictures.",
    avatar: "/customer-anita.jpg",
    product: "Designer Kurti",
  },
  {
    id: 3,
    name: "Meera Reddy",
    location: "Bangalore",
    rating: 5,
    comment:
      "EBASI STORE has become my go-to place for ethnic wear. The variety is amazing and the prices are very reasonable.",
    avatar: "/customer-meera.jpg",
    product: "Ethnic Wear Collection",
  },
]

export function Testimonials() {
  return (
    <section className="py-16 px-4 bg-muted/30">
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
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/images/placeholders/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
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
