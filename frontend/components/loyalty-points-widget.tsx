"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Coins, Crown, Star, Award, Trophy, TrendingUp, Gift } from "lucide-react"

interface LoyaltyWidgetProps {
  currentPoints?: number
  className?: string
}

const loyaltyTiers = [
  { name: "Silver", minPoints: 0, maxPoints: 999, icon: Star, color: "bg-gray-400" },
  { name: "Gold", minPoints: 1000, maxPoints: 4999, icon: Award, color: "bg-yellow-500" },
  { name: "Platinum", minPoints: 5000, maxPoints: 9999, icon: Crown, color: "bg-purple-500" },
  { name: "Diamond", minPoints: 10000, maxPoints: Number.POSITIVE_INFINITY, icon: Trophy, color: "bg-blue-500" },
]

export function LoyaltyPointsWidget({ currentPoints = 2750, className = "" }: LoyaltyWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [animatedPoints, setAnimatedPoints] = useState(0)

  const currentTier =
    loyaltyTiers.find((tier) => currentPoints >= tier.minPoints && currentPoints <= tier.maxPoints) || loyaltyTiers[0]

  const nextTier = loyaltyTiers.find((tier) => tier.minPoints > currentPoints)
  const progressToNext = nextTier
    ? ((currentPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100
    : 100

  // Animate points counter on mount
  useEffect(() => {
    const duration = 1000
    const steps = 50
    const increment = currentPoints / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= currentPoints) {
        setAnimatedPoints(currentPoints)
        clearInterval(timer)
      } else {
        setAnimatedPoints(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [currentPoints])

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? "shadow-lg" : ""} ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-lg">Rewards</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 p-0">
            <TrendingUp className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{animatedPoints.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Available Points</p>
          </div>
          <div className="text-right">
            <div
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${currentTier.color} text-white`}
            >
              <currentTier.icon className="w-3 h-3" />
              <span className="text-xs font-medium">{currentTier.name}</span>
            </div>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Progress to {nextTier.name}</span>
              <span className="text-xs text-muted-foreground">{nextTier.minPoints - currentPoints} to go</span>
            </div>
            <Progress value={progressToNext} className="h-1.5" />
          </div>
        )}

        {isExpanded && (
          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">This Month:</span>
                <span className="font-medium">+450 pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Redeemed:</span>
                <span className="font-medium">-200 pts</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1 h-8 text-xs">
                <Gift className="w-3 h-3 mr-1" />
                Redeem
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs bg-transparent">
                View All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
