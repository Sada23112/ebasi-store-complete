"use client"

import * as React from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { ZoomableImage } from "@/components/ui/zoom-image"
import { cn } from "@/lib/utils"

interface MediaItem {
    type: "image" | "video"
    url: string
    thumbnail?: string
}

interface ProductGalleryProps {
    mediaItems: MediaItem[]
    productName: string
}

export function ProductGallery({ mediaItems, productName }: ProductGalleryProps) {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const handleThumbnailClick = (index: number) => {
        if (api) {
            api.scrollTo(index)
        }
    }

    const handleThumbnailHover = (index: number) => {
        if (api) {
            api.scrollTo(index)
        }
    }

    if (!mediaItems.length) return null

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {mediaItems.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 md:max-h-[500px] scrollbar-hide px-1 py-1">
                    {mediaItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            onMouseEnter={() => handleThumbnailHover(index)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer active:scale-95",
                                current === index
                                    ? "border-primary ring-2 ring-primary/30 shadow-md scale-105"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:border-border hover:scale-100"
                            )}
                        >
                            {item.type === "image" ? (
                                <Image
                                    src={item.url}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-110"
                                />
                            ) : (
                                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                                    {item.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={`Video Thumbnail ${index + 1}`}
                                            fill
                                            className="object-cover opacity-70"
                                        />
                                    ) : null}
                                    <Play className="h-6 w-6 text-white absolute" fill="white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Main Carousel */}
            <div className="flex-1 relative sticky top-24">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {mediaItems.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted border border-border/60 shadow-md transition-all duration-500">
                                    {item.type === "image" ? (
                                        <ZoomableImage
                                            src={item.url}
                                            alt={`${productName} - Image ${index + 1}`}
                                            className="w-full h-full"
                                            priority={index === 0}
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            controls
                                            className="w-full h-full object-contain bg-black"
                                            poster={item.thumbnail}
                                        />
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {mediaItems.length > 1 && (
                        <>
                            <CarouselPrevious className="left-4 hidden md:flex hover:bg-primary hover:text-white transition-all" />
                            <CarouselNext className="right-4 hidden md:flex hover:bg-primary hover:text-white transition-all" />
                        </>
                    )}
                </Carousel>
            </div>
        </div>
    )
}
