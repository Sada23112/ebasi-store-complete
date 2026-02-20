"use client"

import { Badge } from "@/components/ui/badge"
import { Star, Award, Crown, Trophy } from "lucide-react"

interface LoyaltyTierBadgeProps {
  tier: "Silver" | "Gold" | "Platinum" | "Diamond"
  points?: number
  size?: "sm" | "md" | "lg"
  showPoints?: boolean
}

const tierConfig = {
  Silver: { icon: Star, color: "bg-gray-400", textColor: "text-gray-700" },
  Gold: { icon: Award, color: "bg-yellow-500", textColor: "text-yellow-700" },
  Platinum: { icon: Crown, color: "bg-purple-500", textColor: "text-purple-700" },
  Diamond: { icon: Trophy, color: "bg-blue-500", textColor: "text-blue-700" },
}

export function LoyaltyTierBadge({ tier, points, size = "md", showPoints = false }: LoyaltyTierBadgeProps) {
  const config = tierConfig[tier]
  const Icon = config.icon

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center space-x-1 border-0 ${config.color} text-white ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      <span className="font-medium">{tier}</span>
      {showPoints && points && <span className="text-xs opacity-90">({points.toLocaleString()} pts)</span>}
    </Badge>
  )
}
