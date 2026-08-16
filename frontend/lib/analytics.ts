/**
 * WhatsApp Conversion Attribution & Event Tracking
 * Tracks high-intent WhatsApp conversion clicks across the store.
 * Dispatches standard custom events, integrates with Google Analytics / Meta Pixel if present,
 * and records attribution data (source, product, price, size, quantity, timestamp).
 */

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

export function trackWhatsAppConversion(payload: WhatsAppEventPayload): void {
  if (typeof window === "undefined") return

  const eventData = {
    ...payload,
    pageUrl: payload.pageUrl || window.location.href,
    timestamp: new Date().toISOString(),
  }

  // 1. Dispatch custom DOM event for listening components / Google Tag Manager
  try {
    const customEvent = new CustomEvent("ebasi:whatsapp_conversion", {
      detail: eventData,
    })
    window.dispatchEvent(customEvent)
  } catch {
    // Non-blocking fallback
  }

  // 2. Google Analytics (gtag) integration if present
  if (typeof (window as any).gtag === "function") {
    try {
      (window as any).gtag("event", "whatsapp_conversion", {
        event_category: "Conversion",
        event_label: payload.productName || payload.source,
        value:
          typeof payload.productPrice === "number"
            ? payload.productPrice
            : parseFloat(String(payload.productPrice || 0)) || undefined,
        ...eventData,
      })
    } catch {}
  }

  // 3. Meta Pixel (fbq) integration if present
  if (typeof (window as any).fbq === "function") {
    try {
      (window as any).fbq("trackCustom", "WhatsAppOrderInquiry", eventData)
    } catch {}
  }

  // 4. Debug logger in development mode
  if (process.env.NODE_ENV === "development") {
    console.log("[Ebasi Analytics] WhatsApp Conversion Event:", eventData)
  }
}
