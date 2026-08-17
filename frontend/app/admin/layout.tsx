"use client"

import React, { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Star,
  Inbox,
  BarChart3,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Store,
  ChevronRight,
  ShieldAlert,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { adminApi, AdminUser } from "@/lib/admin-api"
import { STORE_INFO } from "@/lib/constants"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<AdminUser | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const [currentTime, setCurrentTime] = useState<string>("")

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthChecking(false)
      return
    }

    if (!adminApi.isAuthenticated()) {
      router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Set cached user immediately
    const currentUser = adminApi.getUser()
    setUser(currentUser)
    setIsAuthChecking(false)

    // Refresh profile & permissions dynamically in background
    adminApi.getMe()
      .then((freshUser) => {
        setUser(freshUser)
      })
      .catch(() => {})

    // Load initial unread count in background
    adminApi.getDashboard().then((data) => {
      setUnreadCount(data?.inventory_summary?.unread_messages || 0)
    }).catch(() => {})

    // Update live clock
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [isLoginPage])

  // Periodic subtle refresh of unread count (every 60s)
  useEffect(() => {
    if (isLoginPage) return
    const refreshUnread = () => {
      if (adminApi.isAuthenticated()) {
        adminApi.getDashboard().then((data) => {
          setUnreadCount(data?.inventory_summary?.unread_messages || 0)
        }).catch(() => {})
      }
    }
    const interval = setInterval(refreshUnread, 60000)
    return () => clearInterval(interval)
  }, [isLoginPage])

  const handleLogout = () => {
    adminApi.logout()
    router.push("/admin/login")
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-medium">Verifying Administrator Session...</p>
      </div>
    )
  }

  const allNavItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard, exact: true, permission: "dashboard.view" },
    { name: "Products", href: "/admin/products", icon: Package, permission: "products.view" },
    { name: "Categories", href: "/admin/categories", icon: FolderTree, permission: "categories.view" },
    { name: "Reviews", href: "/admin/reviews", icon: Star, permission: "reviews.view" },
    { name: "Messages", href: "/admin/messages", icon: Inbox, badge: unreadCount, permission: "messages.view" },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3, permission: "analytics.view" },
    { name: "Staff & Team", href: "/admin/staff", icon: Users, permission: "staff.view" },
    { name: "Store Content", href: "/admin/content", icon: Globe, permission: "content.view" },
    { name: "Settings", href: "/admin/settings", icon: Settings, permission: "settings.view" },
  ]

  // Filter navigation items strictly by active permissions
  const navItems = allNavItems.filter((item) => {
    if (!user) return false
    if (user.is_superuser || user.role === "owner") return true
    return user.permissions?.includes(item.permission)
  })

  const getPageTitle = () => {
    if (pathname === "/admin") return "Business Overview"
    if (pathname.startsWith("/admin/products")) return "Product Management"
    if (pathname.startsWith("/admin/categories")) return "Categories"
    if (pathname.startsWith("/admin/reviews")) return "Review Moderation"
    if (pathname.startsWith("/admin/messages")) return "Inquiries & Messages"
    if (pathname.startsWith("/admin/analytics")) return "Analytics & Conversions"
    if (pathname.startsWith("/admin/staff")) return "Staff & Access Control"
    if (pathname.startsWith("/admin/content")) return "Store Content & CMS"
    if (pathname.startsWith("/admin/settings")) return "Store Settings"
    return "Admin Workspace"
  }

  const getRoleBadge = (role?: string, isSuper?: boolean) => {
    if (isSuper || role === "owner") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          Owner
        </span>
      )
    }
    if (role === "manager") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
          Manager
        </span>
      )
    }
    if (role === "staff") {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          Staff
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
        Viewer
      </span>
    )
  }

  const renderNavLinks = (onItemClick?: () => void) => (
    <div className="space-y-1.5 px-3 py-4">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={true}
            onClick={onItemClick}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span>{item.name}</span>
            </div>

            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold shrink-0",
                  isActive
                    ? "bg-white text-primary"
                    : "bg-primary/15 text-primary"
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row text-foreground">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-card border-r border-border/80 shrink-0 sticky top-0 h-screen z-30 shadow-sm">
        {/* Brand Header */}
        <div className="p-5 border-b border-border/60">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-serif font-bold text-lg tracking-tight text-foreground leading-tight">
                {STORE_INFO.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Command Center
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto">
          {renderNavLinks()}
        </div>

        {/* Public Store & Logout Section */}
        <div className="p-3 border-t border-border/60 space-y-2 bg-muted/10">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </div>
            <span className="text-[10px] bg-muted-foreground/10 px-1.5 py-0.5 rounded text-muted-foreground font-mono">Live ↗</span>
          </Link>

          {/* Admin User Card with RBAC Badge */}
          <div className="pt-2 px-2 flex items-center justify-between border-t border-border/40">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-foreground truncate max-w-[90px]">
                    {user?.username || "Admin"}
                  </p>
                  {getRoleBadge(user?.role, user?.is_superuser)}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email || "Staff Member"}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-md border-b border-border/70 h-16 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Sheet Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-card border-r border-border flex flex-col">
                <div className="p-5 border-b border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
                      E
                    </div>
                    <div>
                      <div className="font-serif font-bold text-base">{STORE_INFO.name}</div>
                      <div className="text-[10px] text-muted-foreground">Admin Workspace</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {renderNavLinks(() => setIsMobileOpen(false))}
                </div>

                <div className="p-4 border-t border-border/60 space-y-3 bg-muted/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {user?.username ? user.username.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold truncate">{user?.username}</span>
                        {getRoleBadge(user?.role, user?.is_superuser)}
                      </div>
                      <div className="text-[10px] text-muted-foreground truncate">{user?.email}</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full text-xs font-semibold text-destructive hover:bg-destructive/10 rounded-xl justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Breadcrumb & Title */}
            <div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
                <span>Ebasi Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-foreground capitalize">{getPageTitle()}</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-none mt-0.5">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role indicator in header */}
            <div className="hidden sm:flex items-center">
              {getRoleBadge(user?.role, user?.is_superuser)}
            </div>

            {/* Current Time Badge */}
            {currentTime && (
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 text-xs font-medium text-muted-foreground border border-border/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{currentTime}</span>
              </div>
            )}

            {/* Inquiries Notification Link */}
            {adminApi.hasPermission("messages.view") && (
              <Link href="/admin/messages">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "relative h-9 px-3 rounded-xl border-border/70 text-xs font-medium transition-colors",
                    unreadCount > 0 ? "text-primary border-primary/30 bg-primary/5" : "text-muted-foreground"
                  )}
                >
                  <Inbox className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Inquiries</span>
                  {unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* View Store Button */}
            <Link href="/" target="_blank">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-xs font-medium rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground hidden sm:flex items-center gap-1.5"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Storefront</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
              </Button>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
