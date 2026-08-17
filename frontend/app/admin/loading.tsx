import React from "react"

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-4 w-72 bg-muted/60 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-muted rounded-xl animate-pulse" />
          <div className="h-9 w-28 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>

      {/* KPI Cards Placeholder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-card border border-border/70 rounded-2xl p-5 space-y-3 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-3.5 w-24 bg-muted rounded" />
              <div className="w-8 h-8 rounded-xl bg-muted/80" />
            </div>
            <div className="h-6 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Table/Card Skeleton */}
      <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-sm space-y-4 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-border/50">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-8 w-60 bg-muted rounded-xl" />
        </div>

        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-44 bg-muted rounded" />
                  <div className="h-3 w-28 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-4 w-20 bg-muted rounded hidden sm:block" />
              <div className="h-6 w-16 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
