"use client";

import Image from "next/image";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Archive, FileText, LogOut, Plus, Settings, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
const navItems = [
  { label: "All notes", icon: FileText },
  { label: "Starred", icon: Star },
  { label: "Archive", icon: Archive },
];
type SidebareProps = {
  mobileNav: boolean;
  setMobileNav: (value: boolean) => void;
  setActiveNav: (value: string) => void;
  activeNav: string;
};
const Sidebare = ({ mobileNav, setMobileNav, setActiveNav, activeNav }: SidebareProps) => {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const displayName = user?.fullName || user?.username || "Your account";
  const email = user?.primaryEmailAddress?.emailAddress || "Signed in";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <>
      <aside
        className={`  ${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-black/[0.06] bg-[#f8f8f2] px-5 py-6 transition-transform lg:relative lg:translate-x-0 justify-between`}
      >
        <div className="flex flex-col">
          <div className="mb-9 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#282330] text-white shadow-sm">
                <Image
                  src="/noti.png"
                  alt="Noti logo"
                  width={32}
                  height={32}
                  className="size-8 rounded-[10px] object-cover"
                />
              </div>
              <span className="text-[17px] font-semibold tracking-[-0.03em]">
                noti<span className="text-[#78942b]">.</span>
              </span>
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setMobileNav(false)}
              className="lg:hidden"
            >
              <X size={19} />
            </button>
          </div>

          <Button
            onClick={() => router.push("/create")}
            className="mb-8 px-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary text-sm font-medium text-white shadow-[0_4px_12px_rgba(40,30,50,.12)] transition hover:bg-[#3b3347]"
          >
            <Plus size={16} /> New note{" "}
            <span className="ml-auto mr-3 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
              ⌘ N
            </span>
          </Button>

          <nav className="space-y-1">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa8a6]">
              Workspace
            </p>
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setActiveNav(label);
                  setMobileNav(false);
                }}
                aria-current={activeNav === label ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] ${activeNav === label ? "bg-[#efedf4] font-semibold text-[#30293a]" : "text-[#777472] hover:bg-black/[0.03]"}`}
              >
                <Icon size={16} strokeWidth={activeNav === label ? 2.2 : 1.8} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto space-y-1 border-t border-black/[0.06] pt-5">
          <button
            type="button"
            onClick={() => setActiveNav("Settings")}
            aria-current={activeNav === "Settings" ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] ${activeNav === "Settings" ? "bg-[#efedf4] font-semibold text-[#30293a]" : "text-[#777472] hover:bg-black/[0.03]"}`}
          >
            <Settings size={16} /> Settings
          </button>
          <div className="mt-4 flex items-center gap-3 px-3">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              aria-label="Open profile settings"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
            >
              {isLoaded && user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e8edcf] text-xs font-semibold text-[#53631f]">
                  {isLoaded ? initials || "U" : "…"}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">
                  {isLoaded ? displayName : "Loading profile"}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-[#aaa7a5]">
                  {isLoaded ? email : " "}
                </span>
              </span>
            </button>
            <SignOutButton redirectUrl="/">
              <button
                aria-label="Log out"
                title="Log out"
                className="text-[#aaa7a5] transition hover:text-[#292431]"
              >
                <LogOut size={16} />
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>

      {mobileNav && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setMobileNav(false)}
        />
      )}
    </>
  );
};

export default Sidebare;
