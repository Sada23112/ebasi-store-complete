/**
 * Ebasi Store - Dedicated Admin API Client
 *
 * Secure Token-authenticated client for Ebasi Business Dashboard.
 * Interacts directly with Django /api/v1/admin/ and /api/v1/accounts/admin/ endpoints.
 */

import { API_BASE_URL } from "@/lib/constants"

export interface AdminUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_staff: boolean
  is_superuser: boolean
  is_active?: boolean
  date_joined?: string
  last_login?: string | null
}

export interface AdminDashboardData {
  kpis: {
    page_views: {
      total: number
      last_7_days: number
      trend: { change_pct: number; direction: 'up' | 'down' | 'neutral'; has_comparison: boolean; previous: number }
    }
    product_views: {
      total: number
      last_7_days: number
      trend: { change_pct: number; direction: 'up' | 'down' | 'neutral'; has_comparison: boolean; previous: number }
    }
    whatsapp_clicks: {
      total: number
      last_7_days: number
      trend: { change_pct: number; direction: 'up' | 'down' | 'neutral'; has_comparison: boolean; previous: number }
    }
    wishlist_adds: {
      total: number
      last_7_days: number
      trend: { change_pct: number; direction: 'up' | 'down' | 'neutral'; has_comparison: boolean; previous: number }
    }
  }
  inventory_summary: {
    total_products: number
    active_products: number
    out_of_stock_products: number
    limited_stock_products: number
    total_categories: number
    active_categories: number
    total_reviews: number
    unread_messages: number
    total_messages: number
  }
  recent_activity: Array<{
    id: string
    type: 'message' | 'review' | 'whatsapp'
    title: string
    subtitle: string
    meta: string
    created_at: string
    is_read?: boolean
  }>
  top_whatsapp_products: Array<{
    product__id: number
    product__name: string
    product__slug: string
    product__price: string | number
    whatsapp_count: number
  }>
}

export interface AdminDailySeries {
  date: string
  label: string
  page_views: number
  product_views: number
  whatsapp_clicks: number
  wishlist_adds: number
}

export interface AdminProductPerformance {
  id: number
  name: string
  slug: string
  price: number
  category_name: string
  stock_status: string
  is_active: boolean
  primary_image: string | null
  period_views: number
  total_views: number
  period_whatsapp_clicks: number
  total_whatsapp_clicks: number
  wishlist_count: number
  conversion_intent_pct: number
}

export interface AdminAnalyticsData {
  timeframe_days: number
  daily_series: AdminDailySeries[]
  product_performance: AdminProductPerformance[]
  top_searches: Array<{ query: string; count: number }>
  funnel: {
    product_views: number
    wishlist_additions: number
    whatsapp_inquiries: number
    views_to_wa_conversion_rate: number
    wishlist_to_wa_rate: number
  }
}

export interface AdminInsight {
  type: string
  severity: 'success' | 'warning' | 'alert' | 'info'
  title: string
  description: string
  product_id: number | null
  product_slug: string | null
}

export interface AdminProductImage {
  id: number
  image?: string
  image_url: string | null
  alt_text: string
  is_primary: boolean
  order: number
}

export interface AdminProduct {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  category_id?: number
  category?: {
    id: number
    name: string
    slug: string
  } | null
  price: string | number
  compare_price?: string | number | null
  is_on_sale?: boolean
  discount_percentage?: number
  sku: string
  stock_quantity: number
  stock_status: 'in_stock' | 'out_of_stock' | 'limited_stock'
  weight?: string | number | null
  dimensions?: string
  is_featured: boolean
  is_active: boolean
  badge?: string | null
  meta_title?: string
  meta_description?: string
  images: AdminProductImage[]
  videos?: any[]
  primary_image?: string | null
  average_rating: number
  review_count: number
  views_count: number
  wishlist_count: number
  whatsapp_clicks_count: number
  created_at: string
  updated_at: string
}

export interface AdminCategory {
  id: number
  name: string
  slug: string
  description: string
  image?: string | null
  image_url?: string | null
  is_active: boolean
  products_count: number
  active_products_count: number
  created_at: string
  updated_at: string
}

