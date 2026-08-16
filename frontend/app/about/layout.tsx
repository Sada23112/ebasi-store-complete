import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Heritage, Craftsmanship & Authentic Handlooms",
  description:
    "Learn about EBASI STORE's mission to celebrate the rich textile heritage of Assam and India, supporting traditional weavers and handcrafted fashion.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About EBASI STORE - Heritage, Craftsmanship & Authentic Handlooms",
    description:
      "Learn about EBASI STORE's mission to celebrate the rich textile heritage of Assam and India, supporting traditional weavers and handcrafted fashion.",
    url: "/about",
    type: "website",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
