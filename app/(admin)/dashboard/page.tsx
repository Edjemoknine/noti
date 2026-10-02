"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  Lightbulb,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { listNotes, type NoteListView } from "@/actions/notes";
import NoteList from "@/components/notes/NoteList";
import { useAdminNavigation } from "@/components/core/AdminShell";

export default function Page() {
  const { user } = useUser();
  const firstName = user?.firstName || user?.username || user?.fullName?.split(" ")[0];
  const { activeNav } = useAdminNavigation();
  const [pageState, setPageState] = useState({ activeNav, page: 1 });
  const currentPage = pageState.activeNav === activeNav ? pageState.page : 1;
  const noteView: NoteListView =
    activeNav === "All notes"
      ? "all"
      : activeNav === "Starred"
        ? "starred"
        : activeNav === "Archive"
          ? "archive"
          : "none";
  const { data: notePage, isLoading } = useQuery({
    queryKey: ["notes", noteView, currentPage],
    queryFn: () => listNotes({ page: currentPage, view: noteView }),
  });

  const router = useRouter();

  return (
    <div className="px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-9 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#78942b]">
            Your second brain, made simple
          </p>
          <h1 className="text-[32px] font-semibold tracking-[-0.05em] text-[#292431] sm:text-[38px]">
            Good morning{firstName ? `, ${firstName}` : ""}
            <span className="text-[#78942b]">.</span>
          </h1>
          <p className="mt-2 text-sm text-[#8f8b88]">Your notes are ready when you are.</p>
        </div>
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
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[#302c2b]">Recent notes</h2>
          <button className="flex items-center gap-1 text-xs text-[#a09c99]">
            Updated <ChevronDown size={13} />
          </button>
        </div>
        <button className="text-[#a09c99] hover:text-[#302c2b]" aria-label="More options">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <NoteList
        notes={notePage?.notes ?? []}
        isLoading={isLoading}
        page={currentPage}
        pageCount={notePage?.pageCount ?? 0}
        onPageChange={(page) => setPageState({ activeNav, page })}
        onOpen={(id) => router.push(`/show/${id}`)}
      />

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
  );
}
