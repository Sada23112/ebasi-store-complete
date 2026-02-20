"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { getInstagramPosts, type InstagramPost } from "@/lib/instagram"

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInstagramPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-serif font-bold text-foreground">Shop The Look</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get inspired by our community and shop directly from Instagram
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-lg aspect-square block"
              >
                <Image
                  src={post.media_type === "VIDEO" ? (post.thumbnail_url || post.media_url) : post.media_url}
                  alt={post.caption || "Instagram post"}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-2">
                    <Instagram className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-xs line-clamp-2 mt-1 opacity-90">{post.caption}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Instagram className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Follow us on Instagram to see our latest styles!</p>
          </div>
        )}

        <div className="text-center">
          <a
            href="https://www.instagram.com/ebasistore_mekhelasador/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="px-8 bg-transparent hover:bg-muted">
              <Instagram className="h-4 w-4 mr-2" />
              Follow @ebasistore_mekhelasador
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
