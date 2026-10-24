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

  // Dynamic product routes from real database (paginates automatically if catalog exceeds page size)
  let productRoutes: MetadataRoute.Sitemap = []
  try {
    let nextUrl: string | null = `${API_BASE_URL}/products/?page_size=1000`
    while (nextUrl) {
      const res: Response = await fetch(nextUrl, {
        next: { revalidate: 3600 },
      })
      if (!res.ok) break
      const data: any = await res.json()
      const products = Array.isArray(data) ? data : (data.results || [])
      for (const p of products) {
        if (p.slug) {
          productRoutes.push({
            url: `${baseUrl}/product/${p.slug}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })
        }
      }
      nextUrl = Array.isArray(data) ? null : data.next
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
          lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
    }
  } catch (error) {
    console.error("Failed to generate dynamic category sitemap entries:", error)
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