export interface AdminReview {
  id: number
  product_id: number
  product_name: string
  product_slug: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export interface AdminContactMessage {
  id: number
  name: string
  email: string
  phone: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

const TOKEN_KEY = "ebasi_admin_token"
const USER_KEY = "ebasi_admin_user"

class EbasiAdminAPI {
  private getBaseUrl(): string {
    return API_BASE_URL.replace(/\/+$/, "")
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  }

  getUser(): AdminUser | null {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(USER_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  setAuth(token: string, user: AdminUser): void {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  removeAuth(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user && user.is_staff)
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const url = `${this.getBaseUrl()}${endpoint}`

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> || {}),
    }

    if (token) {
      headers["Authorization"] = `Token ${token}`
    }

    // Only set Content-Type to JSON if body is not FormData
    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json"
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    let response: Response
    try {
      response = await fetch(url, config)
    } catch (networkError: any) {
      console.error(`Network error requesting ${url}:`, networkError)
      throw new Error(`Unable to reach the server. Please ensure the backend is running.`)
    }

    if (response.status === 401 || response.status === 403) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith('/admin/login')) {
        this.removeAuth()
        window.location.href = `/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`
      }
      const err = await response.json().catch(() => ({}))
      throw new Error(err.error || err.detail || "Authentication required. Please log in as staff.")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      let errMsg = errorData.error || errorData.detail || `Server error (${response.status})`
      if (typeof errorData === "object" && !errorData.error && !errorData.detail) {
        // Collect field error messages
        const fieldErrors = Object.entries(errorData)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(" ") : val}`)
          .join(" | ")
        if (fieldErrors) errMsg = fieldErrors
      }
      throw new Error(errMsg)
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    return await response.json()
  }

  // Authentication
  async login(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const url = `${this.getBaseUrl()}/accounts/admin/login/`
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Invalid username or password.")
    }

    const data = await res.json()
    if (!data.is_staff && !data.is_superuser) {
      throw new Error("Access Denied: Staff or Administrator permissions required.")
    }

    const user: AdminUser = {
      id: data.user_id,
      username: data.username,
      email: data.email,
      is_staff: data.is_staff,
      is_superuser: data.is_superuser,
    }

    this.setAuth(data.token, user)
    return { token: data.token, user }
  }

  logout(): void {
    this.removeAuth()
  }

  // Dashboard Stats & Activity
  async getDashboard(): Promise<AdminDashboardData> {
    return this.request<AdminDashboardData>("/admin/dashboard/")
  }

  // Analytics
  async getAnalytics(days: number = 7): Promise<AdminAnalyticsData> {
    return this.request<AdminAnalyticsData>(`/admin/analytics/?days=${days}`)
  }

  // Actionable Insights
  async getInsights(): Promise<{ insights: AdminInsight[] }> {
    return this.request<{ insights: AdminInsight[] }>("/admin/insights/")
  }

  // Products
  async getProducts(params: Record<string, any> = {}): Promise<{ count: number; next: string | null; previous: string | null; results: AdminProduct[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/products/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, next: null, previous: null, results: data }
    }
    return data
  }

  async getProduct(id: number | string): Promise<AdminProduct> {
    return this.request<AdminProduct>(`/admin/products/${id}/`)
  }

  async createProduct(data: Record<string, any>): Promise<AdminProduct> {
    return this.request<AdminProduct>("/admin/products/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateProduct(id: number | string, data: Record<string, any>): Promise<AdminProduct> {
    return this.request<AdminProduct>(`/admin/products/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteProduct(id: number | string): Promise<void> {
    return this.request<void>(`/admin/products/${id}/`, {
      method: "DELETE",
    })
  }

  async toggleProductActive(id: number | string): Promise<{ status: string; is_active: boolean }> {
    return this.request<{ status: string; is_active: boolean }>(`/admin/products/${id}/toggle-active/`, {
      method: "PATCH",
    })
  }

  async toggleProductFeatured(id: number | string): Promise<{ status: string; is_featured: boolean }> {
    return this.request<{ status: string; is_featured: boolean }>(`/admin/products/${id}/toggle-featured/`, {
      method: "PATCH",
    })
  }

  async uploadProductImage(productId: number | string, file: File, isPrimary: boolean = false, altText: string = "", order: number = 0): Promise<AdminProductImage> {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("is_primary", String(isPrimary))
    formData.append("alt_text", altText)
    formData.append("order", String(order))

    return this.request<AdminProductImage>(`/admin/products/${productId}/upload-image/`, {
      method: "POST",
      body: formData,
    })
  }

  async deleteProductImage(productId: number | string, imageId: number | string): Promise<void> {
    return this.request<void>(`/admin/products/${productId}/delete-image/${imageId}/`, {
      method: "DELETE",
    })
  }

  async setPrimaryProductImage(productId: number | string, imageId: number | string): Promise<{ status: string; primary_image_id: number }> {
    return this.request<{ status: string; primary_image_id: number }>(`/admin/products/${productId}/set-primary-image/${imageId}/`, {
      method: "PATCH",
    })
  }

  // Categories
  async getCategories(params: Record<string, any> = {}): Promise<{ count: number; results: AdminCategory[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/categories/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }

  async createCategory(data: Record<string, any>): Promise<AdminCategory> {
    return this.request<AdminCategory>("/admin/categories/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCategory(id: number | string, data: Record<string, any>): Promise<AdminCategory> {
    return this.request<AdminCategory>(`/admin/categories/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: number | string): Promise<void> {
    return this.request<void>(`/admin/categories/${id}/`, {
      method: "DELETE",
    })
  }

  async toggleCategoryActive(id: number | string): Promise<{ status: string; is_active: boolean }> {
    return this.request<{ status: string; is_active: boolean }>(`/admin/categories/${id}/toggle-active/`, {
      method: "PATCH",
    })
  }

  // Reviews
  async getReviews(params: Record<string, any> = {}): Promise<{ count: number; results: AdminReview[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/reviews/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }

  async deleteReview(id: number | string): Promise<void> {
    return this.request<void>(`/admin/reviews/${id}/`, {
      method: "DELETE",
    })
  }

  // Contact Inquiries
  async getContactMessages(params: Record<string, any> = {}): Promise<{ count: number; results: AdminContactMessage[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/contacts/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }

  async markMessageRead(id: number | string): Promise<{ status: string; is_read: boolean }> {
    return this.request<{ status: string; is_read: boolean }>(`/admin/contacts/${id}/mark-read/`, {
      method: "PATCH",
    })
  }

  async markMessageUnread(id: number | string): Promise<{ status: string; is_read: boolean }> {
    return this.request<{ status: string; is_read: boolean }>(`/admin/contacts/${id}/mark-unread/`, {
      method: "PATCH",
    })
  }

  async deleteMessage(id: number | string): Promise<void> {
    return this.request<void>(`/admin/contacts/${id}/`, {
      method: "DELETE",
    })
  }

  // Staff Users
  async getUsers(): Promise<{ count: number; results: AdminUser[] }> {
    const data = await this.request<any>("/admin/users/")
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }
}

export const adminApi = new EbasiAdminAPI()
export default adminApi
