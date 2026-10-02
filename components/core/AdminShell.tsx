"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/core/Header";
import Sidebare from "@/components/core/Sidebare";

type AdminNavigationContextValue = {
  activeNav: string;
  setActiveNav: (value: string) => void;
};

const AdminNavigationContext = createContext<AdminNavigationContextValue | null>(null);

export function useAdminNavigation() {
  const context = useContext(AdminNavigationContext);
  if (!context) throw new Error("useAdminNavigation must be used inside AdminShell.");
  return context;
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("All notes");
  const [mobileNav, setMobileNav] = useState(false);
  const isEditorRoute = pathname === "/create" || pathname.startsWith("/update/");

  const handleActiveNavChange = (value: string) => {
    setActiveNav(value);
    setMobileNav(false);

    const destination = value === "Settings" ? "/profile" : "/dashboard";
    if (pathname !== destination) router.push(destination);
  };

  if (isEditorRoute) return children;

  const sidebarActiveNav =
    pathname === "/profile" ? "Settings" : pathname === "/dashboard" ? activeNav : "All notes";

  return (
    <AdminNavigationContext.Provider value={{ activeNav, setActiveNav }}>
      <main className="dashboard-shell flex h-dvh w-full overflow-hidden bg-[#f5f5ef] text-[#1f2825]">
        <Sidebare
          activeNav={sidebarActiveNav}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
          setActiveNav={handleActiveNavChange}
        />
        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Header setMobileNav={setMobileNav} />
          <div className="min-h-0 flex-1 overflow-y-auto *:scrollbar-thin *:scrollbar-track-transparent *:scrollbar-thumb-black/20">
            {children}
          </div>
        </section>
      </main>
    </AdminNavigationContext.Provider>
  );
}
