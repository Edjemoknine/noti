"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  FileText,
  Lightbulb,
  MoreHorizontal,
  Star,
  Tag,
  Zap,
} from "lucide-react";
import Sidebare from "@/components/core/Sidebare";
import { useRouter } from "next/navigation";
import Header from "@/components/core/Header";
import { notes } from "@/lib/notes";

export default function Page() {
  const [noteList] = useState(notes);
  const [activeNav, setActiveNav] = useState("All notes");
  const [search, setSearch] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const filteredNotes = useMemo(
    () =>
      noteList.filter((note) => {
        const matchesSearch = `${note.title} ${note.excerpt} ${note.tag}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesNav = activeNav !== "Starred" || note.starred;
        return matchesSearch && matchesNav;
      }),
    [noteList, search, activeNav],
  );

  const router = useRouter();

  return (
    <main className="h-screen overflow-hidden bg-[#f5f5ef] text-[#1f2825] dashboard-shell lg:flex w-full">
      <Sidebare
        activeNav={activeNav}
        mobileNav={mobileNav}
        setMobileNav={setMobileNav}
        setActiveNav={setActiveNav}
      />

      <section className="flex-1 pb-6 lg:pb-20 ">
        <Header search={search} setSearch={setSearch} setMobileNav={setMobileNav} />
        <div className="h-full px-5 py-9 sm:px-8 lg:px-12 lg:py-12 overflow-y-auto *:scrollbar-thin *:scrollbar-track-transparent *:scrollbar-thumb-black/20">
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
            {/*  <button
              onClick={() => setShowComposer(true)}
              className="hidden items-center gap-2 rounded-xl bg-[#1f2825] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#3b3347] sm:flex"
            >
              <Plus size={16} /> New note
            </button> */}
          </div>
          {/*  */}

          <div className="mb-11 grid gap-4 md:grid-cols-[1.5fr_1fr]">
            <button
              onClick={() => router.push("/create")}
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
                <button
                  key={note.title}
                  type="button"
                  onClick={() => router.push(`/show/${note.id}`)}
                  className="group flex items-start gap-4 p-5 transition hover:bg-white sm:p-6 w-full cursor-pointer"
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
                  <span
                    className="mt-1 rounded-lg p-1.5 text-[#c0bdbb] opacity-0 transition hover:bg-black/[0.04] hover:text-[#777] group-hover:opacity-100"
                    aria-label={`Options for ${note.title}`}
                  >
                    <MoreHorizontal size={17} />
                  </span>
                </button>
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
    </main>
  );
}
