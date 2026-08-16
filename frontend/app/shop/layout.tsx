import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop Handcrafted Mekhela Sador & Sarees",
  description:
    "Explore our complete collection of authentic Assamese Mekhela Sadors, traditional silk sarees, and handcrafted women's wear at EBASI STORE.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Handcrafted Mekhela Sador & Sarees | EBASI STORE",
    description:
      "Explore our complete collection of authentic Assamese Mekhela Sadors, traditional silk sarees, and handcrafted women's wear.",
    url: "/shop",
    type: "website",
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
