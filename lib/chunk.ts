export const MAX = 1500;
// lib/chunk.ts

export function chunkNote(title: string, content: string, summary?: string | null): string[] {
  const paras = content
    .split(/\n{2,}/)
    .flatMap((p) => {
      p = p.trim();
      if (p.length <= MAX) return [p];
      // hard-split very long paragraphs on sentence boundaries
      const parts = p.match(/[^.!?؟\n]+[.!?؟]?\s*/g) ?? [p];
      const pieces: string[] = [];
      let cur = "";
      for (const s of parts) {
        if (cur && cur.length + s.length > MAX) {
          pieces.push(cur.trim());
          cur = "";
        }
        cur += s;
      }
      if (cur.trim()) pieces.push(cur.trim());
      return pieces;
    })
    .filter(Boolean);

  const chunks: string[] = [];
  let cur = "";
  for (const p of paras) {
    if (cur && cur.length + p.length > MAX) {
      chunks.push(cur);
      cur = "";
    }
    cur += (cur ? "\n\n" : "") + p;
  }
  if (cur) chunks.push(cur);

  // Empty body: fall back to summary or title so the note is still searchable
  if (!chunks.length) chunks.push(summary?.trim() || title);

  // Title in every chunk keeps context for the embedding
  return chunks.map((c) => `${title}\n\n${c}`);
}
