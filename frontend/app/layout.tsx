import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { STORE_INFO } from "@/lib/constants"
import { AnalyticsTracker } from "@/components/analytics-tracker"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

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
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { NavigationProgressBar } from "@/components/navigation-progress-bar"
import { StoreLocation } from "@/components/store-location"
import { StoreProvider } from "@/lib/store-context"

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
              "@type": "ClothingStore",
              name: "Ms Ebasi Store",
              alternateName: ["EBASI STORE", "EBASI ENTERPRISE"],
              url: process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com",
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"}/images/branding/logo.svg`,
              image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"}/images/branding/og-image.jpg`,
              description:
                "Authentic Assamese Mekhela Sadors, Deori Egu-Jokasiba, traditional sarees, and handcrafted women's fashion.",
              telephone: "+91 73992 91242",
              priceRange: "₹₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Railway, Station Rd, opposite Parmananda Academy, Nagakhelia No.2",
                addressLocality: "Dhemaji",
                addressRegion: "Assam",
                postalCode: "787057",
                addressCountry: "IN",
              },
              sameAs: [
                STORE_INFO.instagram.url,
                STORE_INFO.youtube.url,
                STORE_INFO.facebook.url,
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-7399291242",
                contactType: "customer service",
                availableLanguage: ["English", "Assamese", "Hindi"],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${inter.className} antialiased`}>
        <StoreProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary-foreground text-sm font-semibold transition-all"
          >
            Skip to main content
          </a>
          <NavigationProgressBar />
          <Navigation />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <Suspense fallback={null}>
            <div id="main-content" tabIndex={-1} className="focus:outline-none">
              {children}
            </div>
          </Suspense>
          <StoreLocation />
          <Footer />
          <Toaster />
          <Analytics />
        </StoreProvider>
      </body>
    </html>
  )
}
