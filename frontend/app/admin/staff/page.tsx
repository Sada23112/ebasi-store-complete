"use client"

import React, { useState, useEffect } from "react"
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Key,
  UserX,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  History,
  Check,
  ChevronDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminUser, StaffRole, AuditLogItem, CreateStaffPayload, UpdateStaffPayload } from "@/lib/admin-api"
import { cn } from "@/lib/utils"

export default function AdminStaffPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [staffList, setStaffList] = useState<AdminUser[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<"staff" | "audit">("staff")

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Selected Target Staff Member
  const [selectedStaff, setSelectedStaff] = useState<AdminUser | null>(null)
  const [selectedStaffLogs, setSelectedStaffLogs] = useState<AuditLogItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Form States - Create
  const [createUsername, setCreateUsername] = useState("")
  const [createEmail, setCreateEmail] = useState("")
  const [createPassword, setCreatePassword] = useState("")
  const [createShowPassword, setCreateShowPassword] = useState(false)
  const [createFirstName, setCreateFirstName] = useState("")
  const [createLastName, setCreateLastName] = useState("")
  const [createRole, setCreateRole] = useState<StaffRole>("staff")
  const [createPhone, setCreatePhone] = useState("")
  const [createNotes, setCreateNotes] = useState("")
  const [createIsActive, setCreateIsActive] = useState(true)

  // Form States - Edit
  const [editFirstName, setEditFirstName] = useState("")
  const [editLastName, setEditLastName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editNotes, setEditNotes] = useState("")

  // Form States - Role Change
  const [targetRole, setTargetRole] = useState<StaffRole>("staff")

  // Form States - Password Reset
  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [staffRes, auditRes] = await Promise.all([
        adminApi.getStaff({
          search: searchQuery,
          role: roleFilter !== "all" ? roleFilter : undefined,
          is_active: statusFilter !== "all" ? statusFilter : undefined,
        }),
        adminApi.getAuditLogs({ limit: 50 }),
      ])
      setStaffList(staffRes.results || [])
      setAuditLogs(auditRes.results || [])
    } catch (err: any) {
      setError(err.message || "Failed to load staff accounts.")
    } finally {
      setIsLoading(false)
    }
  }

  const isInitialMount = React.useRef(true)

  useEffect(() => {
    const user = adminApi.getUser()
    setCurrentUser(user)
    loadData()
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const timer = setTimeout(() => {
      loadData()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, roleFilter, statusFilter])

  // Clear toast notifications after 4 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [actionSuccess])

  // Open Modals
  const openCreateModal = () => {
    setCreateUsername("")
    setCreateEmail("")
    setCreatePassword("")
    setCreateFirstName("")
    setCreateLastName("")
    setCreateRole("staff")
    setCreatePhone("")
    setCreateNotes("")
    setCreateIsActive(true)
    setActionError(null)
    setIsCreateModalOpen(true)
  }

  const openEditModal = (staff: AdminUser) => {
    setSelectedStaff(staff)
    setEditFirstName(staff.first_name || "")
    setEditLastName(staff.last_name || "")
    setEditEmail(staff.email || "")
    setEditPhone(staff.phone || "")
    setEditNotes(staff.notes || "")
    setActionError(null)
    setIsEditModalOpen(true)
  }

  const openRoleModal = (staff: AdminUser) => {
    setSelectedStaff(staff)
    setTargetRole((staff.role as StaffRole) || "staff")
    setActionError(null)
    setIsRoleModalOpen(true)
  }

  const openPasswordModal = (staff: AdminUser) => {
    setSelectedStaff(staff)
    setNewPassword("")
    setActionError(null)
    setIsPasswordModalOpen(true)
  }

  const openStatusModal = (staff: AdminUser) => {
    setSelectedStaff(staff)
    setActionError(null)
    setIsStatusModalOpen(true)
  }

  const openDetailsModal = async (staff: AdminUser) => {
    setSelectedStaff(staff)
    try {
      const logs = await adminApi.getStaffActivity(staff.id)
      setSelectedStaffLogs(logs || [])
    } catch {
      setSelectedStaffLogs([])
    }
    setIsDetailsModalOpen(true)
  }

  // Handle Actions
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createUsername.trim() || !createEmail.trim() || !createPassword) {
      setActionError("Please fill in all required fields (username, email, password).")
      return
    }

    setIsSubmitting(true)
    setActionError(null)
    try {
      await adminApi.createStaff({
        username: createUsername.trim(),
        email: createEmail.trim(),
        password: createPassword,
        first_name: createFirstName.trim(),
        last_name: createLastName.trim(),
        role: createRole,
        phone: createPhone.trim(),
        notes: createNotes.trim(),
        is_active: createIsActive,
      })
      setIsCreateModalOpen(false)
      setActionSuccess(`Staff member '${createUsername}' created successfully.`)
      loadData()
    } catch (err: any) {
      setActionError(err.message || "Failed to create staff member.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff) return

    setIsSubmitting(true)
    setActionError(null)
    try {
      await adminApi.updateStaff(selectedStaff.id, {
        first_name: editFirstName.trim(),
        last_name: editLastName.trim(),
        email: editEmail.trim(),
        phone: editPhone.trim(),
        notes: editNotes.trim(),
      })
      setIsEditModalOpen(false)
      setActionSuccess(`Updated details for '${selectedStaff.username}'.`)
      loadData()
    } catch (err: any) {
      setActionError(err.message || "Failed to update staff member.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff) return

    setIsSubmitting(true)
    setActionError(null)
    try {
      const res = await adminApi.changeStaffRole(selectedStaff.id, targetRole)
      setIsRoleModalOpen(false)
      setActionSuccess(res.message || `Role updated successfully to ${targetRole}.`)
      loadData()
    } catch (err: any) {
      setActionError(err.message || "Failed to change role.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaff || !newPassword) {
      setActionError("Please enter a new password.")
      return
    }

    setIsSubmitting(true)
    setActionError(null)
    try {
      const res = await adminApi.resetStaffPassword(selectedStaff.id, newPassword)
      setIsPasswordModalOpen(false)
      setActionSuccess(res.message || `Password reset for '${selectedStaff.username}'.`)
    } catch (err: any) {
      setActionError(err.message || "Failed to reset password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!selectedStaff) return

    setIsSubmitting(true)
    setActionError(null)
    try {
      if (selectedStaff.is_active) {
        const res = await adminApi.deactivateStaff(selectedStaff.id)
        setActionSuccess(res.message || `Account '${selectedStaff.username}' deactivated.`)
      } else {
        const res = await adminApi.activateStaff(selectedStaff.id)
        setActionSuccess(res.message || `Account '${selectedStaff.username}' activated.`)
      }
      setIsStatusModalOpen(false)
      loadData()
    } catch (err: any) {
      setActionError(err.message || "Failed to change account status.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Permission Guard Check
  const canManageStaff = adminApi.hasPermission("staff.create") || adminApi.isOwner()

  if (!adminApi.hasPermission("staff.view") && !adminApi.isOwner()) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-serif text-foreground">Access Restricted</h2>
        <p className="text-xs text-muted-foreground">
          You do not have permission to view or manage staff accounts. This section is restricted to Owner / Super Admin accounts.
        </p>
      </div>
    )
  }

  // Role Badges
  const renderRoleBadge = (role?: string, isSuper?: boolean) => {
    if (isSuper || role === "owner") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          Owner / Super Admin
        </span>
      )
    }
    if (role === "manager") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
          Manager
        </span>
      )
    }
    if (role === "staff") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          Staff
        </span>
      )
    }
    if (role === "viewer") {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border border-zinc-500/30">
          Viewer (Read-Only)
        </span>
      )
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground">
        Staff
      </span>
    )
  }

  // Stats calculation
  const totalStaff = staffList.length
  const ownerCount = staffList.filter((s) => s.is_superuser || s.role === "owner").length
  const managerCount = staffList.filter((s) => s.role === "manager" && !s.is_superuser).length
  const activeCount = staffList.filter((s) => s.is_active).length
  const inactiveCount = staffList.filter((s) => !s.is_active).length

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Toast Feedback */}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-fade-in shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Staff & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage team accounts, assign explicit RBAC roles, enforce security controls, and inspect audit activity.
          </p>
        </div>

        {canManageStaff && (
          <Button
            onClick={openCreateModal}
            className="rounded-xl shadow-md shadow-primary/20 text-xs font-semibold h-10 px-4 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </Button>
        )}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Total Team
            </span>
            <div className="text-2xl font-bold font-serif text-foreground mt-1">{totalStaff}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Owners
            </span>
            <div className="text-2xl font-bold font-serif text-foreground mt-1">{ownerCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Managers
            </span>
            <div className="text-2xl font-bold font-serif text-foreground mt-1">{managerCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Active
            </span>
            <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1">{activeCount}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 shadow-sm bg-card col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Deactivated
            </span>
            <div className="text-2xl font-bold font-serif text-muted-foreground mt-1">{inactiveCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3">
        <Button
          variant={activeTab === "staff" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("staff")}
          className={cn(
            "rounded-xl text-xs font-semibold h-9 px-4 gap-2",
            activeTab === "staff" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          <Users className="w-4 h-4" />
          <span>Team Accounts ({staffList.length})</span>
        </Button>

        {adminApi.hasPermission("audit.view") && (
          <Button
            variant={activeTab === "audit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("audit")}
            className={cn(
              "rounded-xl text-xs font-semibold h-9 px-4 gap-2",
              activeTab === "audit" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            )}
          >
            <History className="w-4 h-4" />
            <span>Audit Activity ({auditLogs.length})</span>
          </Button>
        )}
      </div>

      {activeTab === "staff" && (
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
          {/* Table Filters Bar */}
          <div className="p-4 border-b border-border/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, username, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Roles</option>
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
                <option value="viewer">Viewer</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="true">Active Only</option>
                <option value="false">Deactivated Only</option>
              </select>

              <Button
                variant="outline"
                size="icon"
                onClick={loadData}
                disabled={isLoading}
                className="h-9 w-9 rounded-xl shrink-0"
                title="Refresh"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="py-3.5 px-4">Staff Member</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">RBAC Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Login</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32 rounded" />
                            <Skeleton className="h-3 w-40 rounded" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-24 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-5 w-14 rounded-full" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-3.5 px-4"><Skeleton className="h-4 w-20 rounded" /></td>
                      <td className="py-3.5 px-4 text-right"><Skeleton className="h-8 w-16 rounded-lg ml-auto" /></td>
                    </tr>
                  ))
                ) : staffList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-muted-foreground">
                      No staff accounts found matching your filters.
                    </td>
                  </tr>
                ) : (
                  staffList.map((member) => {
                    const isSelf = currentUser?.id === member.id
                    const isOwnerMember = member.is_superuser || member.role === "owner"

                    return (
                      <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                        {/* Member Identity */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                              {member.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-foreground flex items-center gap-1.5">
                                <span>{member.first_name ? `${member.first_name} ${member.last_name || ""}` : member.username}</span>
                                {isSelf && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/40 text-primary">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-muted-foreground font-mono text-[11px]">@{member.username}</div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3.5 px-4 font-mono text-[11px] text-muted-foreground">
                          {member.email}
                        </td>

                        {/* Role */}
                        <td className="py-3.5 px-4">
                          {renderRoleBadge(member.role, member.is_superuser)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {member.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Deactivated
                            </span>
                          )}
                        </td>

                        {/* Last Login */}
                        <td className="py-3.5 px-4 text-[11px] text-muted-foreground">
                          {member.last_login ? new Date(member.last_login).toLocaleDateString() : "Never"}
                        </td>

                        {/* Created Date */}
                        <td className="py-3.5 px-4 text-[11px] text-muted-foreground">
                          {member.date_joined ? new Date(member.date_joined).toLocaleDateString() : "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View details */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsModal(member)}
                              className="h-8 px-2 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                              title="View Details"
                            >
                              <History className="w-3.5 h-3.5" />
                            </Button>

                            {canManageStaff && (
                              <>
                                {/* Edit Details */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(member)}
                                  className="h-8 px-2 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Information"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Button>

                                {/* Change Role */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openRoleModal(member)}
                                  className="h-8 px-2 text-xs rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                                  title="Change Role"
                                >
                                  <Shield className="w-3.5 h-3.5" />
                                </Button>

                                {/* Reset Password */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openPasswordModal(member)}
                                  className="h-8 px-2 text-xs rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Reset Password"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </Button>

                                {/* Deactivate / Activate */}
                                {!isSelf && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openStatusModal(member)}
                                    className={cn(
                                      "h-8 px-2 text-xs rounded-lg",
                                      member.is_active
                                        ? "text-rose-500 hover:bg-rose-500/10"
                                        : "text-emerald-600 hover:bg-emerald-500/10"
                                    )}
                                    title={member.is_active ? "Deactivate Account" : "Activate Account"}
                                  >
                                    {member.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-base font-serif font-bold text-foreground">
              Audit & Activity Trail
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Authoritative log of administrative mutations, role changes, and security events.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40 text-xs">
              {auditLogs.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No audit logs recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-muted/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{log.actor_username || "System"}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary">
                          {log.action}
                        </span>
                        {log.target_repr && (
                          <span className="text-muted-foreground">→ {log.target_repr}</span>
                        )}
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="font-mono text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded-lg">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>

                    <div className="text-muted-foreground text-[11px] font-mono shrink-0">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 1. CREATE STAFF MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              Add New Staff Member
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a dedicated staff account and assign their operational RBAC role.
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">First Name</label>
                <Input
                  value={createFirstName}
                  onChange={(e) => setCreateFirstName(e.target.value)}
                  placeholder="e.g. Rahul"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Last Name</label>
                <Input
                  value={createLastName}
                  onChange={(e) => setCreateLastName(e.target.value)}
                  placeholder="e.g. Das"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Username *</label>
                <Input
                  value={createUsername}
                  onChange={(e) => setCreateUsername(e.target.value)}
                  placeholder="e.g. rahul_das"
                  required
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Email Address *</label>
                <Input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="e.g. rahul@ebasistore.com"
                  required
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Initial Password *</label>
              <div className="relative">
                <Input
                  type={createShowPassword ? "text" : "password"}
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="h-9 pr-10 text-xs rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setCreateShowPassword(!createShowPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {createShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Assign Role *</label>
              <select
                value={createRole}
                onChange={(e) => setCreateRole(e.target.value as StaffRole)}
                className="w-full h-9 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="staff">Staff (Catalog, Reviews & Inquiries)</option>
                <option value="manager">Manager (Catalog, Categories, Analytics, Moderation)</option>
                <option value="viewer">Viewer (Read-Only across all store data)</option>
                <option value="owner">Owner / Super Admin (Full Unrestricted Access)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Contact Phone</label>
                <Input
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Initial Status</label>
                <div className="flex items-center gap-2 h-9">
                  <input
                    type="checkbox"
                    id="createActive"
                    checked={createIsActive}
                    onChange={(e) => setCreateIsActive(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary w-4 h-4"
                  />
                  <label htmlFor="createActive" className="text-xs font-medium cursor-pointer">
                    Account is Active
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting ? "Creating..." : "Create Staff Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. EDIT STAFF DETAILS MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              Edit Staff Profile: @{selectedStaff?.username}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update personal details and contact records.
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateStaff} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">First Name</label>
                <Input
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Last Name</label>
                <Input
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Email Address</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Phone</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+91..."
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Internal Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={2}
                placeholder="Optional notes regarding role or assignments..."
                className="w-full p-2.5 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. CHANGE ROLE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              Modify Role: @{selectedStaff?.username}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign a new role and configure access boundaries for this account.
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <form onSubmit={handleChangeRole} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Select New Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as StaffRole)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring font-medium"
              >
                <option value="owner">Owner / Super Admin (Unrestricted Access)</option>
                <option value="manager">Manager (Catalog, Categories, Analytics, Moderation)</option>
                <option value="staff">Staff (Catalog, Reviews, Messages)</option>
                <option value="viewer">Viewer (Read-Only)</option>
              </select>
            </div>

            {/* Role Consequences Explainer */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
              <span className="text-[11px] font-bold text-foreground block">
                Privilege Consequences:
              </span>
              {targetRole === "owner" && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400">
                  ⚠️ This user will receive full Owner privileges, including staff creation, role assignment, and raw Django Admin fallback access.
                </p>
              )}
              {targetRole === "manager" && (
                <p className="text-[11px] text-muted-foreground">
                  User can manage products, categories, reviews, inquiries, and view store analytics. Cannot manage staff accounts.
                </p>
              )}
              {targetRole === "staff" && (
                <p className="text-[11px] text-muted-foreground">
                  User can manage products, moderate reviews, and reply to messages. Category access is read-only.
                </p>
              )}
              {targetRole === "viewer" && (
                <p className="text-[11px] text-muted-foreground">
                  User will have strictly read-only access. All product, category, review, and inquiry modifications will be rejected.
                </p>
              )}
            </div>

            <DialogFooter className="pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRoleModalOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting ? "Updating Role..." : "Confirm Role Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. RESET PASSWORD MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              Reset Password: @{selectedStaff?.username}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set a new secure password. This will immediately terminate all active sessions for this user.
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                  className="h-9 pr-10 text-xs rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                className="h-9 text-xs rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------------------- */}
      {/* 5. DEACTIVATE / ACTIVATE MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-foreground">
              {selectedStaff?.is_active ? "Deactivate Account" : "Reactivate Account"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {selectedStaff?.is_active
                ? `Deactivating @${selectedStaff?.username} will immediately revoke their authentication token and prevent any dashboard access.`
                : `Reactivating @${selectedStaff?.username} will restore their login access with their assigned role.`}
            </DialogDescription>
          </DialogHeader>

          {actionError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsStatusModalOpen(false)}
              className="h-9 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleToggleStatus}
              disabled={isSubmitting}
              className={cn(
                "h-9 text-xs rounded-xl font-semibold",
                selectedStaff?.is_active
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
            >
              {isSubmitting
                ? "Processing..."
                : selectedStaff?.is_active
                ? "Confirm Deactivation"
                : "Confirm Reactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------------------------- */}
      {/* 6. STAFF DETAILS & ACTIVITY DRAWER/MODAL */}
      {/* ---------------------------------------------------------------------- */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-lg rounded-2xl p-6 bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                {selectedStaff?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-lg font-serif font-bold text-foreground">
                  {selectedStaff?.first_name ? `${selectedStaff.first_name} ${selectedStaff.last_name || ""}` : selectedStaff?.username}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground font-mono">@{selectedStaff?.username}</span>
                  {renderRoleBadge(selectedStaff?.role, selectedStaff?.is_superuser)}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/60">
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Email</span>
                <p className="font-mono text-foreground mt-0.5">{selectedStaff?.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Phone</span>
                <p className="font-mono text-foreground mt-0.5">{selectedStaff?.phone || "Not provided"}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Last Login</span>
                <p className="text-foreground mt-0.5">
                  {selectedStaff?.last_login ? new Date(selectedStaff.last_login).toLocaleString() : "Never"}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Date Joined</span>
                <p className="text-foreground mt-0.5">
                  {selectedStaff?.date_joined ? new Date(selectedStaff.date_joined).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-2">
                Explicit Permissions ({selectedStaff?.permissions?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 rounded-xl bg-muted/20 border border-border/40">
                {selectedStaff?.permissions?.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-background border border-border/70 text-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {selectedStaffLogs.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-2">
                  Recent Activity Trail
                </span>
                <div className="divide-y divide-border/30 max-h-40 overflow-y-auto p-2 rounded-xl bg-muted/20 border border-border/40">
                  {selectedStaffLogs.map((log) => (
                    <div key={log.id} className="py-2 text-[11px] flex justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {log.action} <span className="text-muted-foreground">{log.target_repr}</span>
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
              className="h-9 text-xs rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
