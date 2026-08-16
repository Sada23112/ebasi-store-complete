import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetailClient } from "./product-detail-client"
import { API_BASE_URL } from "@/lib/constants"
import { getAbsoluteImageUrl } from "@/lib/utils"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}/`, {
      next: { revalidate: 60 },
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error("Error fetching product for metadata:", error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"

  if (!product || product.detail) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      robots: { index: false, follow: true },
    }
  }

  const title = product.meta_title || product.name
  const description =
    product.meta_description ||
    product.short_description ||
    `Buy ${product.name} online from EBASI STORE. Authentic Assamese handloom Mekhela Sador, sarees, and handcrafted traditional wear.`
  
  const primaryImage = product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image : null)
  const imageUrl = getAbsoluteImageUrl(primaryImage)
  const productUrl = `${baseUrl}/product/${slug}`

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "EBASI STORE",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"

  // Generate Schema.org Product Structured Data
  let productJsonLd: any = null
  let breadcrumbJsonLd: any = null

  if (product && !product.detail && product.id) {
    const primaryImage = product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image : null)
    const imageUrl = getAbsoluteImageUrl(primaryImage)
    const isOutOfStock = product.stock_status === "out_of_stock" || (product.stock_quantity !== undefined && product.stock_quantity <= 0)

    productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: imageUrl,
      description: product.description || product.short_description || product.name,
      sku: product.sku || undefined,
      brand: {
        "@type": "Brand",
        name: "EBASI STORE",
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/product/${slug}`,
        priceCurrency: "INR",
        price: product.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: isOutOfStock
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
        seller: {
          "@type": "ClothingStore",
          name: "Ms Ebasi Store",
          url: baseUrl,
        },
      },
    }

    if (product.average_rating && product.review_count && product.review_count > 0) {
      productJsonLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(product.average_rating),
        reviewCount: String(product.review_count),
      }
    }

    breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop",
          item: `${baseUrl}/shop`,
        },
        ...(product.category ? [
          {
            "@type": "ListItem",
            position: 3,
            name: product.category.name,
            item: `${baseUrl}/shop?category=${product.category.slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: product.name,
            item: `${baseUrl}/product/${slug}`,
          }
        ] : [
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${baseUrl}/product/${slug}`,
          }
        ])
      ],
    }
  }

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <ProductDetailClient slug={slug} initialProduct={product} />
    </>
  )
}
