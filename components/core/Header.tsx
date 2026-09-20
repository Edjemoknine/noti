import {
  Bell,
  Menu,
  Search,
} from "lucide-react";type HeaderProps = {
  search: string;
  setSearch: (value: string) => void;
  setMobileNav: (value: boolean) => void;
};
const Header = ({ search, setSearch, setMobileNav }: HeaderProps) => {
  return (
  <header className="flex h-[76px] items-center justify-between border-b border-black/[0.06] px-5 sm:px-8 lg:px-12">
          <button
            aria-label="Open menu"
            onClick={() => setMobileNav(true)}
            className="mr-3 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="relative max-w-[350px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa7a5]" />
            <input
              aria-label="Search notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your notes..."
              className="h-10 w-full rounded-xl border border-black/[0.06] bg-white/70 pl-10 pr-4 text-sm outline-none placeholder:text-[#b5b2b0] focus:border-[#b5a6e6] focus:ring-2 focus:ring-[#b5a6e6]/20"
            />
          </div>
          <div className="ml-4 flex items-center gap-4">
            <button aria-label="Notifications" className="text-[#8f8c89] hover:text-[#292431]">
              <Bell size={18} />
            </button>
            <div className="hidden h-6 w-px bg-black/[0.08] sm:block" />
            <span className="hidden text-xs text-[#aaa7a5] sm:block">Monday, September 22</span>
          </div>
        </header>  )
}

export default Header