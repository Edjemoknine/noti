import { pipeline } from "@huggingface/transformers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let whisper: any = null;

type ModelProgress = {
  status?: string;
  progress?: number;
};

export async function loadWhisper(progress_callback?: (progress: ModelProgress) => void) {
  if (!whisper) {
    whisper = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
      progress_callback,
    });
  }

  return whisper;
}

export async function transcribe(samples: Float32Array) {
  const model = await loadWhisper();

  const result = await model(samples);

  return result.text;
}
