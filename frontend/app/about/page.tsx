"use client"

import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">About EBASI STORE</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Celebrating the beauty of traditional and contemporary fashion since our inception
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Story</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    EBASI STORE was born from a passion for preserving the rich textile heritage of India while embracing
                    contemporary fashion trends. Founded with the vision of making authentic, high-quality clothing
                    accessible to women everywhere, we have grown from a small boutique to a trusted name in ethnic and
                    modern fashion.
                  </p>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Our journey began with a simple belief: every woman deserves to feel confident and beautiful in what
                    she wears. Whether it's a traditional saree for a special occasion or contemporary wear for everyday
                    elegance, we curate pieces that celebrate femininity and individual style.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Today, EBASI STORE continues to bridge the gap between tradition and modernity, offering carefully
                    selected pieces that honor our cultural roots while embracing contemporary aesthetics.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="/images/placeholders/placeholder.svg?height=500&width=600"
                    alt="Our Story"
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Mission & Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  We are committed to empowering women through fashion while supporting traditional artisans and
                  sustainable practices
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal delay={100} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl">💎</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Quality First</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We source only the finest fabrics and work with skilled artisans to ensure every piece meets our
                      high standards of quality and craftsmanship.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl">🌱</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Sustainability</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We believe in responsible fashion. Our commitment to sustainability drives us to support
                      eco-friendly practices and ethical manufacturing processes.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="up">
                <Card className="text-center border border-border/50 shadow-sm hover:shadow-md transition-all h-full">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-4">Community Support</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We partner with local artisans and craftspeople, supporting traditional techniques while providing
                      fair wages and sustainable livelihoods.
                    </p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
                <p className="text-lg text-muted-foreground">The passionate individuals behind EBASI STORE</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal delay={100} direction="up">
                <div className="text-center">
                  <img
                    src="/images/placeholders/placeholder.svg?height=300&width=300"
                    alt="Founder"
                    className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg"
                  />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Priya Sharma</h3>
                  <p className="text-primary font-medium mb-3">Founder & CEO</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    With over 15 years in fashion retail, Priya founded EBASI STORE to celebrate the beauty of Indian
                    textiles and empower women through fashion.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200} direction="up">
                <div className="text-center">
                  <img
                    src="/images/placeholders/placeholder.svg?height=300&width=300"
                    alt="Creative Director"
                    className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg"
                  />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Anita Desai</h3>
                  <p className="text-primary font-medium mb-3">Creative Director</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A graduate from NIFT, Anita brings her expertise in textile design and contemporary fashion to curate
                    our unique collections.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300} direction="up">
                <div className="text-center">
                  <img
                    src="/images/placeholders/placeholder.svg?height=300&width=300"
                    alt="Operations Manager"
                    className="w-48 h-48 object-cover rounded-full mx-auto mb-6 shadow-lg"
                  />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Rajesh Kumar</h3>
                  <p className="text-primary font-medium mb-3">Operations Manager</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Rajesh ensures smooth operations and maintains our quality standards, working closely with our network
                    of artisans and suppliers.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary text-primary-foreground">
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold mb-4">Join Our Fashion Journey</h2>
              <p className="text-lg mb-8 opacity-90">
                Be part of our community and stay updated with the latest collections, exclusive offers, and fashion
                inspiration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop">
                  <Button className="bg-background text-foreground hover:bg-muted transition-colors font-medium h-auto py-3 px-8 text-base active:scale-95">
                    Shop Now
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  )
}
