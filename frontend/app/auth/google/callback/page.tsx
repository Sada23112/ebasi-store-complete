"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function GoogleCallbackPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { googleLogin } = useAuth()
    const [error, setError] = useState("")
    // Guard against React strict mode double-execution
    // Google auth codes are single-use and WILL fail on the second attempt
    const hasProcessed = useRef(false)

    useEffect(() => {
        // Prevent double-execution in React 18 strict mode
        if (hasProcessed.current) return
        hasProcessed.current = true

        const code = searchParams.get("code")
        const errorParam = searchParams.get("error")

        if (errorParam) {
            setError("Google sign-in was cancelled. Redirecting to login...")
            setTimeout(() => router.push("/login"), 2000)
            return
        }

        if (code) {
            handleGoogleCallback(code)
        } else {
            setError("No authorization code received. Redirecting...")
            setTimeout(() => router.push("/login"), 2000)
        }
    }, []) // empty deps — run once on mount

    const handleGoogleCallback = async (code: string) => {
        try {
            await googleLogin(code)
            router.push("/account")
        } catch (err: any) {
            console.error("Google callback error:", err)
            const msg = err.message || "Failed to sign in with Google."
            setError(msg)
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                {error ? (
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                            <span className="text-red-600 text-xl">✕</span>
                        </div>
                        <p className="text-red-600 font-medium">Google Sign-In Failed</p>
                        <p className="text-sm text-red-500">{error}</p>
                        <div className="flex gap-3 justify-center mt-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90"
                            >
                                Back to Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 border border-input rounded-md text-sm hover:bg-accent"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                        <p className="text-muted-foreground">Signing you in with Google...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
