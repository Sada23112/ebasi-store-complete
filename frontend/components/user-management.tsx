"use client"

import type React from "react"

import type { ReactElement } from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { validateEmail, validatePhone, validateName } from "@/lib/form-validation"
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  AlertCircle,
  Save,
  UserCheck,
  UserX,
  Crown,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Types
interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  status: "active" | "inactive" | "suspended"
  role: "customer" | "vip" | "admin" | "moderator"
  orders: number
  totalSpent: number
  joinDate: string
  lastLogin?: string
  address?: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  preferences?: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
  }
  notes?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    status: "active",
    role: "vip",
    orders: 12,
    totalSpent: 25000,
    joinDate: "2023-01-15",
    lastLogin: "2024-01-20T10:30:00Z",
    address: {
      street: "123 MG Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
    },
    preferences: {
      newsletter: true,
      smsNotifications: true,
      emailNotifications: true,
    },
    notes: "Frequent buyer, prefers silk sarees. Very responsive to email campaigns.",
    tags: ["frequent-buyer", "silk-lover", "premium"],
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    name: "Meera Patel",
    email: "meera@example.com",
    phone: "+91 87654 32109",
    status: "active",
    role: "customer",
    orders: 8,
    totalSpent: 15000,
    joinDate: "2023-03-22",
    lastLogin: "2024-01-19T15:45:00Z",
    address: {
      street: "456 Park Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
    },
    preferences: {
      newsletter: true,
      smsNotifications: false,
      emailNotifications: true,
    },
    notes: "Interested in traditional wear, responds well to festival offers.",
    tags: ["traditional", "festival-shopper"],
    createdAt: "2023-03-22T00:00:00Z",
    updatedAt: "2024-01-19T15:45:00Z",
  },
  {
    id: "3",
    name: "Anita Reddy",
    email: "anita@example.com",
    phone: "+91 76543 21098",
    status: "inactive",
    role: "customer",
    orders: 3,
    totalSpent: 4500,
    joinDate: "2023-08-10",
    lastLogin: "2023-12-15T09:20:00Z",
    address: {
      street: "789 Brigade Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    preferences: {
      newsletter: false,
      smsNotifications: false,
      emailNotifications: false,
    },
    notes: "Inactive user, last purchase was 3 months ago. Consider re-engagement campaign.",
    tags: ["inactive", "re-engagement-needed"],
    createdAt: "2023-08-10T00:00:00Z",
    updatedAt: "2023-12-15T09:20:00Z",
  },
]

const userStatuses = [
  { value: "active", label: "Active", color: "default" },
  { value: "inactive", label: "Inactive", color: "secondary" },
  { value: "suspended", label: "Suspended", color: "destructive" },
]

const userRoles = [
  { value: "customer", label: "Customer", icon: Users },
  { value: "vip", label: "VIP Customer", icon: Crown },
  { value: "moderator", label: "Moderator", icon: Shield },
  { value: "admin", label: "Admin", icon: Shield },
]

