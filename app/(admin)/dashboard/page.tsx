"use client";

import { useMemo, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import {
  Archive,
  ArrowUpRight,
  Bell,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  FileText,
  Folder,
  Hash,
  LayoutGrid,
  Lightbulb,
  LogOut,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
  Zap,
} from "lucide-react";

const initialNotes = [
  {
    title: "Q4 product strategy",
    excerpt: "The main opportunity is to make insights feel inevitable, not like another task...",
    date: "Today, 10:42 AM",
    tag: "Product",
    color: "violet",
    starred: true,
  },
  {
    title: "Ideas for the new onboarding",
    excerpt:
      "A softer first-run experience. Let people start with a thought instead of a blank page.",
    date: "Yesterday",
    tag: "Ideas",
    color: "amber",
    starred: false,
  },
  {
    title: "Team offsite — Lisbon",
    excerpt: "Things to bring: analog camera, comfortable shoes, and a very open mind.",
    date: "Sep 16",
    tag: "Personal",
    color: "teal",
    starred: false,
  },
  {
    title: "Reading notes: The Creative Act",
    excerpt: "Create an environment where the next idea has somewhere to land.",
    date: "Sep 14",
    tag: "Reading",
    color: "blue",
    starred: true,
  },
];

const navItems = [
  { label: "All notes", icon: FileText, count: 128 },
  { label: "Starred", icon: Star, count: 12 },
  { label: "Archive", icon: Archive },
];

export default function Page() {
  const [notes, setNotes] = useState(initialNotes);
  const [activeNav, setActiveNav] = useState("All notes");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => {
        const matchesSearch = `${note.title} ${note.excerpt} ${note.tag}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesNav = activeNav !== "Starred" || note.starred;
        return matchesSearch && matchesNav;
      }),
    [notes, search, activeNav],
  );

  function createNote() {
    if (!newNote.trim()) return;
    setNotes([
      {
        title: newNote.trim(),
        excerpt: "A new thought, ready to become something more.",
        date: "Just now",
        tag: "Inbox",
        color: "violet",
        starred: false,
      },
      ...notes,
    ]);
    setNewNote("");
    setShowComposer(false);
  }

  return (
    <main className="min-h-screen bg-[#f5f5ef] text-[#1f2825] dashboard-shell lg:flex w-full">
      <aside
        className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 flex w-[272px] shrink-0 flex-col border-r border-black/[0.06] bg-[#f8f8f2] px-5 py-6 transition-transform lg:relative lg:translate-x-0`}
      >
        <div className="mb-9 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#282330] text-white shadow-sm">
              <Sparkles size={16} />
            </div>
            <span className="text-[17px] font-semibold tracking-[-0.03em]">
              noti<span className="text-[#78942b]">.</span>
            </span>
          </div>
          <button aria-label="Close menu" onClick={() => setMobileNav(false)} className="lg:hidden">
            <X size={19} />
          </button>
        </div>

        <button
          onClick={() => setShowComposer(true)}
          className="mb-8 flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1f2825] text-sm font-medium text-white shadow-[0_4px_12px_rgba(40,30,50,.12)] transition hover:bg-[#3b3347]"
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

      <section className="flex-1">
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
        </header>

        <div className=" px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
          <div className="mb-9 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#78942b]">
                Your second brain, made simple
              </p>
              <h1 className="text-[32px] font-semibold tracking-[-0.05em] text-[#292431] sm:text-[38px]">
                Good morning, Jordan<span className="text-[#78942b]">.</span>
              </h1>
              <p className="mt-2 text-sm text-[#8f8b88]">You have a few ideas waiting for you.</p>
            </div>
            <button
              onClick={() => setShowComposer(true)}
              className="hidden items-center gap-2 rounded-xl bg-[#1f2825] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3b3347] sm:flex"
            >
              <Plus size={16} /> New note
            </button>
          </div>

          <div className="mb-11 grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <button
              onClick={() => setShowComposer(true)}
              className="group relative overflow-hidden rounded-2xl bg-[#e8edcf] p-6 text-left transition hover:shadow-[0_10px_30px_rgba(112,82,180,.12)] sm:p-7"
            >
              <div className="relative z-10">
                <div className="mb-8 flex size-10 items-center justify-center rounded-xl bg-white/70 text-[#8867df]">
                  <Lightbulb size={19} />
                </div>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8064c6]">
                  Quick capture
                </p>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[#26302b]">
                  What&apos;s on your mind?
                </h2>
                <p className="mt-2 text-sm text-[#7e7391]">
                  Start writing and let Noti help you shape the thought.
                </p>
              </div>
              <div className="absolute -right-6 -top-10 size-44 rounded-full border-[20px] border-white/20 transition group-hover:scale-110" />
              <div className="absolute -bottom-20 right-10 size-44 rounded-full border-[20px] border-[#d8caf6]/60" />
            </button>
            <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#f3eee6] text-[#cb9858]">
                  <BrainCircuit size={19} />
                </div>
                <span className="rounded-full bg-[#eff6c9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#829c26]">
                  AI insight
                </span>
              </div>
              <p className="text-[15px] font-medium leading-6 text-[#4c4948]">
                You&apos;ve been thinking a lot about{" "}
                <span className="text-[#9271dc]">simplifying complexity.</span>
              </p>
              <button className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#8b6bd4] hover:text-[#6d4fbd]">
                Explore this connection <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#302c2b]">
                Recent notes
              </h2>
              <button className="flex items-center gap-1 text-xs text-[#a09c99]">
                Updated <ChevronDown size={13} />
              </button>
            </div>
            <button className="text-[#a09c99] hover:text-[#302c2b]" aria-label="More options">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="divide-y divide-black/[0.06] rounded-2xl border border-black/[0.06] bg-white/60">
            {filteredNotes.length ? (
              filteredNotes.map((note) => (
                <article
                  key={note.title}
                  className="group flex items-start gap-4 p-5 transition hover:bg-white sm:p-6"
                >
                  <div
                    className={`mt-1 flex size-9 shrink-0 items-center justify-center rounded-[10px] ${note.color === "violet" ? "bg-[#eee8fc] text-[#9175dc]" : note.color === "amber" ? "bg-[#fbf0df] text-[#d29b58]" : note.color === "teal" ? "bg-[#e1f2ee] text-[#5eaa99]" : "bg-[#e4eef8] text-[#6c9aca]"}`}
                  >
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-[#3b3736]">
                        {note.title}
                      </h3>
                      {note.starred && <Star size={13} className="fill-[#c59ae9] text-[#c59ae9]" />}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-[#979391]">{note.excerpt}</p>
                    <div className="mt-3 flex items-center gap-3 text-[11px] text-[#b0aca9]">
                      <span>{note.date}</span>
                      <span className="size-1 rounded-full bg-[#d2cfcc]" />
                      <span className="flex items-center gap-1">
                        <Tag size={11} /> {note.tag}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-1 rounded-lg p-1.5 text-[#c0bdbb] opacity-0 transition hover:bg-black/[0.04] hover:text-[#777] group-hover:opacity-100"
                    aria-label={`Options for ${note.title}`}
                  >
                    <MoreHorizontal size={17} />
                  </button>
                </article>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-[#999]">
                No notes match your search.
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e8e2d5] bg-[#fcf8ef] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#f3e6c8] text-[#c3944e]">
                <Zap size={15} />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#665640]">Make your notes work harder</p>
                <p className="mt-0.5 text-[11px] text-[#a08d6d]">
                  Try asking Muse to connect a few ideas.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-[#b17f3e]">
              Learn how <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {showComposer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#26202d]/30 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-[#f8f8f2] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#78942b]">
                  Quick capture
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">A new thought</h2>
              </div>
              <button
                aria-label="Close composer"
                onClick={() => setShowComposer(false)}
                className="rounded-lg p-2 text-[#999] hover:bg-black/[0.04]"
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              autoFocus
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) createNote();
              }}
              placeholder="Start writing..."
              className="min-h-32 w-full resize-none rounded-xl border border-black/[0.08] bg-white p-4 text-sm outline-none placeholder:text-[#b5b2b0] focus:border-[#b5a6e6] focus:ring-2 focus:ring-[#b5a6e6]/20"
            />
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-[#aaa7a5]">⌘ Enter to save</span>
              <button
                onClick={createNote}
                className="rounded-lg bg-[#1f2825] px-4 py-2 text-sm font-medium text-white hover:bg-[#3b3347]"
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
