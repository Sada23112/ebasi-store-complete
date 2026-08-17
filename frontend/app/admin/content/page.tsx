"use client"

import React, { useState, useEffect } from "react"
import {
  Store,
  Share2,
  Sparkles,
  FileText,
  Shield,
  Layers,
  Image as ImageIcon,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Upload,
  Globe,
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  Lock,
  Compass,
  Building,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  adminApi,
  StoreProfileData,
  SocialLinkItem,
  HeroSectionData,
  PageContentData,
  MediaAssetItem,
  AdminUser
} from "@/lib/admin-api"

export default function AdminContentPage() {
  const { toast } = useToast()
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [activeTab, setActiveTab] = useState("business")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Data states
  const [storeProfile, setStoreProfile] = useState<StoreProfileData | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([])
  const [heroSection, setHeroSection] = useState<HeroSectionData | null>(null)
  const [aboutPage, setAboutPage] = useState<PageContentData | null>(null)
  const [privacyPage, setPrivacyPage] = useState<PageContentData | null>(null)
  const [termsPage, setTermsPage] = useState<PageContentData | null>(null)
  const [mediaAssets, setMediaAssets] = useState<MediaAssetItem[]>([])

  // Social link modal state
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false)
  const [editingSocialLink, setEditingSocialLink] = useState<Partial<SocialLinkItem> | null>(null)

  // Permission checks
  const canEdit = currentUser?.is_superuser || currentUser?.role === "owner" || currentUser?.role === "manager" || currentUser?.permissions?.includes("content.update")
  const canDelete = currentUser?.is_superuser || currentUser?.role === "owner" || currentUser?.role === "manager" || currentUser?.permissions?.includes("content.delete")

  // Load all CMS datasets
  const loadAllData = async () => {
    setIsLoading(true)
    try {
      const user = adminApi.getUser()
      setCurrentUser(user)

      const [store, socials, hero, pages, media] = await Promise.all([
        adminApi.getCmsStore().catch(() => null),
        adminApi.getCmsSocialLinks().catch(() => []),
        adminApi.getCmsHero().catch(() => null),
        adminApi.getCmsPages().catch(() => []),
        adminApi.getCmsMedia().catch(() => []),
      ])

      if (store) setStoreProfile(store)
      if (socials) setSocialLinks(socials)
      if (hero) setHeroSection(hero)
      if (media) setMediaAssets(media)

      if (Array.isArray(pages)) {
        const about = pages.find((p) => p.slug === "about") || null
        const privacy = pages.find((p) => p.slug === "privacy-policy") || null
        const terms = pages.find((p) => p.slug === "terms-of-service") || null
        if (about) setAboutPage(about)
        if (privacy) setPrivacyPage(privacy)
        if (terms) setTermsPage(terms)
      }
      setHasChanges(false)
    } catch (err: any) {
      toast({
        title: "Failed to load content",
        description: err.message || "Could not retrieve store content from the server.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // ============================================================================
  // Save Handlers
  // ============================================================================

  const handleSaveStore = async () => {
    if (!storeProfile) return
    setIsSaving(true)
    try {
      const updated = await adminApi.updateCmsStore(storeProfile)
      setStoreProfile(updated)
      setHasChanges(false)
      toast({
        title: "Store information saved",
        description: "Business details, address, and policies updated successfully.",
      })
    } catch (err: any) {
      toast({
        title: "Error saving store information",
        description: err.message || "Failed to update store profile.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveHero = async () => {
    if (!heroSection) return
    setIsSaving(true)
    try {
      const updated = await adminApi.updateCmsHero(heroSection)
      setHeroSection(updated)
      setHasChanges(false)
      toast({
        title: "Hero banner updated",
        description: "Homepage hero headings and call-to-actions updated successfully.",
      })
    } catch (err: any) {
      toast({
        title: "Error saving hero banner",
        description: err.message || "Failed to update hero section.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePage = async (page: PageContentData | null, setter: (p: PageContentData) => void, title: string) => {
    if (!page) return
    setIsSaving(true)
    try {
      const updated = await adminApi.updateCmsPage(page.slug, page)
      setter(updated)
      setHasChanges(false)
      toast({
        title: `${title} saved`,
        description: `${title} page content and sections updated successfully.`,
      })
    } catch (err: any) {
      toast({
        title: `Error saving ${title}`,
        description: err.message || "Failed to update page content.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // ============================================================================
  // Social Link CRUD
  // ============================================================================

  const handleToggleSocial = async (id: number) => {
    try {
      const res = await adminApi.toggleCmsSocialLink(id)
      setSocialLinks((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_enabled: res.is_enabled } : s))
      )
      toast({
        title: res.is_enabled ? "Social link enabled" : "Social link disabled",
        description: "Public website footer and contact channels updated.",
      })
    } catch (err: any) {
      toast({
        title: "Error toggling social link",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteSocial = async (id: number) => {
    if (!confirm("Are you sure you want to remove this social link?")) return
    try {
      await adminApi.deleteCmsSocialLink(id)
      setSocialLinks((prev) => prev.filter((s) => s.id !== id))
      toast({
        title: "Social link deleted",
        description: "The social channel has been removed.",
      })
    } catch (err: any) {
      toast({
        title: "Error deleting social link",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleSaveSocialModal = async () => {
    if (!editingSocialLink?.url) {
      toast({ title: "URL is required", variant: "destructive" })
      return
    }
    try {
      if (editingSocialLink.id) {
        const updated = await adminApi.updateCmsSocialLink(editingSocialLink.id, editingSocialLink)
        setSocialLinks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
        toast({ title: "Social channel updated" })
      } else {
        const created = await adminApi.createCmsSocialLink(editingSocialLink)
        setSocialLinks((prev) => [...prev, created])
        toast({ title: "Social channel added" })
      }
      setIsSocialModalOpen(false)
      setEditingSocialLink(null)
    } catch (err: any) {
      toast({
        title: "Error saving social link",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // ============================================================================
  // Image Upload Handlers
  // ============================================================================

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsSaving(true)
    try {
      const updated = await adminApi.uploadCmsHeroImage(file, heroSection?.image_alt || "")
      setHeroSection(updated)
      toast({ title: "Hero image uploaded and replaced successfully" })
    } catch (err: any) {
      toast({ title: "Failed to upload hero image", description: err.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBrandAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_image' | 'favicon_image' | 'og_share_image') => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsSaving(true)
    try {
      const updated = await adminApi.uploadCmsBrandAsset(file, field)
      setStoreProfile(updated)
      toast({ title: "Brand asset uploaded successfully" })
    } catch (err: any) {
      toast({ title: "Failed to upload brand asset", description: err.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'story') => {
    const file = e.target.files?.[0]
    if (!file || !aboutPage) return
    setIsSaving(true)
    try {
      const updated = await adminApi.uploadCmsPageImage(aboutPage.slug, file, type)
      setAboutPage(updated)
      toast({ title: "About page image uploaded successfully" })
    } catch (err: any) {
      toast({ title: "Failed to upload page image", description: err.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-muted rounded-xl animate-pulse" />
            <div className="h-4 w-80 bg-muted/60 rounded-lg animate-pulse" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-muted rounded-xl animate-pulse" />
            <div className="h-9 w-36 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-1.5 bg-muted/60 rounded-xl">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-8 bg-card/60 rounded-lg animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 bg-card border border-border/70 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="h-5 w-48 bg-muted rounded" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-muted/70 rounded-xl" />
                <div className="h-10 bg-muted/70 rounded-xl" />
              </div>
              <div className="h-20 bg-muted/50 rounded-xl" />
            </div>
          </div>
          <div className="h-72 bg-card border border-border/70 rounded-2xl p-6 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground tracking-tight">
              Store Content & CMS
            </h1>
            <Badge variant="outline" className="text-primary border-primary/30 text-xs">
              Live Storefront Sync
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage public store information, social channels, hero banner, policies, and brand assets directly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadAllData}
            disabled={isLoading || isSaving}
            className="border-border text-foreground hover:bg-muted"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
              <Eye className="h-4 w-4 mr-2" />
              Preview Storefront
            </Button>
          </a>
        </div>
      </div>

      {/* Read-Only Notice for Viewers */}
      {!canEdit && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-sm">
          <Lock className="h-4 w-4 shrink-0" />
          <p>
            <strong>Read-Only Mode:</strong> Your staff role does not have <code className="bg-amber-500/20 px-1 py-0.5 rounded text-xs">content.update</code> permission. Content cannot be saved or modified.
          </p>
        </div>
      )}

      {/* Main CMS Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto p-1.5 bg-muted/60 rounded-xl gap-1">
          <TabsTrigger value="business" className="text-xs font-semibold py-2">
            <Store className="h-3.5 w-3.5 mr-1.5" />
            Business Info
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs font-semibold py-2">
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Social Links
          </TabsTrigger>
          <TabsTrigger value="hero" className="text-xs font-semibold py-2">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Homepage Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="text-xs font-semibold py-2">
            <Layers className="h-3.5 w-3.5 mr-1.5" />
            About Us
          </TabsTrigger>
          <TabsTrigger value="privacy" className="text-xs font-semibold py-2">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Privacy Policy
          </TabsTrigger>
          <TabsTrigger value="terms" className="text-xs font-semibold py-2">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Terms of Service
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs font-semibold py-2">
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Brand & SEO
          </TabsTrigger>
        </TabsList>

        {/* ==================================================================== */}
        {/* TAB 1: BUSINESS INFORMATION & CONTACT */}
        {/* ==================================================================== */}
        <TabsContent value="business" className="space-y-6">
          {storeProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Identity Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Store Identity & Legal Entity</CardTitle>
                    <CardDescription>Brand titles displayed in the header, footer, and schema.org metadata.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Store Display Name *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.name}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, name: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Ms Ebasi Store"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Brand / Logo Name *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.brand_name}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, brand_name: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. EBASI STORE"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Enterprise / Legal Name
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.enterprise_name}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, enterprise_name: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. EBASI ENTERPRISE"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Business Type Tag
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.business_type}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, business_type: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Boutique / Clothing brand"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Brand Tagline
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={storeProfile.tagline}
                        onChange={(e) => {
                          setStoreProfile({ ...storeProfile, tagline: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. Style that Speaks. Fashion that Lasts."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Short Description (Footer & Meta)
                      </label>
                      <Textarea
                        disabled={!canEdit}
                        rows={3}
                        value={storeProfile.short_description}
                        onChange={(e) => {
                          setStoreProfile({ ...storeProfile, short_description: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="Brief summary of the boutique and traditional collections..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Direct Contact & WhatsApp Coordination</CardTitle>
                    <CardDescription>Phone numbers and WhatsApp channels for customer inquiries and orders.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Formatted Display Phone *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.phone_display}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, phone_display: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. +91 73992 91242"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Raw Dialing Digits *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.phone_raw}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, phone_raw: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. 917399291242"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          WhatsApp Order Number
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.whatsapp_number}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, whatsapp_number: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. 917399291242"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Customer Support Email
                        </label>
                        <Input
                          disabled={!canEdit}
                          type="email"
                          value={storeProfile.email}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, email: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. contact@ebasistore.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Store Physical Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Physical Store Location & Google Maps</CardTitle>
                    <CardDescription>Boutique address components in Dhemaji, Assam and Google Maps embed URLs.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Street Address *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.address_street}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, address_street: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Railway, Station Rd, opposite Parmananda Academy"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Locality / Ward
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.address_locality}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, address_locality: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Nagakhelia No.2"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          City *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.address_city}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, address_city: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Dhemaji"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          State *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.address_state}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, address_state: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Assam"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Postal PIN Code *
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.address_postal_code}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, address_postal_code: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. 787057"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Google Maps Plus Code
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={storeProfile.plus_code}
                          onChange={(e) => {
                            setStoreProfile({ ...storeProfile, plus_code: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. FHG4+PH, Dhemaji, Assam"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Google Maps Embed URL (iframe source)
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={storeProfile.google_maps_embed_url}
                        onChange={(e) => {
                          setStoreProfile({ ...storeProfile, google_maps_embed_url: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="https://maps.google.com/maps?..."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Google Maps Directions Navigation URL
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={storeProfile.google_maps_directions_url}
                        onChange={(e) => {
                          setStoreProfile({ ...storeProfile, google_maps_directions_url: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="https://www.google.com/maps/dir/?api=1..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Summary & Policies */}
              <div className="space-y-6">
                <Card className="border-primary/30">
                  <CardHeader className="bg-primary/5 pb-4">
                    <CardTitle className="text-base font-serif text-primary">Store Policies Summary</CardTitle>
                    <CardDescription className="text-xs">Quick snippets shown on the footer and checkout inquiries.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Payment & COD Policy Snippet
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={storeProfile.policies?.payment || ""}
                        onChange={(e) => {
                          setStoreProfile({
                            ...storeProfile,
                            policies: { ...storeProfile.policies, payment: e.target.value }
                          })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. WhatsApp-First (Prepaid / No COD)"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1.5">
                        Dispatch Origin Snippet
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={storeProfile.policies?.dispatch || ""}
                        onChange={(e) => {
                          setStoreProfile({
                            ...storeProfile,
                            policies: { ...storeProfile.policies, dispatch: e.target.value }
                          })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. Dispatched directly from Dhemaji, Assam"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button Card */}
                {canEdit && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-4 flex flex-col gap-3">
                      <Button
                        onClick={handleSaveStore}
                        disabled={isSaving}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        {isSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Business Details
                          </>
                        )}
                      </Button>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Changes immediately update the public website, footer, and contact channels.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 2: SOCIAL MEDIA CHANNELS */}
        {/* ==================================================================== */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-serif">Connected Social Channels</CardTitle>
                <CardDescription>
                  Manage Instagram, YouTube, Facebook, and WhatsApp links rendered across the website.
                </CardDescription>
              </div>
              {canEdit && (
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingSocialLink({
                      platform: "instagram",
                      display_name: "Instagram",
                      handle: "@",
                      url: "https://",
                      is_enabled: true,
                      order: socialLinks.length + 1,
                    })
                    setIsSocialModalOpen(true)
                  }}
                  className="bg-primary text-primary-foreground"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Social Link
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {socialLinks.map((link) => (
                  <div key={link.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {link.platform === "instagram" && <Instagram className="h-5 w-5 text-pink-600" />}
                        {link.platform === "youtube" && <Youtube className="h-5 w-5 text-red-600" />}
                        {link.platform === "facebook" && <Facebook className="h-5 w-5 text-blue-600" />}
                        {link.platform === "whatsapp" && <MessageCircle className="h-5 w-5 text-green-600" />}
                        {link.platform === "other" && <Globe className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-foreground text-sm truncate">{link.display_name}</h4>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono">
                            {link.platform}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{link.handle || link.url}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-primary hover:underline flex items-center gap-1 mt-0.5"
                        >
                          {link.url} <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {link.is_enabled ? "Active" : "Disabled"}
                        </span>
                        <Switch
                          disabled={!canEdit}
                          checked={link.is_enabled}
                          onCheckedChange={() => handleToggleSocial(link.id)}
                        />
                      </div>

                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSocialLink(link)
                            setIsSocialModalOpen(true)
                          }}
                          className="text-xs h-8 px-2"
                        >
                          Edit
                        </Button>
                      )}

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSocial(link.id)}
                          className="text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 3: HOMEPAGE HERO BANNER */}
        {/* ==================================================================== */}
        <TabsContent value="hero" className="space-y-6">
          {heroSection && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-serif">Hero Banner Copy & Headings</CardTitle>
                        <CardDescription>Configure the main title, badge text, and introductory statement.</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Show Hero</span>
                        <Switch
                          disabled={!canEdit}
                          checked={heroSection.is_active}
                          onCheckedChange={(checked) => {
                            setHeroSection({ ...heroSection, is_active: checked })
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Badge Announcement Pill
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={heroSection.badge_text}
                        onChange={(e) => {
                          setHeroSection({ ...heroSection, badge_text: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. New Season Arrivals"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Main Headline *
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={heroSection.heading}
                        onChange={(e) => {
                          setHeroSection({ ...heroSection, heading: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. Style that Speaks. Fashion that Lasts."
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Subheading / Introductory Text *
                      </label>
                      <Textarea
                        disabled={!canEdit}
                        rows={3}
                        value={heroSection.subheading}
                        onChange={(e) => {
                          setHeroSection({ ...heroSection, subheading: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="Discover authentic Assamese Mekhela Sadors, sarees, and handcrafted fashion..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Primary CTA Text
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.cta_text}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, cta_text: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Shop Collection"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Primary CTA Link
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.cta_link}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, cta_link: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. /shop"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Secondary CTA Text
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.secondary_cta_text}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, secondary_cta_text: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Follow Us"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Secondary CTA Link
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.secondary_cta_link}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, secondary_cta_link: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. https://www.instagram.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Floating Card Title
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.floating_card_title}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, floating_card_title: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Handcrafted Mekhela Sador"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                          Floating Card Subtitle
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={heroSection.floating_card_subtitle}
                          onChange={(e) => {
                            setHeroSection({ ...heroSection, floating_card_subtitle: e.target.value })
                            setHasChanges(true)
                          }}
                          placeholder="e.g. Explore our handpicked curation..."
                        />
                      </div>
                    </div>
                  </CardContent>
                  {canEdit && (
                    <CardFooter className="bg-muted/30 border-t border-border flex justify-end">
                      <Button onClick={handleSaveHero} disabled={isSaving} className="bg-primary text-primary-foreground font-semibold">
                        {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Hero Banner
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Hero Image & Live Preview */}
              <div className="lg:col-span-5 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif">Hero Showcase Image</CardTitle>
                    <CardDescription>Upload a high-resolution photo of traditional Assamese wear.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border border-border">
                      <img
                        src={heroSection.image_url || heroSection.image_url_fallback || "/images/branding/og-image.jpg"}
                        alt={heroSection.image_alt || "Hero Preview"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Image Alt Description (SEO & Accessibility)
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={heroSection.image_alt}
                        onChange={(e) => {
                          setHeroSection({ ...heroSection, image_alt: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. Handcrafted Mekhela Sador collection"
                      />
                    </div>

                    {canEdit && (
                      <div>
                        <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                          Upload New Hero Image
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageUpload}
                            disabled={isSaving}
                            className="cursor-pointer"
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Recommended format: 1200x800px, JPG/WebP under 2MB. Uploads securely to Cloudinary.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 4: ABOUT US PAGE */}
        {/* ==================================================================== */}
        <TabsContent value="about" className="space-y-6">
          {aboutPage && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">About Us Page Header</CardTitle>
                  <CardDescription>Top banner title, subtitle, and intro statement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Page Title *
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={aboutPage.title}
                        onChange={(e) => {
                          setAboutPage({ ...aboutPage, title: e.target.value })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Subtitle / Tagline
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={aboutPage.subtitle}
                        onChange={(e) => {
                          setAboutPage({ ...aboutPage, subtitle: e.target.value })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Story Paragraphs */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif">Heritage Story & Paragraphs</CardTitle>
                    <CardDescription>Edit the story paragraphs detailing the boutique's weaving heritage.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const paras = aboutPage.content_json?.story_paragraphs || []
                        setAboutPage({
                          ...aboutPage,
                          content_json: {
                            ...aboutPage.content_json,
                            story_paragraphs: [...paras, "New paragraph detailing our weavers and heritage..."]
                          }
                        })
                        setHasChanges(true)
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Paragraph
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {(aboutPage.content_json?.story_paragraphs || []).map((para: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-xs font-bold text-muted-foreground mt-2 w-6 shrink-0">#{idx + 1}</span>
                      <Textarea
                        disabled={!canEdit}
                        rows={3}
                        value={para}
                        onChange={(e) => {
                          const updated = [...(aboutPage.content_json?.story_paragraphs || [])]
                          updated[idx] = e.target.value
                          setAboutPage({
                            ...aboutPage,
                            content_json: { ...aboutPage.content_json, story_paragraphs: updated }
                          })
                          setHasChanges(true)
                        }}
                        className="flex-1"
                      />
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const updated = (aboutPage.content_json?.story_paragraphs || []).filter((_: any, i: number) => i !== idx)
                            setAboutPage({
                              ...aboutPage,
                              content_json: { ...aboutPage.content_json, story_paragraphs: updated }
                            })
                            setHasChanges(true)
                          }}
                          className="text-destructive hover:bg-destructive/10 shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Core Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Core Brand Values</CardTitle>
                  <CardDescription>3 key pillars displayed in the middle section of the About page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(aboutPage.content_json?.core_values || []).map((val: any, idx: number) => (
                      <div key={idx} className="border border-border/60 rounded-xl p-4 space-y-2 bg-muted/20">
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                          Value #{idx + 1} Title
                        </label>
                        <Input
                          disabled={!canEdit}
                          value={val.title}
                          onChange={(e) => {
                            const updated = [...(aboutPage.content_json?.core_values || [])]
                            updated[idx] = { ...updated[idx], title: e.target.value }
                            setAboutPage({
                              ...aboutPage,
                              content_json: { ...aboutPage.content_json, core_values: updated }
                            })
                            setHasChanges(true)
                          }}
                        />
                        <label className="text-xs font-semibold text-foreground uppercase tracking-wider block pt-1">
                          Description
                        </label>
                        <Textarea
                          disabled={!canEdit}
                          rows={3}
                          value={val.description}
                          onChange={(e) => {
                            const updated = [...(aboutPage.content_json?.core_values || [])]
                            updated[idx] = { ...updated[idx], description: e.target.value }
                            setAboutPage({
                              ...aboutPage,
                              content_json: { ...aboutPage.content_json, core_values: updated }
                            })
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Story Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">About Page Story Image</CardTitle>
                  <CardDescription>Main photo displayed next to the heritage story.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-40 h-28 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                      <img
                        src={aboutPage.hero_image_url || aboutPage.story_image_url || "/images/branding/og-image.jpg"}
                        alt="About Story Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {canEdit && (
                      <div className="space-y-2 flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAboutImageUpload(e, 'story')}
                          disabled={isSaving}
                          className="cursor-pointer"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Uploads directly to Cloudinary media storage.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                {canEdit && (
                  <CardFooter className="bg-muted/30 border-t border-border flex justify-end">
                    <Button
                      onClick={() => handleSavePage(aboutPage, setAboutPage, "About Us page")}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-semibold"
                    >
                      {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save About Us Content
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 5: PRIVACY POLICY */}
        {/* ==================================================================== */}
        <TabsContent value="privacy" className="space-y-6">
          {privacyPage && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Privacy Policy Header & Intro</CardTitle>
                  <CardDescription>Last updated date and commitment statement.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Page Title
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={privacyPage.title}
                        onChange={(e) => {
                          setPrivacyPage({ ...privacyPage, title: e.target.value })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Last Updated Display Date
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={privacyPage.last_updated_date}
                        onChange={(e) => {
                          setPrivacyPage({ ...privacyPage, last_updated_date: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. January 15, 2024"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                      Introductory Statement
                    </label>
                    <Textarea
                      disabled={!canEdit}
                      rows={3}
                      value={privacyPage.intro}
                      onChange={(e) => {
                        setPrivacyPage({ ...privacyPage, intro: e.target.value })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Structured Sections */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif">Structured Policy Articles</CardTitle>
                    <CardDescription>Numbered policy sections with clean clauses and bullet points.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const current = privacyPage.content_json?.sections || []
                        const nextNum = current.length + 1
                        setPrivacyPage({
                          ...privacyPage,
                          content_json: {
                            ...privacyPage.content_json,
                            sections: [
                              ...current,
                              {
                                heading: `${nextNum}. New Policy Clause`,
                                content: "Policy clause description explaining terms to customers...",
                                bullets: []
                              }
                            ]
                          }
                        })
                        setHasChanges(true)
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Article
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {(privacyPage.content_json?.sections || []).map((sec: any, idx: number) => (
                    <div key={idx} className="border border-border/70 rounded-xl p-4 space-y-3 bg-muted/10">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          disabled={!canEdit}
                          value={sec.heading}
                          onChange={(e) => {
                            const updated = [...(privacyPage.content_json?.sections || [])]
                            updated[idx] = { ...updated[idx], heading: e.target.value }
                            setPrivacyPage({
                              ...privacyPage,
                              content_json: { ...privacyPage.content_json, sections: updated }
                            })
                            setHasChanges(true)
                          }}
                          className="font-semibold text-sm"
                        />
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = (privacyPage.content_json?.sections || []).filter((_: any, i: number) => i !== idx)
                              setPrivacyPage({
                                ...privacyPage,
                                content_json: { ...privacyPage.content_json, sections: updated }
                              })
                              setHasChanges(true)
                            }}
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Textarea
                        disabled={!canEdit}
                        rows={2}
                        value={sec.content}
                        onChange={(e) => {
                          const updated = [...(privacyPage.content_json?.sections || [])]
                          updated[idx] = { ...updated[idx], content: e.target.value }
                          setPrivacyPage({
                            ...privacyPage,
                            content_json: { ...privacyPage.content_json, sections: updated }
                          })
                          setHasChanges(true)
                        }}
                        placeholder="Article summary..."
                      />
                    </div>
                  ))}
                </CardContent>
                {canEdit && (
                  <CardFooter className="bg-muted/30 border-t border-border flex justify-end">
                    <Button
                      onClick={() => handleSavePage(privacyPage, setPrivacyPage, "Privacy Policy")}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-semibold"
                    >
                      {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Privacy Policy
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 6: TERMS OF SERVICE */}
        {/* ==================================================================== */}
        <TabsContent value="terms" className="space-y-6">
          {termsPage && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Terms of Service Header & Intro</CardTitle>
                  <CardDescription>Last updated date and customer agreement preamble.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Page Title
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={termsPage.title}
                        onChange={(e) => {
                          setTermsPage({ ...termsPage, title: e.target.value })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                        Last Updated Display Date
                      </label>
                      <Input
                        disabled={!canEdit}
                        value={termsPage.last_updated_date}
                        onChange={(e) => {
                          setTermsPage({ ...termsPage, last_updated_date: e.target.value })
                          setHasChanges(true)
                        }}
                        placeholder="e.g. January 15, 2024"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                      Introductory Statement
                    </label>
                    <Textarea
                      disabled={!canEdit}
                      rows={3}
                      value={termsPage.intro}
                      onChange={(e) => {
                        setTermsPage({ ...termsPage, intro: e.target.value })
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Structured Terms Sections */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg font-serif">Terms & Ordering Clauses</CardTitle>
                    <CardDescription>Clauses on handloom authenticity, UPI payment, shipping, and returns.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const current = termsPage.content_json?.sections || []
                        const nextNum = current.length + 1
                        setTermsPage({
                          ...termsPage,
                          content_json: {
                            ...termsPage.content_json,
                            sections: [
                              ...current,
                              {
                                heading: `${nextNum}. New Terms Clause`,
                                content: "Clause details regarding customer purchase agreements...",
                                bullets: []
                              }
                            ]
                          }
                        })
                        setHasChanges(true)
                      }}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Clause
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {(termsPage.content_json?.sections || []).map((sec: any, idx: number) => (
                    <div key={idx} className="border border-border/70 rounded-xl p-4 space-y-3 bg-muted/10">
                      <div className="flex items-center justify-between gap-2">
                        <Input
                          disabled={!canEdit}
                          value={sec.heading}
                          onChange={(e) => {
                            const updated = [...(termsPage.content_json?.sections || [])]
                            updated[idx] = { ...updated[idx], heading: e.target.value }
                            setTermsPage({
                              ...termsPage,
                              content_json: { ...termsPage.content_json, sections: updated }
                            })
                            setHasChanges(true)
                          }}
                          className="font-semibold text-sm"
                        />
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const updated = (termsPage.content_json?.sections || []).filter((_: any, i: number) => i !== idx)
                              setTermsPage({
                                ...termsPage,
                                content_json: { ...termsPage.content_json, sections: updated }
                              })
                              setHasChanges(true)
                            }}
                            className="text-destructive hover:bg-destructive/10 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <Textarea
                        disabled={!canEdit}
                        rows={2}
                        value={sec.content}
                        onChange={(e) => {
                          const updated = [...(termsPage.content_json?.sections || [])]
                          updated[idx] = { ...updated[idx], content: e.target.value }
                          setTermsPage({
                            ...termsPage,
                            content_json: { ...termsPage.content_json, sections: updated }
                          })
                          setHasChanges(true)
                        }}
                        placeholder="Clause summary..."
                      />
                    </div>
                  ))}
                </CardContent>
                {canEdit && (
                  <CardFooter className="bg-muted/30 border-t border-border flex justify-end">
                    <Button
                      onClick={() => handleSavePage(termsPage, setTermsPage, "Terms of Service")}
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-semibold"
                    >
                      {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save Terms of Service
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ==================================================================== */}
        {/* TAB 7: BRAND ASSETS & GLOBAL SEO */}
        {/* ==================================================================== */}
        <TabsContent value="branding" className="space-y-6">
          {storeProfile && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Brand Asset Uploads */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Brand Imagery & Social Sharing</CardTitle>
                  <CardDescription>Manage your store logo, favicon, and OpenGraph social banner.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* OG Share Image */}
                  <div className="border border-border/70 rounded-xl p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">OpenGraph Social Share Image</h4>
                        <p className="text-xs text-muted-foreground">Preview image rendered when links are shared on WhatsApp & Facebook.</p>
                      </div>
                    </div>
                    <div className="relative aspect-[1.91/1] rounded-lg overflow-hidden bg-muted border border-border">
                      <img
                        src={storeProfile.og_share_image_url || "/images/branding/og-image.jpg"}
                        alt="OG Share Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {canEdit && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBrandAssetUpload(e, "og_share_image")}
                        disabled={isSaving}
                        className="cursor-pointer"
                      />
                    )}
                  </div>

                  {/* Logo Image */}
                  <div className="border border-border/70 rounded-xl p-4 space-y-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">Brand Logo</h4>
                        <p className="text-xs text-muted-foreground">High resolution vector or transparent PNG logo.</p>
                      </div>
                    </div>
                    {storeProfile.logo_url && (
                      <div className="w-24 h-12 rounded bg-white p-2 flex items-center justify-center border">
                        <img src={storeProfile.logo_url} alt="Logo" className="max-h-full object-contain" />
                      </div>
                    )}
                    {canEdit && (
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBrandAssetUpload(e, "logo_image")}
                        disabled={isSaving}
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Global SEO Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-serif">Global Storefront SEO & Metadata</CardTitle>
                  <CardDescription>Search engine title tags, meta description, and keywords.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                      Default Meta Title *
                    </label>
                    <Input
                      disabled={!canEdit}
                      value={storeProfile.meta_title}
                      onChange={(e) => {
                        setStoreProfile({ ...storeProfile, meta_title: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="e.g. Ms Ebasi Store | Authentic Assamese Traditional Attire"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                      Default Meta Description *
                    </label>
                    <Textarea
                      disabled={!canEdit}
                      rows={4}
                      value={storeProfile.meta_description}
                      onChange={(e) => {
                        setStoreProfile({ ...storeProfile, meta_description: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="Discover authentic Assamese Mekhela Sador, Deori Egu-Jokasiba..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                      Meta Keywords
                    </label>
                    <Input
                      disabled={!canEdit}
                      value={storeProfile.meta_keywords}
                      onChange={(e) => {
                        setStoreProfile({ ...storeProfile, meta_keywords: e.target.value })
                        setHasChanges(true)
                      }}
                      placeholder="Assamese handloom, Mekhela Sador, Deori Egu-Jokasiba, Dhemaji"
                    />
                  </div>
                </CardContent>
                {canEdit && (
                  <CardFooter className="bg-muted/30 border-t border-border flex justify-end">
                    <Button onClick={handleSaveStore} disabled={isSaving} className="bg-primary text-primary-foreground font-semibold">
                      {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                      Save SEO Settings
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Social Link Create/Edit Modal */}
      <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingSocialLink?.id ? "Edit Social Channel" : "Add Social Media Link"}
            </DialogTitle>
            <DialogDescription>
              Configure the social platform, handle, and full destination link.
            </DialogDescription>
          </DialogHeader>

          {editingSocialLink && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                  Platform *
                </label>
                <select
                  value={editingSocialLink.platform || "instagram"}
                  onChange={(e) => {
                    const plat = e.target.value as any
                    setEditingSocialLink({
                      ...editingSocialLink,
                      platform: plat,
                      display_name:
                        plat === "instagram"
                          ? "Instagram"
                          : plat === "youtube"
                          ? "YouTube Channel"
                          : plat === "facebook"
                          ? "Facebook Page"
                          : plat === "whatsapp"
                          ? "WhatsApp Support"
                          : "Social Link",
                    })
                  }}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="other">Other Website</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                  Display Label *
                </label>
                <Input
                  value={editingSocialLink.display_name || ""}
                  onChange={(e) =>
                    setEditingSocialLink({ ...editingSocialLink, display_name: e.target.value })
                  }
                  placeholder="e.g. Instagram"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                  Handle / Username
                </label>
                <Input
                  value={editingSocialLink.handle || ""}
                  onChange={(e) =>
                    setEditingSocialLink({ ...editingSocialLink, handle: e.target.value })
                  }
                  placeholder="e.g. @ebasistore_traditionalattire"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1.5">
                  Destination URL *
                </label>
                <Input
                  value={editingSocialLink.url || ""}
                  onChange={(e) =>
                    setEditingSocialLink({ ...editingSocialLink, url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-foreground font-medium">Enable on Website</span>
                <Switch
                  checked={editingSocialLink.is_enabled ?? true}
                  onCheckedChange={(checked) =>
                    setEditingSocialLink({ ...editingSocialLink, is_enabled: checked })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSocialModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSocialModal} className="bg-primary text-primary-foreground font-semibold">
              Save Channel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
