import { askNotes } from "@/lib/rag";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const result = await askNotes(question);
    const sources = result.sources.map((source) => ({
      title: source.noteTitle,
      noteId: source.noteId,
    }));
    const chunks = result.answer.match(/\S+\s*/g) ?? [];
    const encoder = new TextEncoder();
    let chunkIndex = 0;

    const stream = new ReadableStream({
      async pull(controller) {
        if (chunkIndex === chunks.length) {
          controller.close();
          return;
        }

        controller.enqueue(encoder.encode(chunks[chunkIndex]));
        chunkIndex += 1;
        await new Promise((resolve) => setTimeout(resolve, 35));
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "x-sources": encodeURIComponent(JSON.stringify(sources)),
      },
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    return Response.json(
      {
        error: "Chat request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
