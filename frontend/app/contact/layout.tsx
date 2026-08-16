import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us & Customer Support",
  description:
    "Get in touch with EBASI STORE for inquiries regarding Assamese Mekhela Sadors, sarees, custom tailoring, and direct WhatsApp customer support.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us & Store Inquiries | EBASI STORE",
    description:
      "Get in touch with EBASI STORE for inquiries regarding Assamese Mekhela Sadors, sarees, custom tailoring, and direct WhatsApp customer support.",
    url: "/contact",
    type: "website",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
