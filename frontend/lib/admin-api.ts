/**
 * Ebasi Store - Dedicated Admin API Client
 *
 * Secure Token-authenticated client for Ebasi Business Dashboard.
 * Interacts directly with Django /api/v1/admin/ and /api/v1/accounts/admin/ endpoints.
 */

import { API_BASE_URL } from "@/lib/constants"

export type StaffRole = 'owner' | 'manager' | 'staff' | 'viewer'

export interface AdminUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role?: StaffRole
  role_display?: string
  permissions?: string[]
  phone?: string
  notes?: string
  activity_count?: number
  is_staff: boolean
  is_superuser: boolean
  is_active?: boolean
  date_joined?: string
  last_login?: string | null
}

export interface AuditLogItem {
  id: number
  actor: number | null
  actor_username: string
  action: string
  target_type: string
  target_id: string
  target_repr: string
  details: Record<string, any>
  ip_address: string | null
  created_at: string
}

export interface CreateStaffPayload {
  username: string
  email: string
  password?: string
  first_name?: string
  last_name?: string
  role: StaffRole
  is_active?: boolean
  phone?: string
  notes?: string
}

export interface UpdateStaffPayload {
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  notes?: string
}

export interface StoreProfileData {
  id?: number
  name: string
  brand_name: string
  enterprise_name: string
  business_type: string
  tagline: string
  short_description: string
  long_description: string
  phone: string
  phone_raw: string
  phone_display: string
  whatsapp_number: string
  email: string
  address_street: string
  address_locality: string
  address_city: string
  address_state: string
  address_postal_code: string
  address_country: string
  address_full: string
  plus_code: string
  google_maps_embed_url: string
  google_maps_directions_url: string
  specialties: string[]
  policies: Record<string, string>
  meta_title: string
  meta_description: string
  meta_keywords: string
  logo_image?: string | null
  favicon_image?: string | null
  og_share_image?: string | null
  logo_url?: string | null
  favicon_url?: string | null
  og_share_image_url?: string | null
  updated_at?: string
}

export interface SocialLinkItem {
  id: number
  platform: 'instagram' | 'facebook' | 'youtube' | 'whatsapp' | 'other'
  platform_display?: string
  display_name: string
  handle: string
  url: string
  is_enabled: boolean
  order: number
  updated_at?: string
}

export interface HeroSectionData {
  id?: number
  badge_text: string
  heading: string
  subheading: string
  cta_text: string
  cta_link: string
  secondary_cta_text: string
  secondary_cta_link: string
  image?: string | null
  image_url?: string | null
  image_url_fallback?: string
  image_alt: string
  floating_card_title: string
  floating_card_subtitle: string
  is_active: boolean
  updated_at?: string
}

export interface PageContentData {
  id?: number
  slug: 'about' | 'privacy-policy' | 'terms-of-service' | 'contact'
  page_name?: string
  title: string
  subtitle: string
  intro: string
  content_json: Record<string, any>
  hero_image?: string | null
  hero_image_url?: string | null
  story_image?: string | null
  story_image_url?: string | null
  meta_title: string
  meta_description: string
  last_updated_date: string
  is_published?: boolean
  updated_at?: string
}

export interface MediaAssetItem {
  id: number
  title: string
  purpose: 'logo' | 'favicon' | 'og_image' | 'hero' | 'about' | 'general'
  purpose_display?: string
  file?: string
  file_url?: string | null
  alt_text: string
  created_at: string
  updated_at?: string
}

