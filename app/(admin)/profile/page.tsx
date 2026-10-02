"use client";

import { UserProfile } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Header from "@/components/core/Header";
import Sidebare from "@/components/core/Sidebare";

export default function ProfilePage() {
  const [mobileNav, setMobileNav] = useState(false);
  const router = useRouter();

  return (
    <main className="dashboard-shell flex h-screen w-full overflow-hidden bg-[#f5f5ef] text-[#1f2825]">
      <Sidebare
        activeNav="Settings"
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        setActiveNav={() => router.push("/dashboard")}
      />
      <section className="min-w-0 flex-1 lg:pb-20">
        <Header setMobileNav={setMobileNav} />
        <div className="h-full overflow-y-auto px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#78942b]">
                Account
              </p>
              <h1 className="text-3xl font-semibold text-[#292431]">Profile settings</h1>
            </div>
            <UserProfile
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "!w-full !max-w-none !rounded-xl !border-black/8 !bg-[#fffefa] !shadow-sm",
                },
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
