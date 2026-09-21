"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteEditor from "@/components/notes/NoteEditor";
import { getNote } from "@/actions/notes";

export default function UpdateNotePage({ params }: { params: Promise<{ id: string }> }) {
  const id = use(params).id;
  const { data: note, isLoading } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => getNote(id),
  });

  if (isLoading) return <div className="p-8 text-sm text-[#777472]">Loading note...</div>;
  if (!note) return <div className="p-8 text-sm text-[#777472]">Note not found.</div>;

  return <NoteEditor mode="update" note={note} />;
}
