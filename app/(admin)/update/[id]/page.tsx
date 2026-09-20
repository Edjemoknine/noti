import NoteEditor from "@/components/notes/NoteEditor";
import { getNote } from "@/lib/notes";

export default async function UpdateNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteEditor mode="update" note={getNote(id)} />;
}
