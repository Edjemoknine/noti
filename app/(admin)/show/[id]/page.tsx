"use client";

import Link from "next/link";
import { use, useState } from "react";
import { ArrowLeft, Edit3, FileText, MoreHorizontal, Star, Tag } from "lucide-react";
import Header from "@/components/core/Header";
import Sidebare from "@/components/core/Sidebare";
import { getNote } from "@/lib/notes";

export default function ShowNotePage({ params }: { params: Promise<{ id: string }> }) {
  const note = getNote(use(params).id);
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="dashboard-shell flex min-h-screen w-full bg-[#f5f5ef] text-[#1f2825] lg:flex">
      <Sidebare activeNav="All notes" mobileNav={mobileNav} setMobileNav={setMobileNav} setActiveNav={() => undefined} />
      <section className="min-w-0 flex-1">
        <Header search="" setSearch={() => undefined} setMobileNav={setMobileNav} />
        <div className="mx-auto max-w-[900px] px-5 py-9 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div className="mb-10 flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[#777472] transition hover:text-[#292431]">
              <ArrowLeft size={16} /> Back to notes
            </Link>
            <div className="flex items-center gap-2">
              <Link href={`/update/${note.id}`} className="flex h-9 items-center gap-2 rounded-lg bg-[#1f2825] px-3.5 text-xs font-medium text-white transition hover:bg-[#3b3347]">
                <Edit3 size={14} /> Edit note
              </Link>
              <button type="button" aria-label="More options" className="rounded-lg p-2 text-[#aaa7a5] transition hover:bg-black/[0.04] hover:text-[#5d5956]"><MoreHorizontal size={18} /></button>
            </div>
          </div>
          <article className="rounded-2xl border border-black/[0.06] bg-white/70 px-6 py-8 sm:px-10 sm:py-12">
            <div className="mb-8 flex flex-wrap items-center gap-3 text-[11px] text-[#aaa7a5]">
              <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#eee8fc] text-[#9175dc]"><FileText size={16} /></span>
              <span>{note.date}</span><span className="size-1 rounded-full bg-[#d2cfcc]" />
              <span className="flex items-center gap-1"><Tag size={11} /> {note.tag}</span>
              {note.starred && <Star size={14} className="ml-auto fill-[#c59ae9] text-[#c59ae9]" />}
            </div>
            <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.98] tracking-[-0.045em] text-[#292431]">{note.title}</h1>
            <div className="mt-10 whitespace-pre-line font-serif text-lg leading-8 text-[#4c4948]">{note.body}</div>
            <div className="mt-12 border-t border-black/[0.08] pt-5 text-xs text-[#aaa7a5]">Last updated {note.date.toLowerCase()}</div>
          </article>
        </div>
      </section>
    </main>
  );
}
