import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-muted border-t-primary", sizeClasses[size], className)}
    />
  )
}

export function LoadingSpinner({
  text = "Loading...",
  size = "md",
}: {
  text?: string
  size?: "sm" | "md" | "lg"
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Spinner size={size} />
      <p className="text-muted-foreground text-sm">{text}</p>
    </div>
  )
}

export function FullPageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Spinner size="lg" />
        <p className="text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
