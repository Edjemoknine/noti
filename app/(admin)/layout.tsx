import type { ReactNode } from "react";
import AdminShell from "@/components/core/AdminShell";
import { Toaster } from "@/components/ui/toast";
import { NotiChat } from "@/components/core/noti-chat";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster />
      <NotiChat />
    </AdminShell>
  );
}
