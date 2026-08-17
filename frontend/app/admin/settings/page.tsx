"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  Settings,
  Store,
  ShieldCheck,
  Activity,
  ExternalLink,
  RefreshCw,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Lock,
  UserCheck,
  CheckCircle2,
  Server,
  Users
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminApi, AdminUser } from "@/lib/admin-api"
import { STORE_INFO, API_BASE_URL } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([])
  const [apiLatency, setApiLatency] = useState<number | null>(null)
  const [isPinging, setIsPinging] = useState<boolean>(false)
  const [pingStatus, setPingStatus] = useState<"ok" | "error" | null>(null)

  const checkApiHealth = async () => {
    setIsPinging(true)
    const start = performance.now()
    try {
      await adminApi.getDashboard()
      const end = performance.now()
      setApiLatency(Math.round(end - start))
      setPingStatus("ok")
    } catch {
      setPingStatus("error")
    } finally {
      setIsPinging(false)
    }
  }

  useEffect(() => {
    const user = adminApi.getUser()
    setCurrentUser(user)
    checkApiHealth()

    adminApi.getUsers().then((res) => {
      setStaffUsers(res.results || [])
    }).catch(() => {})
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
          Store & System Settings
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configuration, boutique parameters, backend diagnostics, and administrator access.
        </p>
      </div>

      {/* 1. BACKEND DIAGNOSTICS & SYSTEM STATUS */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                API & Backend Diagnostics
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Live communication status with the Django REST backend
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkApiHealth}
              disabled={isPinging}
              className="h-8 text-xs rounded-xl"
            >
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isPinging && "animate-spin")} />
              Ping API
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                API Endpoint
              </span>
              <span className="font-mono text-xs text-foreground font-bold truncate block mt-1">
                {API_BASE_URL}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                API Latency
              </span>
              <span className="font-mono text-xs text-foreground font-bold flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {apiLatency !== null ? `${apiLatency} ms` : "Measuring..."}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Django Admin Fallback
              </span>
              <a
                href={API_BASE_URL.replace("/api/v1", "/admin/")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary font-bold hover:underline flex items-center gap-1 mt-1"
              >
                <span>Open Raw Admin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. BOUTIQUE METADATA & PROFILE */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
            Boutique Information & Contact
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Public identity displayed across customer touchpoints and WhatsApp buttons
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="font-semibold text-muted-foreground">Store Name:</span>
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 font-bold text-foreground">
                {STORE_INFO.name} ({STORE_INFO.enterpriseName})
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-semibold text-muted-foreground">WhatsApp Hotline:</span>
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 font-mono font-bold text-foreground flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {STORE_INFO.phone}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-muted-foreground">Physical Boutique Location:</span>
            <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-foreground flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                {STORE_INFO.address.street}, {STORE_INFO.address.locality}, {STORE_INFO.address.city},{" "}
                {STORE_INFO.address.state} - {STORE_INFO.address.postalCode}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. STAFF ACCOUNTS & PERMISSIONS */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-serif font-bold text-foreground">
                Active Staff & Administrator Accounts
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Users authorized to access the Ebasi Business Dashboard
              </CardDescription>
            </div>
            {adminApi.hasPermission("staff.view") && (
              <Link href="/admin/staff">
                <Button variant="outline" size="sm" className="h-8 text-xs rounded-xl gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Manage Team</span>
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {staffUsers.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>{u.username}</span>
                      {currentUser?.id === u.id && (
                        <Badge variant="outline" className="text-[10px]">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="text-muted-foreground font-mono text-[11px]">{u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {u.is_superuser || u.role === "owner" ? (
                    <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]">
                      Owner
                    </Badge>
                  ) : u.role === "manager" ? (
                    <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 text-[10px]">
                      Manager
                    </Badge>
                  ) : u.role === "viewer" ? (
                    <Badge className="bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/30 text-[10px]">
                      Viewer
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">
                      Staff
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
