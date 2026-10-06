"use client";

import { useEffect, useState } from "react";
import { startRecording, stopRecording } from "@/lib/recorder";
import { blobToAudioData } from "@/lib/audio";

type ModelProgress = {
  status?: string;
  progress?: number;
};

export function useSpeechToText() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    async function loadModel() {
      try {
        const { loadWhisper } = await import("@/lib/whisper");

        await loadWhisper((progress: ModelProgress) => {
          if (typeof progress.progress === "number") {
            setModelProgress(Math.round(progress.progress));
          }
        });

        setIsModelReady(true);
      } catch {
        setModelError("The speech model could not be loaded.");
      } finally {
        setModelProgress(100);
        setIsModelLoading(false);
      }
    }

    loadModel();
  }, []);

  async function start() {
    if (!isModelReady) return;

    await startRecording();
    setIsRecording(true);
  }

  async function stop() {
    setIsRecording(false);
    setIsTranscribing(true);

    try {
      const blob = await stopRecording();
      const samples = await blobToAudioData(blob);

      const { transcribe } = await import("@/lib/whisper");

      const result = await transcribe(samples);

      setText(result);
    } finally {
      setIsTranscribing(false);
    }
  }

  return {
    start,
    stop,
    isModelReady,
    isModelLoading,
    modelProgress,
    modelError,
    isRecording,
    isTranscribing,
    text,
  };
}