export interface CmsConfigResponse {
  store: StoreProfileData
  social_links: SocialLinkItem[]
  hero: HeroSectionData
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
    return !!(token && user && (user.is_staff || user.is_superuser))
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser()
    if (!user) return false
    if (user.is_superuser || user.role === 'owner') return true
    if (!user.permissions) return false
    return user.permissions.includes(permission)
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p))
  }

  isOwner(): boolean {
    const user = this.getUser()
    return !!(user && (user.is_superuser || user.role === 'owner'))
  }

  isManager(): boolean {
    const user = this.getUser()
    return user?.role === 'manager'
  }

  isStaff(): boolean {
    const user = this.getUser()
    return user?.role === 'staff'
  }

  isViewer(): boolean {
    const user = this.getUser()
    return user?.role === 'viewer'
  }

  // In-flight request deduplication & memory cache
  private cache = new Map<string, { data: any; expiry: number }>()
  private inFlight = new Map<string, Promise<any>>()

  invalidateCache(prefix?: string): void {
    if (!prefix) {
      this.cache.clear()
      return
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    config: { ttlMs?: number; bypassCache?: boolean } = {}
  ): Promise<T> {
    const isGet = !options.method || options.method.toUpperCase() === "GET"
    const cacheKey = endpoint
    const ttl = config.ttlMs ?? 15000 // Default 15s cache for GET requests

    // If it's a mutation, invalidate cache
    if (!isGet) {
      this.invalidateCache()
    } else if (!config.bypassCache) {
      // Check memory cache
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() < cached.expiry) {
        return cached.data as T
      }

      // Check in-flight promise
      const existingPromise = this.inFlight.get(cacheKey)
      if (existingPromise) {
        return existingPromise as Promise<T>
      }
    }

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

    const fetchConfig: RequestInit = {
      ...options,
      headers,
    }

    const executeRequest = async (): Promise<T> => {
      let response: Response
      try {
        response = await fetch(url, fetchConfig)
      } catch (networkError: any) {
        console.error(`Network error requesting ${url}:`, networkError)
        throw new Error(`Unable to reach the server. Please ensure the backend is running.`)
      }

      if (response.status === 401 || response.status === 403) {
        if (response.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith('/admin/login')) {
          this.removeAuth()
          window.location.href = `/admin/login?redirect=${encodeURIComponent(window.location.pathname)}`
        }
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || err.detail || "You do not have permission to perform this action.")
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        let errMsg = errorData.error || errorData.detail || `Server error (${response.status})`
        if (typeof errorData === "object" && !errorData.error && !errorData.detail) {
          const fieldErrors = Object.entries(errorData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(" ") : val}`)
            .join(" | ")
          if (fieldErrors) errMsg = fieldErrors
        }
        throw new Error(errMsg)
      }

      if (response.status === 204) {
        return {} as T
      }

      const result = await response.json()

      if (isGet && ttl > 0) {
        this.cache.set(cacheKey, { data: result, expiry: Date.now() + ttl })
      }

      return result
    }

    if (isGet && !config.bypassCache) {
      const promise = executeRequest().finally(() => {
        this.inFlight.delete(cacheKey)
      })
      this.inFlight.set(cacheKey, promise)
      return promise
    }

    return executeRequest()
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
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role || (data.is_superuser ? 'owner' : 'staff'),
      permissions: data.permissions || [],
      is_staff: data.is_staff,
      is_superuser: data.is_superuser,
    }

    this.setAuth(data.token, user)
    return { token: data.token, user }
  }

  logout(): void {
    this.removeAuth()
  }

  // Get current user profile & refresh stored permissions
  async getMe(options: { bypassCache?: boolean } = {}): Promise<AdminUser> {
    const data = await this.request<AdminUser>("/admin/me/", {}, { ttlMs: 60000, bypassCache: options.bypassCache })
    if (data && data.id) {
      const token = this.getToken()
      if (token) {
        this.setAuth(token, data)
      }
    }
    return data
  }

  // Dashboard Stats & Activity
  async getDashboard(options: { bypassCache?: boolean } = {}): Promise<AdminDashboardData> {
    return this.request<AdminDashboardData>("/admin/dashboard/", {}, { ttlMs: 5000, bypassCache: options.bypassCache })
  }

  // Analytics
  async getAnalytics(days: number = 7): Promise<AdminAnalyticsData> {
    return this.request<AdminAnalyticsData>(`/admin/analytics/?days=${days}`)
  }

  // Actionable Insights
  async getInsights(options: { bypassCache?: boolean } = {}): Promise<{ insights: AdminInsight[] }> {
    return this.request<{ insights: AdminInsight[] }>("/admin/insights/", {}, { ttlMs: 10000, bypassCache: options.bypassCache })
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

  // Staff & Team Management
  async getStaff(params: Record<string, any> = {}): Promise<{ count: number; results: AdminUser[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== "all") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/staff/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }

  async getStaffMember(id: number | string): Promise<AdminUser> {
    return this.request<AdminUser>(`/admin/staff/${id}/`)
  }

  async createStaff(data: CreateStaffPayload): Promise<AdminUser> {
    return this.request<AdminUser>("/admin/staff/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateStaff(id: number | string, data: UpdateStaffPayload): Promise<AdminUser> {
    return this.request<AdminUser>(`/admin/staff/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async changeStaffRole(id: number | string, role: StaffRole): Promise<{ status: string; message: string; user: AdminUser }> {
    return this.request<{ status: string; message: string; user: AdminUser }>(`/admin/staff/${id}/role/`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    })
  }

  async deactivateStaff(id: number | string): Promise<{ status: string; message: string; is_active: boolean }> {
    return this.request<{ status: string; message: string; is_active: boolean }>(`/admin/staff/${id}/deactivate/`, {
      method: "PATCH",
    })
  }

  async activateStaff(id: number | string): Promise<{ status: string; message: string; is_active: boolean }> {
    return this.request<{ status: string; message: string; is_active: boolean }>(`/admin/staff/${id}/activate/`, {
      method: "PATCH",
    })
  }

  async resetStaffPassword(id: number | string, new_password: string): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>(`/admin/staff/${id}/reset-password/`, {
      method: "POST",
      body: JSON.stringify({ new_password }),
    })
  }

  async getStaffActivity(id: number | string): Promise<AuditLogItem[]> {
    return this.request<AuditLogItem[]>(`/admin/staff/${id}/activity/`)
  }

  async getAuditLogs(params: Record<string, any> = {}): Promise<{ count: number; results: AuditLogItem[] }> {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        query.append(k, String(v))
      }
    })
    const qs = query.toString()
    const data = await this.request<any>(`/admin/audit-logs/${qs ? `?${qs}` : ""}`)
    if (Array.isArray(data)) {
      return { count: data.length, results: data }
    }
    return data
  }

  // ==============================================================================
  // CMS & Content Management
  // ==============================================================================
  async getCmsStore(): Promise<StoreProfileData> {
    return this.request<StoreProfileData>("/admin/cms/store/")
  }

  async updateCmsStore(data: Partial<StoreProfileData>): Promise<StoreProfileData> {
    return this.request<StoreProfileData>("/admin/cms/store/", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async uploadCmsBrandAsset(file: File, assetField: 'logo_image' | 'favicon_image' | 'og_share_image'): Promise<StoreProfileData> {
    const formData = new FormData()
    formData.append(assetField, file)
    return this.request<StoreProfileData>("/admin/cms/store/", {
      method: "PATCH",
      body: formData,
    })
  }

  async getCmsSocialLinks(): Promise<SocialLinkItem[]> {
    const data = await this.request<any>("/admin/cms/social-links/")
    if (Array.isArray(data)) return data
    return data.results || []
  }

  async createCmsSocialLink(data: Partial<SocialLinkItem>): Promise<SocialLinkItem> {
    return this.request<SocialLinkItem>("/admin/cms/social-links/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCmsSocialLink(id: number | string, data: Partial<SocialLinkItem>): Promise<SocialLinkItem> {
    return this.request<SocialLinkItem>(`/admin/cms/social-links/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async toggleCmsSocialLink(id: number | string): Promise<{ status: string; is_enabled: boolean }> {
    return this.request<{ status: string; is_enabled: boolean }>(`/admin/cms/social-links/${id}/toggle-enabled/`, {
      method: "PATCH",
    })
  }

  async deleteCmsSocialLink(id: number | string): Promise<void> {
    return this.request<void>(`/admin/cms/social-links/${id}/`, {
      method: "DELETE",
    })
  }

  async getCmsHero(): Promise<HeroSectionData> {
    return this.request<HeroSectionData>("/admin/cms/hero/")
  }

  async updateCmsHero(data: Partial<HeroSectionData>): Promise<HeroSectionData> {
    return this.request<HeroSectionData>("/admin/cms/hero/", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async uploadCmsHeroImage(file: File, altText: string = ""): Promise<HeroSectionData> {
    const formData = new FormData()
    formData.append("image", file)
    if (altText) formData.append("image_alt", altText)
    return this.request<HeroSectionData>("/admin/cms/hero/", {
      method: "POST",
      body: formData,
    })
  }

  async getCmsPages(): Promise<PageContentData[]> {
    const data = await this.request<any>("/admin/cms/pages/")
    if (Array.isArray(data)) return data
    return data.results || []
  }

  async getCmsPage(slug: string): Promise<PageContentData> {
    return this.request<PageContentData>(`/admin/cms/pages/${slug}/`)
  }

  async updateCmsPage(slug: string, data: Partial<PageContentData>): Promise<PageContentData> {
    return this.request<PageContentData>(`/admin/cms/pages/${slug}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async uploadCmsPageImage(slug: string, file: File, type: 'hero' | 'story' = 'hero'): Promise<PageContentData> {
    const formData = new FormData()
    formData.append("image", file)
    formData.append("type", type)
    return this.request<PageContentData>(`/admin/cms/pages/${slug}/upload-image/`, {
      method: "POST",
      body: formData,
    })
  }

  async getCmsMedia(): Promise<MediaAssetItem[]> {
    const data = await this.request<any>("/admin/cms/media/")
    if (Array.isArray(data)) return data
    return data.results || []
  }

  async uploadCmsMedia(file: File, title: string, purpose: string = "general", altText: string = ""): Promise<MediaAssetItem> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("title", title)
    formData.append("purpose", purpose)
    formData.append("alt_text", altText)
    return this.request<MediaAssetItem>("/admin/cms/media/", {
      method: "POST",
      body: formData,
    })
  }

  async deleteCmsMedia(id: number | string): Promise<void> {
    return this.request<void>(`/admin/cms/media/${id}/`, {
      method: "DELETE",
    })
  }

  // Public CMS consumption
  async getPublicCmsConfig(): Promise<CmsConfigResponse> {
    const res = await fetch(`${API_BASE_URL}/cms/config/`, { cache: 'no-store' })
    if (!res.ok) throw new Error("Failed to load CMS configuration")
    return res.json()
  }

  async getPublicCmsPage(slug: string): Promise<PageContentData> {
    const res = await fetch(`${API_BASE_URL}/cms/pages/${slug}/`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Failed to load page content for ${slug}`)
    return res.json()
  }

  // Backward compatibility
  async getUsers(): Promise<{ count: number; results: AdminUser[] }> {
    return this.getStaff()
  }
}

export const adminApi = new EbasiAdminAPI()
export default adminApi

