"use client"

import * as React from "react"
import Image from "next/image"
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize2,
    Minimize2,
    Sparkles,
    Film
} from "lucide-react"
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
    title?: string
}

interface ProductGalleryProps {
    mediaItems: MediaItem[]
    productName: string
}

interface ReelsVideoPlayerProps {
    url: string
    thumbnail?: string
    title?: string
    productName: string
    isActive: boolean
}

function ReelsVideoPlayer({
    url,
    thumbnail,
    title,
    productName,
    isActive,
}: ReelsVideoPlayerProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [isPlaying, setIsPlaying] = React.useState(false)
    const [isMuted, setIsMuted] = React.useState(true)
    const [progress, setProgress] = React.useState(0)
    const [showControls, setShowControls] = React.useState(true)
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const controlsTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    // Sync play/pause with carousel slide active status
    React.useEffect(() => {
        const vid = videoRef.current
        if (!vid) return

        if (isActive) {
            vid.muted = isMuted
            const playPromise = vid.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(() => {
                        // Browser policy prevented autoplay; user can click to play
                        setIsPlaying(false)
                    })
            }
        } else {
            vid.pause()
            setIsPlaying(false)
        }
    }, [isActive, isMuted])

    // Track fullscreen exit via Escape key
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener("fullscreenchange", handleFullscreenChange)
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    const handleTimeUpdate = () => {
        const vid = videoRef.current
        if (!vid || !vid.duration) return
        setProgress((vid.currentTime / vid.duration) * 100)
    }

    const togglePlay = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation()
        const vid = videoRef.current
        if (!vid) return
        if (vid.paused) {
            vid.play()
            setIsPlaying(true)
        } else {
            vid.pause()
            setIsPlaying(false)
        }
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        const vid = videoRef.current
        if (!vid) return
        const newMuted = !isMuted
        vid.muted = newMuted
        setIsMuted(newMuted)
    }

    const toggleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation()
        const container = containerRef.current
        if (!container) return

        if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
        } else {
            document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
        }
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        const vid = videoRef.current
        if (!vid || !vid.duration) return
        const rect = e.currentTarget.getBoundingClientRect()
        const pos = (e.clientX - rect.left) / rect.width
        vid.currentTime = Math.max(0, Math.min(1, pos)) * vid.duration
    }

    const triggerUserActivity = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false)
            }
        }, 3000)
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none group"
            onClick={togglePlay}
            onMouseMove={triggerUserActivity}
            onTouchStart={triggerUserActivity}
        >
            <video
                ref={videoRef}
                src={url}
                poster={thumbnail}
                playsInline
                loop
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain"
            />

            {/* Gradient Overlays for Reels styling */}
            <div
                className={cn(
                    "absolute inset-0 pointer-events-none transition-opacity duration-300",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Top Bar: Drape Reel Badge & Audio Toggle */}
            <div
                className={cn(
                    "absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 flex items-center justify-between z-20 transition-opacity duration-300",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-medium shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{title || "Authentic Drape & Sheen"}</span>
                </div>

                <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
                >
                    {isMuted ? (
                        <>
                            <VolumeX className="w-4 h-4 text-rose-300" />
                            <span className="hidden sm:inline text-[11px]">Unmute</span>
                        </>
                    ) : (
                        <>
                            <Volume2 className="w-4 h-4 text-emerald-300" />
                            <span className="hidden sm:inline text-[11px]">Sound On</span>
                        </>
                    )}
                </button>
            </div>

            {/* Center Play/Pause button pulse when paused */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform transform scale-100 animate-pulse">
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white ml-1" />
                    </div>
                </div>
            )}

            {/* Bottom Controls Bar */}
            <div
                className={cn(
                    "absolute bottom-2 inset-x-3 sm:bottom-3 sm:inset-x-4 flex flex-col gap-1.5 z-20 transition-opacity duration-300",
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                )}
            >
                {/* Progress bar */}
                <div
                    className="w-full h-1.5 bg-white/30 hover:h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
                    onClick={handleProgressClick}
                >
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between text-white text-[11px] pt-1">
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
                    >
                        {isPlaying ? (
                            <>
                                <Pause className="w-3.5 h-3.5 fill-current" />
                                <span>Pause</span>
                            </>
                        ) : (
                            <>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Play Drape</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/70 hidden sm:inline">
                            Handloom Texture in Motion
                        </span>
                        <button
                            type="button"
                            onClick={toggleFullscreen}
                            className="p-1 rounded hover:bg-white/10 transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-3.5 h-3.5" />
                            ) : (
                                <Maximize2 className="w-3.5 h-3.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
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
            aria-label={`View ${productName} ${item.type === "video" ? "drape video reel" : `image ${index + 1}`}`}
            aria-pressed={isCurrent}
            className={cn(
                "relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary group",
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
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => setImgSrc("/images/placeholders/placeholder.svg")}
                />
            ) : (
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    {item.thumbnail ? (
                        <Image
                            src={item.thumbnail}
                            alt={`${productName} video thumbnail ${index + 1}`}
                            fill
                            className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900 to-black" />
                    )}
                    <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                        <Play className="h-3.5 w-3.5 fill-white ml-0.5 text-white" aria-hidden="true" />
                    </div>
                    <div className="absolute bottom-1 inset-x-1 flex justify-center z-10 pointer-events-none">
                        <span className="text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-white bg-primary/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <Film className="w-2.5 h-2.5" /> REEL
                        </span>
                    </div>
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
                                        <ReelsVideoPlayer
                                            url={item.url}
                                            thumbnail={item.thumbnail}
                                            title={item.title}
                                            productName={productName}
                                            isActive={current === index}
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
