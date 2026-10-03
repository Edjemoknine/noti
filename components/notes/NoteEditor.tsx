"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Mic, PenLine, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { createNote, updateNote } from "@/actions/notes";
import type { ExtractedNote } from "@/actions/notes";
import type { NoteRecord } from "@/actions/notes";
import { useSpeechToText } from "@/hooks/useSpeechToText";

type NoteEditorProps = {
  note?: Pick<NoteRecord, "id" | "title" | "content">;
  mode?: "create" | "update";
};

const LOADING_STEPS = [
  "Reading your note…",
  "Finding the key ideas…",
  "Writing a title and summary…",
];

export default function NoteEditor({ note, mode = "create" }: NoteEditorProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const speech = useSpeechToText();
  const [inputMode, setInputMode] = useState<"write" | "voice">("write");
  const [body, setBody] = useState(note?.content ?? "");
  const [saved, setSaved] = useState(false);
  const noteBody = inputMode === "voice" && speech.text ? speech.text : body;

  const [loading, setLoading] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  const saveNote = useMutation({
    mutationFn: (input: ExtractedNote) =>
      mode === "update" && note ? updateNote(note.id, { ...input }) : createNote({ ...input }),
    onSuccess: (savedNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSaved(true);
      toast.add({
        title: mode === "update" ? "Note updated" : "Note created",
        description:
          mode === "update"
            ? "Your changes have been saved."
            : "Your note is ready in your workspace.",
        type: "success",
      });
      router.push(mode === "update" && savedNote ? `/show/${savedNote.id}` : "/dashboard");
    },
  });

  // Step through the loading messages while the note is being generated
  useEffect(() => {
    if (!loading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStepIndex(0);
      return;
    }
    const id = setInterval(
      () => setStepIndex((i) => Math.min(i + 1, LOADING_STEPS.length - 1)),
      2500,
    );
    return () => clearInterval(id);
  }, [loading]);

  const loadingLabel = saveNote.isPending ? "Saving your note…" : LOADING_STEPS[stepIndex];

  async function handleSave() {
    setLoading(true);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: noteBody }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.error ?? "Could not generate note details.");
      await saveNote.mutateAsync(result as ExtractedNote);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Could not save note.";
      setGenerationError(message);
      toast.add({
        title: mode === "update" ? "Could not update note" : "Could not create note",
        description: message,
        type: "error",
        timeout: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleModeChange(nextMode: "write" | "voice") {
    if (nextMode === "write" && speech.text) setBody(speech.text);
    setInputMode(nextMode);
    setSaved(false);
  }

  return (
    <main className="dashboard-shell min-h-screen text-[#1f2825]">
      <header className="flex h-[76px] items-center justify-between border-b border-black/[0.06] px-5 sm:px-8 lg:px-12">
        <Link
          href={mode === "update" ? `/show/${note?.id}` : "/dashboard"}
          className="flex items-center gap-2 text-sm text-[#777472] transition hover:text-[#292431]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">
            {mode === "update" ? "Back to note" : "Back to notes"}
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#aaa7a5] sm:inline">
            {saved ? "Saved just now" : mode === "update" ? "Editing note" : "Draft"}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#1f2825] px-3.5 text-xs font-medium text-white transition hover:bg-[#3b3347] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? <Spinner className="size-3.5" /> : <Check size={14} />}
            {loading
              ? mode === "update"
                ? "Updating..."
                : "Saving..."
              : mode === "update"
                ? "Save changes"
                : "Save note"}
          </button>
        </div>
      </header>

      <div className="relative mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12 lg:py-16">
        <section>
          <div className="mb-10">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78942b]">
              <span className="size-1.5 rounded-full bg-[#afc740]" />
              {mode === "update" ? "Refine your thought" : "Quick capture"}
            </p>
            <h1 className="w-full border-0 bg-transparent p-0 font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-[#dcdade]">
              What&apos;s on your mind?
            </h1>
          </div>
          <div className="mb-5 flex items-center justify-between border-b border-black/[0.08] pb-3">
            <div
              className="flex items-center gap-1 rounded-lg bg-[#eeeee8] p-1"
              role="tablist"
              aria-label="Note input mode"
            >
              {(["write", "voice"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={inputMode === value}
                  onClick={() => handleModeChange(value)}
                  className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${inputMode === value ? "bg-white text-[#292431] shadow-sm" : "text-[#96928e] hover:text-[#5d5956]"}`}
                >
                  {value === "write" ? <PenLine size={14} /> : <Mic size={14} />}
                  {value === "write" ? "Write" : "Voice"}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-[#aaa7a5]">{noteBody.length} characters</span>
          </div>
          {inputMode === "voice" && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-[#dfe8bc] bg-[#f4f7df] px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-full ${speech.isRecording ? "bg-[#d85f5f] text-white" : "bg-white text-[#829c26]"}`}
                >
                  <Mic size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#4c592f]">
                    {speech.isRecording
                      ? "Listening..."
                      : speech.isTranscribing
                        ? "Turning voice into text..."
                        : "Speak your thought"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8b966e]">
                    {speech.isRecording
                      ? "Press stop when you are done"
                      : "Your words will appear in the note"}
                  </p>
                </div>
              </div>
              {speech.isModelLoading && (
                <div
                  className="ml-3 w-full max-w-[260px]"
                  role="progressbar"
                  aria-valuenow={speech.modelProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className="mb-1 flex justify-between text-[10px] text-[#8b966e]">
                    <span>Loading speech model</span>
                    <span>{speech.modelProgress}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[#dfe8bc]">
                    <div
                      className="h-full bg-[#829c26] transition-[width] duration-300"
                      style={{ width: `${speech.modelProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={speech.isRecording ? speech.stop : speech.start}
                disabled={!speech.isModelReady || speech.isTranscribing}
                className={`flex size-9 items-center justify-center rounded-full transition ${speech.isRecording ? "bg-[#d85f5f] text-white hover:bg-[#c64d4d]" : "bg-[#1f2825] text-white hover:bg-[#3b3347]"} disabled:cursor-not-allowed disabled:opacity-40`}
                aria-label={speech.isRecording ? "Stop recording" : "Start recording"}
              >
                {speech.isRecording ? (
                  <span className="size-3 rounded-[2px] bg-current" />
                ) : (
                  <Mic size={16} />
                )}
              </button>
            </div>
          )}

          {/* Note area: relative so the loading overlay is scoped to it */}
          <div className="relative" aria-busy={loading}>
            <textarea
              value={noteBody}
              onChange={(event) => {
                setBody(event.target.value);
                setSaved(false);
              }}
              readOnly={loading}
              placeholder={
                inputMode === "voice"
                  ? "Your transcription will appear here..."
                  : "Start with a sentence, a question, or a feeling..."
              }
              aria-label="Note body"
              className={`min-h-[360px] w-full resize-none border-0 bg-transparent p-0 font-serif text-lg leading-8 text-[#4c4948] outline-none transition-opacity duration-300 placeholder:text-[#b8b4b0] sm:min-h-[430px] ${loading ? "opacity-60" : ""}`}
            />

            {/* Screen readers: always mounted so each step is announced */}
            <p className="sr-only" role="status" aria-live="polite">
              {loading ? loadingLabel : ""}
            </p>

            {/* Loading overlay: scoped to the note, fades in and out */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl transition-opacity duration-300 ${
                loading ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {/* Light frosted veil: the note stays readable underneath */}
              <div className="absolute inset-0 rounded-xl bg-[#f5f6f1]/55 backdrop-blur-[2px]" />

              {/* Soft lime glow, kept small and subtle */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,244,50,0.18)_0%,transparent_60%)]" />

              {/* White card so the lime logo stands out */}
              <div className="relative flex flex-col items-center gap-1.5 rounded-2xl border border-black/[0.06] bg-white/90 px-9 py-6 shadow-[0_8px_30px_rgba(31,40,37,0.08)]">
                <Image
                  src="/noti-n-loader.svg"
                  alt=""
                  width={200}
                  height={200}
                  unoptimized
                  className="size-24"
                />
                <p className="text-sm font-medium text-[#4c4948]">{loadingLabel}</p>
                <p className="text-xs text-[#9b9794]">This usually takes a few seconds</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="border-t border-black/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="mb-8 flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eee8fc] text-[#9175dc]">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4c4948]">
                {mode === "update" ? "Make it clearer" : "A quiet place to begin"}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#9b9794]">
                {mode === "update"
                  ? "Keep the useful parts. Let the rest stay rough."
                  : "Capture the rough version. Clarity can come later."}
              </p>
            </div>
          </div>
          {generationError && (
            <p className="mb-7 border-t border-[#e8caca] pt-5 text-xs leading-5 text-[#b45f5f]">
              {generationError}
            </p>
          )}
          <div className="mb-7 border-t border-black/[0.08] pt-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa7a5]">
              Capture with
            </p>
            <div className="space-y-2 text-xs text-[#777472]">
              <button
                type="button"
                onClick={() => handleModeChange("write")}
                className="flex w-full items-center gap-3 rounded-lg bg-white/70 px-3 py-2.5 text-left hover:bg-white"
              >
                <PenLine size={15} className="text-[#8d7ad0]" /> Write manually{" "}
                <Check
                  size={14}
                  className={`ml-auto text-[#78942b] ${inputMode === "write" ? "opacity-100" : "opacity-0"}`}
                />
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("voice")}
                className="flex w-full items-center gap-3 rounded-lg bg-white/70 px-3 py-2.5 text-left hover:bg-white"
              >
                <Mic size={15} className="text-[#6fb7a5]" /> Use your voice{" "}
                <Check
                  size={14}
                  className={`ml-auto text-[#78942b] ${inputMode === "voice" ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            </div>
          </div>

          {saved && (
            <p className="mt-8 flex items-center gap-2 text-xs text-[#78942b]">
              <Check size={14} />{" "}
              {mode === "update"
                ? "Your changes are saved."
                : "Your note is ready in your workspace."}
            </p>
          )}
          {noteBody && (
            <button
              type="button"
              onClick={() => {
                setBody("");
                setSaved(false);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-[#aaa7a5] hover:text-[#d85f5f]"
            >
              <X size={13} /> Clear {mode === "update" ? "changes" : "draft"}
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}
