import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Saved Wishlist",
  description:
    "View your saved items, curated Mekhela Sadors, and traditional sarees at EBASI STORE. Easily order or inquire directly via WhatsApp.",
  alternates: {
    canonical: "/wishlist",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
