import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { Promotions } from "@/components/promotions"
import { Testimonials } from "@/components/testimonials"
import { InstagramFeed } from "@/components/instagram-feed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Promotions />
        <Testimonials />
        <InstagramFeed />
      </main>
      
    </div>
  )
}
