"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft, SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <SearchX className="h-10 w-10 text-primary" />
          </div>
          <h1 className="font-serif text-6xl font-bold text-primary mb-2">404</h1>
          <h2 className="font-serif text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Link>
          </Button>
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
