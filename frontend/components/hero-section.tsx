import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Instagram, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-background pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
      {/* Decorative subtle background gradient blob for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left side - Text content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary font-medium">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
                New Season Arrivals
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-[1.1] text-balance tracking-tight">
                Style that Speaks. <br/>
                <span className="text-primary drop-shadow-sm">Fashion that Lasts.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg text-pretty leading-relaxed">
                Discover the perfect blend of traditional elegance and modern style at EBASI STORE. Your destination for premium women's clothing, exquisite sarees, and timeless fashion pieces.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 animate-stagger-2 fill-mode-both">
              <Link href="/shop" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground premium-shadow hover:premium-shadow-hover transition-all duration-300 ease-out hover:-translate-y-1 rounded-xl">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg rounded-xl"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow Us
                </Button>
              </a>
            </div>
          </div>

          {/* Right side - Hero image with layered depth */}
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 animate-stagger-3 fill-mode-both">
            {/* Soft backdrop shadow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-50 transform -rotate-6 scale-105" />
            
            <div className="relative overflow-hidden rounded-2xl premium-shadow ring-1 ring-black/5 bg-muted group">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                alt="New Season Collection"
                className="w-full h-[550px] lg:h-[700px] object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
              />
              
              {/* Image Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80" />
              
              {/* Floating Card / Parallax Feel */}
              <div className="absolute bottom-8 left-8 right-8 transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                <div className="bg-white/95 backdrop-blur-md rounded-xl p-5 premium-shadow border border-white/20">
                  <h3 className="text-xl font-serif font-semibold text-foreground">Premium Collection</h3>
                  <p className="text-sm text-muted-foreground mt-1">Explore our handpicked curation of elegant pieces.</p>
                </div>
              </div>
            </div>
            
            {/* Decorative abstract elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
          
        </div>
      </div>
    </section>
  )
}
