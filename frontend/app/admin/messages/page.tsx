"use client"

import React, { useState, useEffect } from "react"
import {
  Inbox,
  Search,
  Mail,
  Phone,
  MessageCircle,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  ExternalLink,
  Send,
  User,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { adminApi, AdminContactMessage } from "@/lib/admin-api"
import { STORE_INFO } from "@/lib/constants"
import { cn } from "@/lib/utils"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all")

  // Selected message for detail view
  const [selectedMessage, setSelectedMessage] = useState<AdminContactMessage | null>(null)

  // Deleting message
  const [deletingMessage, setDeletingMessage] = useState<AdminContactMessage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const isInitialMount = React.useRef(true)

  const loadMessages = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminApi.getContactMessages({
        search: searchQuery,
        is_read: readFilter === "all" ? undefined : readFilter === "read",
      })
      setMessages(res.results || [])
    } catch (err: any) {
      setError(err.message || "Failed to load inquiries.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      loadMessages()
      return
    }

    const timer = setTimeout(() => {
      loadMessages()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, readFilter])

  const handleToggleRead = async (msg: AdminContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      if (msg.is_read) {
        await adminApi.markMessageUnread(msg.id)
      } else {
        await adminApi.markMessageRead(msg.id)
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
      )
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, is_read: !prev.is_read } : null))
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`)
    }
  }

  const openMessageModal = async (msg: AdminContactMessage) => {
    setSelectedMessage(msg)
    // Auto mark as read on open if currently unread
    if (!msg.is_read) {
      try {
        await adminApi.markMessageRead(msg.id)
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
        )
      } catch {}
    }
  }

  const handleDeleteMessage = async () => {
    if (!deletingMessage) return
    setIsDeleting(true)
    try {
      await adminApi.deleteMessage(deletingMessage.id)
      if (selectedMessage?.id === deletingMessage.id) {
        setSelectedMessage(null)
      }
      setDeletingMessage(null)
      loadMessages()
    } catch (err: any) {
      alert(`Failed to delete message: ${err.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const unreadCount = messages.filter((m) => !m.is_read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Customer Inquiries & Messages
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Direct questions, boutique appointments, and customer support inquiries.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadMessages()}
          className="h-9 px-3 rounded-xl border-border/70 text-xs self-start sm:self-auto"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border/50 self-start">
          <button
            type="button"
            onClick={() => setReadFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              readFilter === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setReadFilter("unread")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
              readFilter === "unread"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className={cn("px-1.5 py-0.2 rounded-full text-[10px] font-bold", readFilter === "unread" ? "bg-white text-primary" : "bg-primary text-white")}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setReadFilter("read")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
              readFilter === "read"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Read Archive
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-xl text-xs bg-card"
          />
        </div>
      </div>

      {/* Messages List */}
      <Card className="rounded-2xl border-border/70 shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Skeleton className="h-4 w-40 rounded" />
                      <Skeleton className="h-3 w-64 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20 rounded hidden sm:block" />
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <p className="font-semibold text-foreground">No customer inquiries found.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessageModal(msg)}
                  className={cn(
                    "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-muted/40 transition-colors group",
                    !msg.is_read && "bg-primary/[0.03] border-l-4 border-l-primary"
                  )}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* User Avatar */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0",
                        !msg.is_read
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {msg.name ? msg.name.charAt(0).toUpperCase() : "C"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-foreground">
                          {msg.name}
                        </span>
                        {!msg.is_read && (
                          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.2">
                            New
                          </Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="text-[11px] text-muted-foreground font-mono">
                            • {msg.phone}
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-semibold text-foreground mt-1 truncate">
                        {msg.subject || "General Inquiry"}
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="flex items-center gap-1">
                      {adminApi.hasPermission("messages.update") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleToggleRead(msg, e)}
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                          title={msg.is_read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle2 className={cn("w-4 h-4", msg.is_read && "text-emerald-500")} />
                        </Button>
                      )}
                      {adminApi.hasPermission("messages.delete") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeletingMessage(msg)
                          }}
                          className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )))}
          </div>
        </CardContent>
      </Card>

      {/* FULL MESSAGE DETAIL MODAL */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {new Date(selectedMessage.created_at).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRead(selectedMessage)}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    {selectedMessage.is_read ? "Mark as Unread" : "Mark as Read"}
                  </Button>
                </div>
                <DialogTitle className="text-lg sm:text-xl font-serif font-bold text-foreground mt-2">
                  {selectedMessage.subject || "Customer Inquiry"}
                </DialogTitle>
              </DialogHeader>

              {/* Sender Details Box */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold text-foreground">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-foreground">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    <a href={`tel:${selectedMessage.phone}`} className="hover:underline text-foreground">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="py-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Message Content:
                </h4>
                <div className="p-4 rounded-xl bg-background border border-border text-xs sm:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingMessage(selectedMessage)}
                  className="text-xs text-destructive hover:bg-destructive/10 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedMessage.phone && (
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${selectedMessage.name}, thank you for contacting ${STORE_INFO.name}. Regarding your message "${selectedMessage.subject}":`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial"
                    >
                      <Button
                        size="sm"
                        className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        Reply on WhatsApp
                      </Button>
                    </a>
                  )}

                  <a
                    href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                      `Re: ${selectedMessage.subject || "Your Ebasi Store Inquiry"}`
                    )}`}
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-9 rounded-xl text-xs gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Email Reply
                    </Button>
                  </a>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-serif font-bold text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete Inquiry
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to permanently delete this message from &quot;{deletingMessage?.name}&quot;?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingMessage(null)}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMessage}
              disabled={isDeleting}
              className="h-9 rounded-xl text-xs font-semibold"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
