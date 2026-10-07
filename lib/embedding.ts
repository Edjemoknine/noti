import "server-only";
import path from "node:path";
import { pipeline, env, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Load from the bundled folder, never hit the network

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = path.join(process.cwd(), "models");

const MODEL = "Xenova/bge-small-en-v1.5";
const BATCH = 16;

let extractor: Promise<FeatureExtractionPipeline> | null = null;
function getExtractor() {
  return (extractor ??= pipeline("feature-extraction", MODEL, {
    dtype: "q8",
  }) as Promise<FeatureExtractionPipeline>);
}

async function run(texts: string[]): Promise<number[][]> {
  const ext = await getExtractor();
  // BGE uses CLS pooling
  const out = await ext(texts, { pooling: "cls", normalize: true });
  return out.tolist() as number[][];
}

export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const result: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    result.push(...(await run(texts.slice(i, i + BATCH))));
  }
  return result;
}

export async function embedQuery(query: string): Promise<number[]> {
  const text = query.trim();
  if (!text) {
    throw new Error("Search query cannot be empty");
  }
  const [embedding] = await run([
    `Represent this sentence for searching relevant passages: ${text}`,
  ]);
  return embedding;
}

export async function embedSearch(query: string, endpoint: URL) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "query", query }),
  });

  const data: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Failed to generate search embedding";
    throw new Error(message);
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("embeddings" in data) ||
    !Array.isArray(data.embeddings) ||
    !Array.isArray(data.embeddings[0]) ||
    !data.embeddings[0].every((value) => typeof value === "number")
  ) {
    throw new Error("Embedding API returned an invalid response");
  }

  return data.embeddings[0];
}
