"use client";

import { useEffect, useState } from "react";
import { startRecording, stopRecording } from "@/lib/recorder";
import { blobToAudioData } from "@/lib/audio";
import { loadWhisper, transcribe } from "@/lib/whisper";

export function useSpeechToText() {
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelProgress, setModelProgress] = useState(0);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    loadWhisper((progress) => {
      if (typeof progress.progress === "number") {
        setModelProgress(Math.round(progress.progress));
      }
    })
      .then(() => setIsModelReady(true))
      .catch(() => setModelError("The speech model could not be loaded."))
      .finally(() => {
        setModelProgress(100);
        setIsModelLoading(false);
      });
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
