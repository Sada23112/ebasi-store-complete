"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context" // Assuming auth-context exposes user/loading
import { Loader2 } from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (isLoading) return

        // Allow access to login page without auth
        if (pathname === "/admin/login") {
            setIsAuthorized(true)
            return
        }

        if (!user) {
            router.push("/admin/login")
            return
        }

        // In a real app, you'd check if user.role === 'admin'
        // For now, we just check if they are logged in
        setIsAuthorized(true)
    }, [user, isLoading, pathname, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Prevent flash of protected content
    if (!isAuthorized && pathname !== "/admin/login") {
        return null
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {children}
        </div>
    )
}
