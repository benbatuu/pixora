"use client";

import type { ReactNode } from "react";
import { ConfirmProvider } from "./ConfirmDialog";
import { ToastProvider } from "./ToastProvider";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  );
}
