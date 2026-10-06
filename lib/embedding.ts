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

/** Documents: no prefix for BGE */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const result: number[][] = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    result.push(...(await run(texts.slice(i, i + BATCH))));
  }
  return result;
}

/** Queries: BGE wants this instruction prefix on the query side only */
export async function embedQuery(query: string): Promise<number[]> {
  const [v] = await run([`Represent this sentence for searching relevant passages: ${query}`]);
  return v;
}
export async function embedSearch(query: string) {
  const vectors = await embedDocuments([query]);

  return vectors[0];
}
