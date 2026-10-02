import type { ReactNode } from "react";
import AdminShell from "@/components/core/AdminShell";
import { Toaster } from "@/components/ui/toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster />
    </AdminShell>
  );
}
