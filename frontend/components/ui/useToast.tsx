"use client";
import * as React from "react";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";

export function useToast() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<{ title?: string; description?: string; } | null>(null);

  function toast(opts: { title: string; description?: string }) {
    setOptions(opts);
    setOpen(true);
  }

  function RenderToast() {
    if (!options) return null;
    return (
      <Toast open={open} onOpenChange={setOpen}>
        <ToastTitle>{options.title}</ToastTitle>
        {options.description && <ToastDescription>{options.description}</ToastDescription>}
      </Toast>
    );
  }

  return { toast, RenderToast };
}
