"use client";

import { FileText, MoreHorizontal, Star, Tag } from "lucide-react";
import type { NoteRecord } from "@/actions/notes";

type NoteCardProps = {
  note: NoteRecord;
  onOpen: (id: string) => void;
};

export default function NoteCard({ note, onOpen }: NoteCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(note.id)}
      className="group flex w-full cursor-pointer items-start gap-4 p-5 text-left transition hover:bg-white sm:p-6"
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
        <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-5 text-[#979391]">
          {note.summary || note.content}
        </p>
        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-[#f0f3dd] px-2 py-1 text-[10px] font-medium text-[#78942b]"
              >
                {topic}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-1 py-1 text-[10px] text-[#aaa7a5]">+{note.tags.length - 3}</span>
            )}
          </div>
        )}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#b0aca9]">
          <span>{note.updatedAt.toLocaleDateString()}</span>
          <span className="size-1 rounded-full bg-[#d2cfcc]" />
          <span className="flex items-center gap-1">
            <Tag size={11} /> {note.tag}
          </span>
        </div>
      </div>
      <span
        className="mt-1 rounded-lg p-1.5 text-[#c0bdbb] opacity-0 transition hover:bg-black/4 hover:text-[#777] group-hover:opacity-100"
        aria-label={`Options for ${note.title}`}
      >
        <MoreHorizontal size={17} />
      </span>
    </button>
  );
}
