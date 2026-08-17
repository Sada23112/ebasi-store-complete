"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useWishlist } from "@/lib/wishlist"

import { triggerNavigationStart } from "@/components/navigation-progress-bar"
import { STORE_INFO } from "@/lib/constants"
import { trackWhatsAppConversion, trackSearch } from "@/lib/analytics"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [animateBadge, setAnimateBadge] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { count: wishlistCount } = useWishlist()

  if (pathname?.startsWith('/admin')) {
    return null
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (wishlistCount > 0) {
      setAnimateBadge(true)
      const timer = setTimeout(() => setAnimateBadge(false), 400)
      return () => clearTimeout(timer)
    }
  }, [wishlistCount])

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      triggerNavigationStart()
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchExpanded(false)
      setSearchQuery("")
    }
  }

  const handleSearchExpand = () => {
    setIsSearchExpanded(true)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 150)
  }

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchExpanded) {
        setIsSearchExpanded(false)
        setSearchQuery("")
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        isSearchExpanded &&
        !searchQuery
      ) {
        setIsSearchExpanded(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchExpanded, searchQuery])

  return (
    <nav
      aria-label="Main Navigation"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "py-0 mt-2 sm:mt-3 mx-2 sm:mx-4 rounded-2xl shadow-md premium-shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30"
          : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/30 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
      )}
    >
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" aria-label="Ms Ebasi Store Home">
              <span className="text-xl sm:text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors cursor-pointer tracking-tight">
                EBASI STORE
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative group text-foreground/80 hover:text-foreground transition-colors duration-300 px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                >
                  {item.name}
                  <span className="absolute left-3 right-3 bottom-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left rounded-full" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search container */}
            <div ref={searchContainerRef} className="relative hidden sm:flex items-center">
              <div
                className={`flex items-center transition-all duration-300 ease-in-out ${isSearchExpanded ? "w-80 bg-background border border-border rounded-full shadow-lg" : "w-10"
                  }`}
              >
                {isSearchExpanded ? (
                  <form onSubmit={handleSearchSubmit} role="search" className="flex items-center w-full">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <input
                        ref={searchInputRef}
                        type="search"
                        aria-label="Search for products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for sarees, mekhela..."
                        className="w-full pl-10 pr-10 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          aria-label="Clear search input"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSearchExpand}
                    aria-label="Open search bar"
                    className="text-foreground transition-colors active:scale-95 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                  >
                    <Search className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Search</span>
                  </Button>
                )}
              </div>
              {isSearchExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSearchCollapse}
                  aria-label="Close search"
                  className="ml-2 text-foreground transition-colors active:scale-95 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              )}
            </div>

            {/* Wishlist Link with Badge */}
            <Link href="/wishlist" aria-label={`Saved Wishlist, ${wishlistCount} item${wishlistCount !== 1 ? 's' : ''}`}>
              <Button variant="ghost" size="icon" className="relative text-foreground transition-colors active:scale-95 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
                <Heart className="h-5 w-5" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center transition-transform",
                      animateBadge && "animate-badge-bounce"
                    )}
                    aria-hidden="true"
                  >
                    {wishlistCount}
                  </span>
                )}
                <span className="sr-only">Wishlist ({wishlistCount})</span>
              </Button>
            </Link>

            {/* WhatsApp CTA */}
            <a
              href={`${STORE_INFO.whatsappUrl}?text=${encodeURIComponent("Hi! I'm interested in your products.")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppConversion({ source: "navbar" })}
              aria-label="Order via WhatsApp directly"
              className="hidden sm:inline-flex"
            >
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-xs transition-all duration-300 active:scale-[0.98]">
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </Button>
            </a>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open mobile menu" className="md:hidden min-h-[44px] min-w-[44px]">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] max-w-[calc(100vw-2rem)] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2.5 text-lg font-medium min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <Link
                    href="/wishlist"
                    className="text-foreground hover:text-primary transition-colors duration-200 px-3 py-2.5 text-lg font-medium flex items-center justify-between min-h-[44px] focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" aria-hidden="true" /> Saved Wishlist
                    </span>
                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full" aria-label={`${wishlistCount} items`}>
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <div className="pt-4 border-t border-border">
                    <form onSubmit={handleSearchSubmit} role="search" className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <input
                          type="search"
                          aria-label="Search catalog"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search products..."
                          className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>
                    </form>
                  </div>

                  {/* WhatsApp CTA in mobile menu */}
                  <div className="pt-4 border-t border-border">
                    <a
                      href={`${STORE_INFO.whatsappUrl}?text=${encodeURIComponent("Hi! I'm interested in your products.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Order via WhatsApp"
                      onClick={() => {
                        setIsOpen(false)
                        trackWhatsAppConversion({ source: "mobile_menu" })
                      }}
                    >
                      <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium min-h-[44px]">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Order via WhatsApp
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
