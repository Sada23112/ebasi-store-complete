import { NextResponse } from "next/server"

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN

    if (!token) {
        return NextResponse.json(
            { error: "Instagram access token not configured" },
            { status: 500 }
        )
    }

    try {
        const response = await fetch(
            `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${token}&limit=6`,
            { next: { revalidate: 3600 } }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("Instagram API error:", response.status, errorData)
            return NextResponse.json(
                { error: "Failed to fetch from Instagram API" },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json({ data: data.data })
    } catch (error) {
        console.error("Error fetching Instagram posts:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
