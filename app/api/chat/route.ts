export async function POST(req: Request) {
  const { question } = await req.json();

  const sources = [
    { title: "Getting started.pdf" },
    { title: "Pricing FAQ", url: "https://example.com/faq" },
  ];

  const answer = `Here's a placeholder answer to "${question}". Once your pipeline is connected, this text will stream from the model, grounded in the sources listed below.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      await new Promise((r) => setTimeout(r, 800)); // simulate retrieval
      for (const word of answer.split(" ")) {
        controller.enqueue(encoder.encode(word + " "));
        await new Promise((r) => setTimeout(r, 35));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-sources": encodeURIComponent(JSON.stringify(sources)),
    },
  });
}
