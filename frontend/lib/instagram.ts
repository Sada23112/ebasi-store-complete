export interface InstagramPost {
    id: string
    caption: string
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
    media_url: string
    thumbnail_url?: string
    permalink: string
    like_count?: number
    timestamp?: string
}

export async function getInstagramPosts(): Promise<InstagramPost[]> {
    try {
        const baseUrl = typeof window !== "undefined"
            ? window.location.origin
            : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")

        const response = await fetch(`${baseUrl}/api/instagram`, {
            cache: "no-store",
        })

        if (!response.ok) {
            console.error("Failed to fetch Instagram posts:", response.status)
            return []
        }

        const json = await response.json()

        if (!json.data || !Array.isArray(json.data)) {
            return []
        }

        return json.data as InstagramPost[]
    } catch (error) {
        console.error("Error fetching Instagram posts:", error)
        return []
    }
}
