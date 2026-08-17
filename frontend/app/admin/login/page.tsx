"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { adminApi } from "@/lib/admin-api"
import { STORE_INFO } from "@/lib/constants"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams?.get("redirect") || "/admin"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // If already authenticated with staff credentials, redirect straight to admin dashboard
    if (adminApi.isAuthenticated()) {
      router.replace(redirectPath)
    }
  }, [router, redirectPath])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Please enter both username and password.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { user } = await adminApi.login(username.trim(), password)
      setIsSuccess(true)
      setTimeout(() => {
        router.push(redirectPath)
      }, 500)
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your credentials.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Top Bar Link */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Public Store
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Admin Portal
        </span>
      </div>

      <Card className="w-full max-w-md border-border/80 shadow-2xl rounded-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-4 pt-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            {STORE_INFO.name}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            Business & Store Operations Command Center
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-2">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5 animate-fade-in">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium">{error}</div>
            </div>
          )}

          {isSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-xs sm:text-sm font-medium">Authentication successful. Redirecting...</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Staff Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter staff username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 rounded-xl bg-background text-sm"
                  autoComplete="username"
                  required
                  disabled={isLoading || isSuccess}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl bg-background text-sm"
                  autoComplete="current-password"
                  required
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-md shadow-primary/25 transition-all mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Credentials...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Access Granted
                </span>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Restricted to authorized store managers & staff only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
