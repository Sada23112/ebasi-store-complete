import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-background py-12 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight text-balance">
                Style that Speaks. <span className="text-primary">Fashion that Lasts.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg text-pretty">
                Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for
                premium women's clothing, exquisite sarees, and timeless fashion pieces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Shop Now
                </Button>
              </Link>
              <a
                href="https://www.instagram.com/ebasistore_mekhelasador/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent w-full"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow Us
                </Button>
              </a>
            </div>
          </div>

          {/* Right side - Hero image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg bg-muted">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                alt="New Season Collection"
                className="w-full h-[500px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-lg font-serif font-semibold text-foreground">New Season Collection</h3>
                  <p className="text-sm text-muted-foreground mt-1">Discover our latest arrivals</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
