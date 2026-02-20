import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "EBASI STORE - Premium Fashion & Traditional Wear",
    template: "%s | EBASI STORE",
  },
  description:
    "Discover elegant sarees, traditional Mekhela Sador, and contemporary women's fashion at EBASI STORE. Style that speaks, fashion that lasts.",
  keywords: [
    "sarees",
    "traditional wear",
    "Mekhela Sador",
    "women's fashion",
    "ethnic wear",
    "Indian clothing",
    "premium fashion",
  ],
  authors: [{ name: "EBASI STORE" }],
  creator: "EBASI STORE",
  publisher: "EBASI STORE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "EBASI STORE - Premium Fashion & Traditional Wear",
    description:
      "Discover elegant sarees, traditional Mekhela Sador, and contemporary women's fashion at EBASI STORE. Style that speaks, fashion that lasts.",
    siteName: "EBASI STORE",
    images: [
      {
        url: "/images/branding/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "EBASI STORE - Premium Fashion & Traditional Wear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EBASI STORE - Premium Fashion & Traditional Wear",
    description: "Discover elegant sarees, traditional Mekhela Sador, and contemporary women's fashion at EBASI STORE.",
    images: ["/images/branding/og-image.jpg"],
    creator: "@ebasistore",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  category: "fashion",
  generator: "v0.app",
}
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "EBASI STORE",
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"}/images/branding/logo.png`,
              description:
                "Premium fashion and traditional wear store specializing in sarees, Mekhela Sador, and contemporary women's fashion.",
              sameAs: [
                "https://facebook.com/ebasistore",
                "https://www.instagram.com/ebasistore_mekhelasador/",
                "https://twitter.com/ebasistore",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-XXXXXXXXXX",
                contactType: "customer service",
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navigation />
              <Suspense fallback={null}>{children}</Suspense>
              <Footer />
              <Toaster />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
