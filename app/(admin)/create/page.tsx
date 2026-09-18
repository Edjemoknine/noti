"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, ChevronDown, Mic, PenLine, Sparkles, Tag, X } from "lucide-react";
import { useSpeechToText } from "@/hooks/useSpeechToText";

export default function CreateNotePage() {
  const {
    start,
    stop,
    isModelReady,
    isModelLoading,
    modelError,
    isRecording,
    isTranscribing,
    text: voiceText,
  } = useSpeechToText();
  const [mode, setMode] = useState<"write" | "voice">("write");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("Inbox");
  const [saved, setSaved] = useState(false);

  const noteBody = mode === "voice" && voiceText ? voiceText : body;

  function handleSave() {
    if (!title.trim() && !noteBody.trim()) return;
    setSaved(true);
  }

  function handleModeChange(nextMode: "write" | "voice") {
    if (nextMode === "write" && voiceText) setBody(voiceText);
    setMode(nextMode);
    setSaved(false);
  }

  return (
    <main className="dashboard-shell min-h-screen text-[#1f2825]">
      <header className="flex h-[76px] items-center justify-between border-b border-black/[0.06] px-5 sm:px-8 lg:px-12">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-[#777472] transition hover:text-[#292431]"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back to notes</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[#aaa7a5] sm:inline">
            {saved ? "Saved just now" : "Draft"}
          </span>
          <button
            type="button"
            onClick={handleSave}
            disabled={!title.trim() && !noteBody.trim()}
            className="flex h-9 items-center gap-2 rounded-lg bg-[#1f2825] px-3.5 text-xs font-medium text-white transition hover:bg-[#3b3347] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={14} />
            Save note
          </button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12 lg:py-16">
        <section>
          <div className="mb-10">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#78942b]">
              <span className="size-1.5 rounded-full bg-[#afc740]" />
              Quick capture
            </p>
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setSaved(false);
              }}
              placeholder="Give this thought a name"
              aria-label="Note title"
              className="w-full border-0 bg-transparent p-0 font-serif text-[clamp(2.25rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-[#292431] outline-none placeholder:text-[#c5c2bd]"
            />
          </div>

          <div className="mb-5 flex items-center justify-between border-b border-black/[0.08] pb-3">
            <div
              className="flex items-center gap-1 rounded-lg bg-[#eeeee8] p-1"
              role="tablist"
              aria-label="Note input mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "write"}
                onClick={() => handleModeChange("write")}
                className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${mode === "write" ? "bg-white text-[#292431] shadow-sm" : "text-[#96928e] hover:text-[#5d5956]"}`}
              >
                <PenLine size={14} />
                Write
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "voice"}
                onClick={() => handleModeChange("voice")}
                className={`flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition ${mode === "voice" ? "bg-white text-[#292431] shadow-sm" : "text-[#96928e] hover:text-[#5d5956]"}`}
              >
                <Mic size={14} />
                Voice
              </button>
            </div>
            <span className="text-[11px] text-[#aaa7a5]">{noteBody.length} characters</span>
          </div>

          {mode === "voice" && (
            <div className="mb-5 flex items-center justify-between rounded-xl border border-[#dfe8bc] bg-[#f4f7df] px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`flex size-8 items-center justify-center rounded-full ${isRecording ? "bg-[#d85f5f] text-white" : "bg-white text-[#829c26]"}`}
                >
                  <Mic size={15} />
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#4c592f]">
                    {isRecording
                      ? "Listening..."
                      : isTranscribing
                        ? "Turning voice into text..."
                        : "Speak your thought"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#8b966e]">
                    {isRecording
                      ? "Press stop when you are done"
                      : "Your words will appear in the note"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={isRecording ? stop : start}
                disabled={!isModelReady || isTranscribing}
                className={`flex size-9 items-center justify-center rounded-full transition ${isRecording ? "bg-[#d85f5f] text-white hover:bg-[#c64d4d]" : "bg-[#1f2825] text-white hover:bg-[#3b3347]"} disabled:cursor-not-allowed disabled:opacity-40`}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? (
                  <span className="size-3 rounded-[2px] bg-current" />
                ) : (
                  <Mic size={16} />
                )}
              </button>
            </div>
          )}

          <textarea
            value={noteBody}
            onChange={(event) => {
              setBody(event.target.value);
              setSaved(false);
            }}
            placeholder={
              mode === "voice"
                ? "Your transcription will appear here..."
                : "Start with a sentence, a question, or a feeling..."
            }
            aria-label="Note body"
            className="min-h-[360px] w-full resize-none border-0 bg-transparent p-0 font-serif text-lg leading-8 text-[#4c4948] outline-none placeholder:text-[#b8b4b0] sm:min-h-[430px]"
          />
        </section>

        <aside className="border-t border-black/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <div className="mb-8 flex items-start gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eee8fc] text-[#9175dc]">
              <Sparkles size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#4c4948]">A quiet place to begin</p>
              <p className="mt-1 text-xs leading-5 text-[#9b9794]">
                Capture the rough version. Clarity can come later.
              </p>
            </div>
          </div>

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
                  className={`ml-auto text-[#78942b] ${mode === "write" ? "opacity-100" : "opacity-0"}`}
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
                  className={`ml-auto text-[#78942b] ${mode === "voice" ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            </div>
          </div>

          <div className="mb-7 border-t border-black/[0.08] pt-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa7a5]">
              Speech model
            </p>
            <div className="flex items-center gap-2 text-xs text-[#777472]">
              <span
                className={`size-2 rounded-full ${modelError ? "bg-[#d85f5f]" : isModelReady ? "bg-[#8bad32]" : "animate-pulse bg-[#d7ad63]"}`}
              />
              {modelError ??
                (isModelLoading
                  ? "Loading model..."
                  : isModelReady
                    ? "Ready for voice notes"
                    : "Unavailable")}
            </div>
          </div>

          <label className="block border-t border-black/[0.08] pt-5">
            <span className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa7a5]">
              <Tag size={13} /> Collection
            </span>
            <span className="relative block">
              <select
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-black/[0.08] bg-white/70 px-3 text-xs text-[#5d5956] outline-none focus:border-[#b5a6e6]"
              >
                <option>Inbox</option>
                <option>Ideas</option>
                <option>Personal</option>
                <option>Reading</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa7a5]"
              />
            </span>
          </label>

          {saved && (
            <p className="mt-8 flex items-center gap-2 text-xs text-[#78942b]">
              <Check size={14} /> Your note is ready in your workspace.
            </p>
          )}
          {title || noteBody ? (
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setBody("");
                setSaved(false);
              }}
              className="mt-8 flex items-center gap-2 text-xs text-[#aaa7a5] hover:text-[#d85f5f]"
            >
              <X size={13} /> Clear draft
            </button>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
