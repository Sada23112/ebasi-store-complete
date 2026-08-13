import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 h-full flex flex-col justify-between">
      <div className="relative bg-muted h-48 sm:h-80 w-full overflow-hidden rounded-t-2xl">
        <Skeleton className="w-full h-full rounded-t-2xl" />
        <Skeleton className="absolute top-3 right-3 h-8 w-8 rounded-full" />
        <Skeleton className="absolute top-3 left-3 h-5 w-16 rounded-md" />
      </div>
      <CardContent className="p-3 sm:p-5 flex flex-col justify-between flex-1 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded-sm" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-9 w-full rounded-lg mt-4" />
      </CardContent>
    </Card>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 pb-24 sm:pb-16">
        <div className="px-4 py-4 border-b">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="w-full h-[380px] sm:h-[500px] rounded-2xl" />
              <div className="flex gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-xl" />
                ))}
              </div>
            </div>

            {/* Product Details Skeleton */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 sm:h-10 w-4/5 rounded-lg" />
                <Skeleton className="h-4 w-36 rounded-md" />
              </div>

              <Skeleton className="h-16 w-full rounded-xl" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20 rounded-md" />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="flex gap-3 pt-2">
                <Skeleton className="h-12 flex-1 rounded-xl" />
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export function WishlistGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="overflow-hidden rounded-2xl border border-border/50">
          <Skeleton className="h-64 w-full rounded-none" />
          <CardContent className="p-5 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
