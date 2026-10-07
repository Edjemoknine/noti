export async function embedNoteViaApi(noteId: string): Promise<void> {
  const response = await fetch("/api/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "note", noteId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to index note");
  }
}
