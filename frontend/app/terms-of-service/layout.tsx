import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms of service, ordering policies, and customer guidelines for purchasing from EBASI STORE.",
  alternates: {
    canonical: "/terms-of-service",
  },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