export function UserManagement(): ReactElement {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { api } = await import("@/lib/api")
        const data = await api.getAdminUsers()
        // Map backend user data to frontend User interface if needed
        // Backend returns: id, username, email, first_name, last_name, is_active, date_joined, last_login
        // Frontend expects: id, name, email, role, status, joinDate, lastLogin, ordersCount, totalSpent
        // We might need to adjust mapping or accept simple data for now
        const mappedUsers = data.map((u: any) => ({
          id: u.id.toString(),
          name: `${u.first_name} ${u.last_name}`.trim() || u.username,
          email: u.email,
          role: u.is_staff ? "admin" : "customer", // Changed "Admin" to "admin" to match User type
          status: u.is_active ? "active" : "inactive",
          joinDate: u.date_joined,
          lastLogin: u.last_login || u.date_joined, // Fallback
          orders: 0, // Not provided by simple user list API yet
          totalSpent: 0, // Not provided by simple user list API yet
          phone: "", // Not provided by simple user list API yet
          tags: [],
          createdAt: u.date_joined,
          updatedAt: u.last_login || u.date_joined,
          avatar: ""
        }))
        setUsers(mappedUsers)
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive"
        })
      }
    }
    fetchUsers()
  }, [toast])

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsAddDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const { api } = await import("@/lib/api")
      const newStatus = user.status === "active" ? "inactive" : "active"
      // Backend toggleUserStatus takes id (swaps status)
      await api.toggleUserStatus(user.id)

      setUsers(users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)))
      toast({
        title: "Status Updated",
        description: `User ${user.name} is now ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update user status.",
        variant: "destructive"
      })
    }
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers(users.filter((u) => u.id !== selectedUser.id))
      toast({
        title: "User Deleted",
        description: `${selectedUser.name} has been successfully deleted.`,
      })
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    const roleData = userRoles.find((r) => r.value === role)
    return roleData ? roleData.icon : Users
  }

  const getStatusBadgeVariant = (status: string) => {
    const statusData = userStatuses.find((s) => s.value === status)
    return (statusData?.color as "default" | "secondary" | "destructive") || "default"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage customer accounts and user data</p>
        </div>
        <Button onClick={handleAddUser} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">VIP Users</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.role === "vip").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Inactive Users</p>
                <p className="text-2xl font-bold">{users.filter((u) => u.status === "inactive").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4 font-medium">User</th>
                  <th className="text-left p-4 font-medium">Contact</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-left p-4 font-medium">Orders</th>
                  <th className="text-left p-4 font-medium">Total Spent</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Last Login</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role)
                  return (
                    <tr key={user.id} className="border-b">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar || "/placeholder.svg"}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-primary">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <RoleIcon className="w-4 h-4 text-muted-foreground" />
                          <Badge variant={user.role === "vip" ? "default" : "secondary"}>
                            {userRoles.find((r) => r.value === user.role)?.label}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                          <span>{user.orders}</span>
                        </div>
                      </td>
                      <td className="p-4">₹{user.totalSpent.toLocaleString()}</td>
                      <td className="p-4">
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {userStatuses.find((s) => s.value === user.status)?.label}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleViewUser(user)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleStatus(user)}
                            disabled={isLoading}
                          >
                            {user.status === "active" ? (
                              <UserX className="w-4 h-4 text-red-600" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <UserFormDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        user={null}
        onSave={(user) => {
          setUsers([...users, { ...user, id: Date.now().toString() }])
          setIsAddDialogOpen(false)
          toast({
            title: "User Added",
            description: `${user.name} has been successfully added.`,
          })
        }}
        title="Add New User"
        description="Create a new user account"
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={selectedUser}
        onSave={(user) => {
          setUsers(users.map((u) => (u.id === user.id ? user : u)))
          setIsEditDialogOpen(false)
          toast({
            title: "User Updated",
            description: `${user.name} has been successfully updated.`,
          })
        }}
        title="Edit User"
        description="Update user information"
      />

      {/* View User Dialog */}
      <UserViewDialog isOpen={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} user={selectedUser} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone and will remove all
              user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// User Form Dialog Component
interface UserFormDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onSave: (user: User) => void
  title: string
  description: string
}

function UserFormDialog({ isOpen, onClose, user, onSave, title, description }: UserFormDialogProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    status: "active",
    role: "customer",
    orders: 0,
    totalSpent: 0,
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    preferences: {
      newsletter: true,
      smsNotifications: true,
      emailNotifications: true,
    },
    notes: "",
    tags: [],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const { toast } = useToast()

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData(user)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "active",
        role: "customer",
        orders: 0,
        totalSpent: 0,
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
        preferences: {
          newsletter: true,
          smsNotifications: true,
          emailNotifications: true,
        },
        notes: "",
        tags: [],
      })
    }
    setErrors({})
  }, [user])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => {
      const currentAddress = prev.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      }
      return {
        ...prev,
        address: {
          ...currentAddress,
          [field]: value,
        },
      }
    })
  }

  const handlePreferencesChange = (field: string, value: boolean) => {
    setFormData((prev) => {
      const currentPreferences = prev.preferences || {
        newsletter: true,
        smsNotifications: true,
        emailNotifications: true,
      }
      return {
        ...prev,
        preferences: {
          ...currentPreferences,
          [field]: value,
        },
      }
    })
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name?.trim()) newErrors.name = "Name is required"
    if (!formData.email?.trim()) newErrors.email = "Email is required"
    if (!formData.phone?.trim()) newErrors.phone = "Phone is required"

    // Format validation
    if (formData.name && validateName(formData.name)) newErrors.name = validateName(formData.name)
    if (formData.email && validateEmail(formData.email)) newErrors.email = validateEmail(formData.email)
    if (formData.phone && validatePhone(formData.phone)) newErrors.phone = validatePhone(formData.phone)

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const now = new Date().toISOString()
      const userData: User = {
        ...formData,
        id: user?.id || Date.now().toString(),
        joinDate: user?.joinDate || now.split("T")[0],
        createdAt: user?.createdAt || now,
        updatedAt: now,
      } as User

      onSave(userData)
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={cn(errors.name && "border-destructive")}
                    placeholder="Enter full name"
                  />
                  {errors.name && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn(errors.email && "border-destructive")}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={cn(errors.phone && "border-destructive")}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <div className="flex items-center space-x-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role || ""} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <role.icon className="w-4 h-4" />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {userStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ""}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.address?.city || ""}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.address?.state || ""}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.address?.pincode || ""}
                    onChange={(e) => handleAddressChange("pincode", e.target.value)}
                    placeholder="Enter pincode"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.address?.country || ""}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="Enter country"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Communication Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="newsletter"
                  checked={formData.preferences?.newsletter || false}
                  onCheckedChange={(checked) => handlePreferencesChange("newsletter", checked)}
                />
                <Label htmlFor="newsletter">Newsletter Subscription</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="emailNotifications"
                  checked={formData.preferences?.emailNotifications || false}
                  onCheckedChange={(checked) => handlePreferencesChange("emailNotifications", checked)}
                />
                <Label htmlFor="emailNotifications">Email Notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="smsNotifications"
                  checked={formData.preferences?.smsNotifications || false}
                  onCheckedChange={(checked) => handlePreferencesChange("smsNotifications", checked)}
                />
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
              </div>
            </CardContent>
          </Card>

          {/* Tags and Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add internal notes about this user..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save User
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// User View Dialog Component
interface UserViewDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

function UserViewDialog({ isOpen, onClose, user }: UserViewDialogProps) {
  if (!user) return null

  const RoleIcon = userRoles.find((r) => r.value === user.role)?.icon || Users

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>Complete user information and activity</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <RoleIcon className="w-4 h-4 text-muted-foreground" />
                    <Badge variant={user.role === "vip" ? "default" : "secondary"}>
                      {userRoles.find((r) => r.value === user.role)?.label}
                    </Badge>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : user.status === "inactive" ? "secondary" : "destructive"
                      }
                    >
                      {userStatuses.find((s) => s.value === user.status)?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm">{user.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                  <p className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                  <p className="text-sm">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{user.orders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">₹{user.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {user.address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{user.address.street}</p>
                  <p className="text-sm">
                    {user.address.city}, {user.address.state} {user.address.pincode}
                  </p>
                  <p className="text-sm">{user.address.country}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {user.tags && user.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {user.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{user.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
