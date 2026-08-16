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

function GalleryThumbnail({
    item,
    index,
    isCurrent,
    productName,
    onClick,
    onHover,
}: {
    item: MediaItem
    index: number
    isCurrent: boolean
    productName: string
    onClick: () => void
    onHover: () => void
}) {
    const [imgSrc, setImgSrc] = React.useState(item.url)

    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={onHover}
            aria-label={`View ${productName} image ${index + 1}`}
            aria-pressed={isCurrent}
            className={cn(
                "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary",
                isCurrent
                    ? "border-primary ring-2 ring-primary/30 shadow-md scale-105"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-border hover:scale-100"
            )}
        >
            {item.type === "image" ? (
                <Image
                    src={imgSrc}
                    alt={`${productName} thumbnail ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    onError={() => setImgSrc("/images/placeholders/placeholder.svg")}
                />
            ) : (
                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                    {item.thumbnail ? (
                        <Image
                            src={item.thumbnail}
                            alt={`${productName} video thumbnail ${index + 1}`}
                            fill
                            className="object-cover opacity-70"
                        />
                    ) : null}
                    <Play className="h-5 w-5 sm:h-6 sm:w-6 text-white absolute" fill="white" aria-hidden="true" />
                </div>
            )}
        </button>
    )
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
        <div className="flex flex-col-reverse md:flex-row gap-3 sm:gap-4">
            {/* Thumbnails */}
            {mediaItems.length > 1 && (
                <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-y-auto md:w-24 md:max-h-[500px] scrollbar-hide px-0.5 py-0.5">
                    {mediaItems.map((item, index) => (
                        <GalleryThumbnail
                            key={index}
                            item={item}
                            index={index}
                            isCurrent={current === index}
                            productName={productName}
                            onClick={() => handleThumbnailClick(index)}
                            onHover={() => handleThumbnailHover(index)}
                        />
                    ))}
                </div>
            )}

            {/* Main Carousel */}
            <div className="flex-1 relative md:sticky md:top-24">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent>
                        {mediaItems.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-muted border border-border/60 shadow-md transition-all duration-500">
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
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full md:hidden z-10 pointer-events-none">
                                {current + 1} / {mediaItems.length}
                            </div>
                        </>
                    )}
                </Carousel>
            </div>
        </div>
    )
}
