import type React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "skeleton-shimmer rounded-md relative overflow-hidden shrink-0",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
