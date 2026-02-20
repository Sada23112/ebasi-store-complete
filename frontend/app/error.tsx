"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Image src="/error-illustration.png" alt="Error" width={200} height={200} className="mx-auto mb-6" />
          <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="font-serif text-3xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-muted-foreground mb-8">
            We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
