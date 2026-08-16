import type { MetadataRoute } from "next"
import { API_BASE_URL } from "@/lib/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ebasistore.com"

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Dynamic product routes from real database
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_BASE_URL}/products/?page_size=100`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      const products = Array.isArray(data) ? data : (data.results || [])
      productRoutes = products
        .filter((p: any) => p.slug)
        .map((p: any) => ({
          url: `${baseUrl}/product/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
    }
  } catch (error) {
    console.error("Failed to generate dynamic product sitemap entries:", error)
  }

  // Dynamic category routes
  let categoryRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_BASE_URL}/categories/`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      const categories = Array.isArray(data) ? data : (data.results || [])
      categoryRoutes = categories
        .filter((c: any) => c.slug && c.slug !== "All")
        .map((c: any) => ({
          url: `${baseUrl}/shop?category=${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
    }
  } catch (error) {
    console.error("Failed to generate dynamic category sitemap entries:", error)
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
