"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Truck, RefreshCw, XCircle, Package } from "lucide-react"

interface ReturnStatusTrackerProps {
  returnId: string
  status:
    | "submitted"
    | "under-review"
    | "approved"
    | "rejected"
    | "pickup-scheduled"
    | "item-received"
    | "refund-processed"
  trackingId?: string
  estimatedRefundDate?: string
}

const statusSteps = [
  { key: "submitted", label: "Return Submitted", icon: Package },
  { key: "under-review", label: "Under Review", icon: Clock },
  { key: "approved", label: "Approved", icon: CheckCircle },
  { key: "pickup-scheduled", label: "Pickup Scheduled", icon: Truck },
  { key: "item-received", label: "Item Received", icon: Package },
  { key: "refund-processed", label: "Refund Processed", icon: RefreshCw },
]

export function ReturnStatusTracker({ returnId, status, trackingId, estimatedRefundDate }: ReturnStatusTrackerProps) {
  const currentStepIndex = statusSteps.findIndex((step) => step.key === status)
  const isRejected = status === "rejected"

  if (isRejected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <span>Return Request Rejected</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-destructive">
                Your return request has been reviewed and unfortunately cannot be processed at this time. Please contact
                customer support for more information.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">Return ID: {returnId}</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Return Status Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Return ID: {returnId}</span>
            {trackingId && <Badge variant="outline">Tracking: {trackingId}</Badge>}
          </div>

          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const isUpcoming = index > currentStepIndex

              return (
                <div key={step.key} className="flex items-center space-x-4">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary text-primary bg-primary/10"
                          : "border-muted-foreground/30 text-muted-foreground"
                    }
                  `}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && <p className="text-xs text-muted-foreground mt-1">Currently processing...</p>}
                  </div>

                  {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              )
            })}
          </div>

          {estimatedRefundDate && status !== "refund-processed" && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">Estimated refund date:</span> {estimatedRefundDate}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Refunds are typically processed within 5-7 business days after we receive your return.
              </p>
            </div>
          )}

          {status === "refund-processed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Refund Completed</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Your refund has been processed and should appear in your account within 2-3 business days.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
