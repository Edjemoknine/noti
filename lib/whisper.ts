import { pipeline } from "@huggingface/transformers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let whisper: any = null;

export async function loadWhisper() {
  if (!whisper) {
    whisper = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-tiny.en"
    );
  }

  return whisper;
}

export async function transcribe(samples: Float32Array) {
  const model = await loadWhisper();

  const result = await model(samples);

  return result.text;
}