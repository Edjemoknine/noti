import { Bell, Menu } from "lucide-react";
import SearchBar from "./SearchBar";
type HeaderProps = {
  setMobileNav: (value: boolean) => void;
};
const Header = ({ setMobileNav }: HeaderProps) => {
  return (
    <header className="flex h-[76px] items-center justify-between border-b border-black/[0.06] px-5 sm:px-8 lg:px-12">
      <button aria-label="Open menu" onClick={() => setMobileNav(true)} className="mr-3 lg:hidden">
        <Menu size={20} />
      </button>
      <SearchBar />
      <div className="ml-4 flex items-center gap-4">
        <button aria-label="Notifications" className="text-[#8f8c89] hover:text-[#292431]">
          <Bell size={18} />
        </button>
        <div className="hidden h-6 w-px bg-black/[0.08] sm:block" />
        <span className="hidden text-xs text-[#aaa7a5] sm:block">Monday, September 22</span>
      </div>
    </header>
  );
};

export default Header;
