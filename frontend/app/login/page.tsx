"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

function getGoogleOAuthURL() {
  const redirectUri = `${window.location.origin}/auth/google/callback`
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID || "",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "consent",
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState("")
  const [errorType, setErrorType] = useState<"general" | "no_account">("general")

  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/account"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setErrorType("general")

    try {
      await login(formData.email, formData.password)
      router.push(redirectTo)
    } catch (err: any) {
      const msg = err?.message || ""
      if (msg.includes("NO_ACCOUNT") || msg.includes("Invalid credentials")) {
        setErrorType("no_account")
        setError("No account found with these credentials.")
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError("Google login is not configured. Please contact support.")
      return
    }
    window.location.href = getGoogleOAuthURL()
  }

  return (
    <div className="min-h-screen bg-background">
      

      <main className="pt-20">
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Back Link */}
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <Image
                    src="/logo.png"
                    alt="Ebasi Store"
                    width={80}
                    height={80}
                    className="mx-auto"
                  />
                </div>
                <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
                <p className="text-muted-foreground">Sign in to your account to continue shopping</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error}
                      {errorType === "no_account" && (
                        <span className="block mt-1">
                          Don&apos;t have an account?{" "}
                          <Link href="/signup" className="text-primary hover:underline font-medium">
                            Create one now
                          </Link>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => handleChange("rememberMe", checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Google Login */}
                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    className="bg-transparent"
                    type="button"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-primary hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      
    </div>
  )
}
