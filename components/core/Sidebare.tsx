import { SignOutButton } from "@clerk/nextjs";
import {
  Archive,
  FileText,
  Folder,
  LogOut,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
const navItems = [
  { label: "All notes", icon: FileText, count: 128 },
  { label: "Starred", icon: Star, count: 12 },
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
  return (
    <>
      <aside
        className={`  ${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-black/[0.06] bg-[#f8f8f2] px-5 py-6 transition-transform lg:relative lg:translate-x-0 justify-between`}
      >
        <div className="flex flex-col">
          <div className="mb-9 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#282330] text-white shadow-sm">
                <Sparkles size={16} />
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

          <button
            onClick={() => router.push("/create")}
            className="mb-8 px-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1f2825] text-sm font-medium text-white shadow-[0_4px_12px_rgba(40,30,50,.12)] transition hover:bg-[#3b3347]"
          >
            <Plus size={16} /> New note{" "}
            <span className="ml-auto mr-3 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/60">
              ⌘ N
            </span>
          </button>

          <nav className="space-y-1">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa8a6]">
              Workspace
            </p>
            {navItems.map(({ label, icon: Icon, count }) => (
              <button
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  setMobileNav(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] ${activeNav === label ? "bg-[#efedf4] font-semibold text-[#30293a]" : "text-[#777472] hover:bg-black/[0.03]"}`}
              >
                <Icon size={16} strokeWidth={activeNav === label ? 2.2 : 1.8} />
                <span>{label}</span>
                {count && <span className="ml-auto text-[11px] text-[#aaa7a5]">{count}</span>}
              </button>
            ))}
          </nav>

          <div className="mt-8 space-y-1">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa8a6]">
              Collections
            </p>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#777472] hover:bg-black/[0.03]">
              <Folder size={16} className="text-[#8d7ad0]" /> Product thinking
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#777472] hover:bg-black/[0.03]">
              <Folder size={16} className="text-[#e4a75f]" /> Personal
            </button>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#777472] hover:bg-black/[0.03]">
              <Folder size={16} className="text-[#6fb7a5]" /> Reading list
            </button>
            <button className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#aaa7a5] hover:bg-black/[0.03]">
              <Plus size={15} /> New collection
            </button>
          </div>
        </div>
        <div className="mt-auto space-y-1 border-t border-black/[0.06] pt-5">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] text-[#777472] hover:bg-black/[0.03]">
            <Settings size={16} /> Settings
          </button>
          <div className="mt-4 flex items-center gap-3 px-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d9c9bd] text-xs font-semibold text-[#604e43]">
              JD
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">Jordan Davis</p>
              <p className="text-[11px] text-[#aaa7a5]">Personal workspace</p>
            </div>
            <MoreHorizontal size={16} className="ml-auto text-[#aaa7a5]" />
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
