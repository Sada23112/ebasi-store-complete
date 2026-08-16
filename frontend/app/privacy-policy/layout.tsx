import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about how EBASI STORE protects customer privacy, handles contact data, and ensures secure shopping.",
  alternates: {
    canonical: "/privacy-policy",
  },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
