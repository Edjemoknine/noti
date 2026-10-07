const MAX_CHUNK_SIZE = 1000;
const OVERLAP_SIZE = 150;

export function chunkNote(
  title: string,
  content: string,
  summary?: string | null,
  tags?: string[],
  actionItems?: string[],
): string[] {
  const cleanTitle = title.trim();
  const cleanSummary = summary?.trim() || "";

  const metadata = [
    cleanSummary ? `Summary: ${cleanSummary}` : "",
    tags?.length ? `Tags: ${tags.join(", ")}` : "",
    actionItems?.length ? `Action items: ${actionItems.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const text = content.trim();

  // No content: make the note searchable using its metadata.
  if (!text) {
    const fallback = [cleanTitle, metadata].filter(Boolean).join("\n\n");
    return [fallback || "Untitled note"];
  }

  // Split content into paragraphs.
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Split very large paragraphs into sentences.
  const pieces: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= MAX_CHUNK_SIZE) {
      pieces.push(paragraph);
      continue;
    }

    const sentences = paragraph.match(/[^.!?؟\n]+[.!?؟]+(?:\s+|$)|[^.!?؟\n]+$/g) ?? [paragraph];

    let current = "";

    for (const sentence of sentences) {
      const s = sentence.trim();

      if (!s) continue;

      if (current && current.length + s.length + 1 > MAX_CHUNK_SIZE) {
        pieces.push(current.trim());
        current = "";
      }

      current += (current ? " " : "") + s;
    }

    if (current) {
      pieces.push(current.trim());
    }
  }

  // Build chunks from the pieces.
  const rawChunks: string[] = [];
  let current = "";

  for (const piece of pieces) {
    if (current && current.length + piece.length + 2 > MAX_CHUNK_SIZE) {
      rawChunks.push(current.trim());

      // Keep the end of the previous chunk as context.
      const overlap = current.length > OVERLAP_SIZE ? current.slice(-OVERLAP_SIZE) : current;

      current = overlap.trim();
    }

    current += (current ? "\n\n" : "") + piece;
  }

  if (current.trim()) {
    rawChunks.push(current.trim());
  }

  // Add title + metadata to every chunk so each embedding
  // retains the note's identity and important structured information.
  return rawChunks.map((chunk) => {
    return [cleanTitle ? `Title: ${cleanTitle}` : "", metadata, chunk].filter(Boolean).join("\n\n");
  });
}
