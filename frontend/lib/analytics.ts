/**
 * Ebasi Store - Customer Behavior Analytics & Attribution Layer
 *
 * Privacy-first, lightweight tracking utility.
 * - Dispatches events asynchronously to Django backend (/api/v1/analytics/track/)
 * - Non-blocking (uses keepalive fetch with abort timeout, never delays user flow)
 * - Fails silently (guaranteed to NEVER throw or break the user experience)
 * - Built-in debouncing & deduplication to prevent duplicate events on rapid clicks
 * - Anonymous session identifier (sessionStorage-backed, zero PII)
 * - Compatible with GTM, GA4 (gtag), Meta Pixel (fbq) if configured
 */

import { API_BASE_URL } from "@/lib/constants"

export type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "search"
  | "wishlist_add"
  | "whatsapp_click"
  | "contact_submit"

export interface WhatsAppEventPayload {
  source:
    | "product_detail"
    | "product_detail_sticky"
    | "wishlist"
    | "navbar"
    | "mobile_menu"
    | "contact_page"
    | "footer"
    | "about_page"
    | "store_location"
  productId?: number | string
  productName?: string
  productPrice?: number | string
  sku?: string
  size?: string
  quantity?: number
  stockStatus?: string
  pageUrl?: string
  timestamp?: string
}

export interface AnalyticsEventData {
  event_type: AnalyticsEventType
  product?: number | null
  product_name?: string
  path?: string
  search_query?: string
  source?: string
  session_id?: string
  metadata?: Record<string, any>
}

// In-memory cache to debounce identical events within a short time window
const recentEvents = new Map<string, number>()
const DEBOUNCE_WINDOW_MS = 1000

/**
 * Generate or retrieve an anonymous, privacy-safe session identifier.
 * Stored in sessionStorage so it expires when the browser session ends.
 */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return ""

  try {
    const STORAGE_KEY = "ebasi_anon_session_id"
    let sessionId = window.sessionStorage.getItem(STORAGE_KEY)
    if (!sessionId) {
      const randomPart = Math.random().toString(36).substring(2, 10)
      const timePart = Date.now().toString(36)
      sessionId = `eb_${timePart}_${randomPart}`
      window.sessionStorage.setItem(STORAGE_KEY, sessionId)
    }
    return sessionId
  } catch {
    return ""
  }
}

/**
 * Asynchronously send an analytics event to the Django backend.
 * Guaranteed to never throw, block, or delay the UI.
 */
export async function sendAnalyticsEvent(data: AnalyticsEventData): Promise<void> {
  if (typeof window === "undefined") return

  try {
    const path = data.path || window.location.pathname
    const sessionId = data.session_id || getAnonymousSessionId()

    // Deduplication check (e.g. rapid double clicks or React StrictMode duplicate triggers)
    const eventKey = `${data.event_type}_${path}_${data.product || data.product_name || ""}_${data.search_query || ""}_${data.source || ""}`
    const now = Date.now()
    const lastTriggered = recentEvents.get(eventKey)

    if (lastTriggered && now - lastTriggered < DEBOUNCE_WINDOW_MS) {
      return
    }
    recentEvents.set(eventKey, now)

    // Cleanup old map entries periodically
    if (recentEvents.size > 50) {
      for (const [k, timestamp] of recentEvents.entries()) {
        if (now - timestamp > 5000) {
          recentEvents.delete(k)
        }
      }
    }

    const payload: AnalyticsEventData = {
      event_type: data.event_type,
      product: data.product || null,
      product_name: data.product_name || "",
      path: path.substring(0, 500),
      search_query: data.search_query || "",
      source: data.source || "",
      session_id: sessionId,
      metadata: data.metadata || {},
    }

    // 1. Dispatch custom DOM event for listening components / Google Tag Manager
    try {
      const customEvent = new CustomEvent("ebasi:analytics_event", {
        detail: payload,
      })
      window.dispatchEvent(customEvent)
    } catch {}

    // 2. Google Analytics (gtag) integration if present
    if (typeof (window as any).gtag === "function") {
      try {
        (window as any).gtag("event", data.event_type, {
          event_category: "Engagement",
          event_label: data.product_name || data.search_query || data.source,
          ...payload,
        })
      } catch {}
    }

    // 3. Meta Pixel (fbq) integration if present
    if (typeof (window as any).fbq === "function") {
      try {
        (window as any).fbq("trackCustom", `Ebasi_${data.event_type}`, payload)
      } catch {}
    }

    // 4. Send non-blocking HTTP request to backend
    const endpoint = `${API_BASE_URL.replace(/\/+$/, "")}/analytics/track/`

    // Use keepalive fetch with a short abort controller timeout
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3000) : null

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
      signal: controller?.signal,
    })
      .then((res) => {
        if (timeoutId) clearTimeout(timeoutId)
      })
      .catch(() => {
        // Silently ignore network failures to protect customer UX
      })

    if (process.env.NODE_ENV === "development") {
      console.log(`[Ebasi Analytics] ${data.event_type}:`, payload)
    }
  } catch {
    // Top-level catch guarantee: never throw
  }
}

/**
 * Track page views when users navigate the site.
 */
export function trackPageView(path?: string, source?: string): void {
  sendAnalyticsEvent({
    event_type: "page_view",
    path: path || (typeof window !== "undefined" ? window.location.pathname : ""),
    source: source || "",
  })
}

/**
 * Track when a user views a product detail page.
 */
export function trackProductView(product: {
  id?: number | string
  slug?: string
  name: string
  price?: number | string
  category?: string
}): void {
  const numericId = typeof product.id === "number" ? product.id : parseInt(String(product.id || ""), 10)
  sendAnalyticsEvent({
    event_type: "product_view",
    product: !isNaN(numericId) ? numericId : null,
    product_name: product.name,
    metadata: {
      slug: product.slug,
      price: product.price,
      category: product.category,
    },
  })
}

/**
 * Track search queries submitted by customers.
 */
export function trackSearch(query: string, metadata?: Record<string, any>): void {
  const trimmed = query.trim()
  if (!trimmed) return

  sendAnalyticsEvent({
    event_type: "search",
    search_query: trimmed,
    metadata: metadata || {},
  })
}

/**
 * Track when a customer saves an item to their Wishlist.
 */
export function trackWishlistAdd(product: {
  id?: number | string
  slug?: string
  name: string
  price?: number | string
}): void {
  const numericId = typeof product.id === "number" ? product.id : parseInt(String(product.id || ""), 10)
  sendAnalyticsEvent({
    event_type: "wishlist_add",
    product: !isNaN(numericId) ? numericId : null,
    product_name: product.name,
    metadata: {
      slug: product.slug,
      price: product.price,
    },
  })
}

/**
 * Track high-intent WhatsApp conversion clicks.
 */
export function trackWhatsAppConversion(payload: WhatsAppEventPayload): void {
  const numericId = typeof payload.productId === "number" ? payload.productId : parseInt(String(payload.productId || ""), 10)

  sendAnalyticsEvent({
    event_type: "whatsapp_click",
    product: !isNaN(numericId) ? numericId : null,
    product_name: payload.productName || "",
    source: payload.source,
    metadata: {
      sku: payload.sku,
      size: payload.size,
      quantity: payload.quantity,
      price: payload.productPrice,
      stockStatus: payload.stockStatus,
    },
  })
}

/**
 * Track contact form inquiries submitted.
 */
export function trackContactSubmit(subject?: string): void {
  sendAnalyticsEvent({
    event_type: "contact_submit",
    source: "contact_form",
    metadata: {
      subject: subject || "General Inquiry",
    },
  })
}
