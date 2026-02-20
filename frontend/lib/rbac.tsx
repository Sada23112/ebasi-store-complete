"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

export type Permission =
  | "view_dashboard"
  | "manage_products"
  | "manage_orders"
  | "manage_users"
  | "manage_inventory"
  | "view_analytics"
  | "manage_settings"
  | "manage_returns"
  | "manage_gift_cards"
  | "manage_loyalty"
  | "manage_stores"
  | "view_reports"
  | "export_data"
  | "manage_roles"

export type Role = "super_admin" | "admin" | "manager" | "staff" | "viewer"

export interface UserRole {
  id: string
  userId: string
  role: Role
  permissions: Permission[]
  department?: string
  createdAt: string
  updatedAt: string
}

interface RBACContextType {
  userRole: UserRole | null
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasRole: (role: Role) => boolean
  isLoading: boolean
}

const RBACContext = createContext<RBACContextType | undefined>(undefined)

// Default role permissions
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
    "manage_users",
    "manage_inventory",
    "view_analytics",
    "manage_settings",
    "manage_returns",
    "manage_gift_cards",
    "manage_loyalty",
    "manage_stores",
    "view_reports",
    "export_data",
    "manage_roles",
  ],
  admin: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
    "manage_users",
    "manage_inventory",
    "view_analytics",
    "manage_returns",
    "manage_gift_cards",
    "manage_loyalty",
    "view_reports",
    "export_data",
  ],
  manager: [
    "view_dashboard",
    "manage_products",
    "manage_orders",
    "manage_inventory",
    "view_analytics",
    "manage_returns",
    "view_reports",
  ],
  staff: ["view_dashboard", "manage_orders", "manage_returns", "view_analytics"],
  viewer: ["view_dashboard", "view_analytics", "view_reports"],
}

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from API
      // For demo, assign admin role to logged-in users
      const mockUserRole: UserRole = {
        id: "role-1",
        userId: user.id,
        role: "admin",
        permissions: ROLE_PERMISSIONS.admin,
        department: "Operations",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUserRole(mockUserRole)
    } else {
      setUserRole(null)
    }
    setIsLoading(false)
  }, [user])

  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false
    return userRole.permissions.includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false
    return permissions.some((permission) => userRole.permissions.includes(permission))
  }

  const hasRole = (role: Role): boolean => {
    if (!userRole) return false
    return userRole.role === role
  }

  return (
    <RBACContext.Provider value={{ userRole, hasPermission, hasAnyPermission, hasRole, isLoading }}>
      {children}
    </RBACContext.Provider>
  )
}

export function useRBAC() {
  const context = useContext(RBACContext)
  if (context === undefined) {
    throw new Error("useRBAC must be used within an RBACProvider")
  }
  return context
}

// Permission Guard Component
interface PermissionGuardProps {
  permission: Permission | Permission[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = useRBAC()

  const hasAccess = Array.isArray(permission) ? hasAnyPermission(permission) : hasPermission(permission)

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
