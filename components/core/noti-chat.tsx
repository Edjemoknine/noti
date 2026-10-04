"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  FileTextIcon,
  MessageCircleIcon,
  SendIcon,
  SquareIcon,
  XIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Message, MessageAvatar, MessageContent, MessageFooter } from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

/* ---------- types ---------- */

export type Source = { title: string; noteId?: string; url?: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  error?: boolean;
};

type AskHandlers = {
  onToken: (text: string) => void;
  onSources: (sources: Source[]) => void;
};

export type AskFn = (
  question: string,
  history: ChatMessage[],
  handlers: AskHandlers,
  signal: AbortSignal,
) => Promise<void>;

const askNoti: AskFn = async (question, history, { onToken, onSources }, signal) => {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      history: history.map(({ role, content }) => ({ role, content })),
    }),
    signal,
  });
  if (!res.ok || !res.body) throw new Error("Request failed");

  const header = res.headers.get("x-sources");
  if (header) onSources(JSON.parse(decodeURIComponent(header)));

  console.log({ res });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onToken(decoder.decode(value, { stream: true }));
  }
};

/* ---------- widget ---------- */

export function NotiChat({ ask = askNoti, title = "noti" }: { ask?: AskFn; title?: string }) {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);

  async function send() {
    const question = input.trim();
    if (!question || streaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    const replyId = crypto.randomUUID();
    const history = [...messages, userMessage];

    setMessages([...history, { id: replyId, role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const patch = (fn: (m: ChatMessage) => ChatMessage) =>
      setMessages((prev) => prev.map((m) => (m.id === replyId ? fn(m) : m)));

    try {
      await ask(
        question,
        history,
        {
          onToken: (t) => patch((m) => ({ ...m, content: m.content + t })),
          onSources: (sources) => patch((m) => ({ ...m, sources })),
        },
        controller.signal,
      );
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        patch((m) => ({
          ...m,
          error: true,
          content: "Couldn't get an answer. Check your connection and try again.",
        }));
      }
    } finally {
      setStreaming(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    // Lime accent scoped to the widget. Delete these two values to inherit your theme.
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 [--primary:oklch(0.87_0.21_128)] [--primary-foreground:oklch(0.2_0_0)]">
      {open && (
        <section
          aria-label={`${title} chat`}
          className="bg-background text-foreground flex h-[min(36rem,80dvh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border shadow-xl"
        >
          <header className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold italic">
                  n
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{title}</span>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              <XIcon />
            </Button>
          </header>

          <MessageScrollerProvider
            autoScroll
            defaultScrollPosition="last-anchor"
            scrollPreviousItemPeek={48}
          >
            <MessageScroller className="min-h-0 flex-1">
              <MessageScrollerViewport>
                <MessageScrollerContent aria-busy={streaming} className="gap-4 p-4">
                  {messages.length === 0 && (
                    <MessageScrollerItem messageId="welcome">
                      <Row
                        message={{
                          id: "welcome",
                          role: "assistant",
                          content: "Ask a question about your documents and I'll answer from them.",
                        }}
                        streaming={false}
                      />
                    </MessageScrollerItem>
                  )}
                  {messages.map((m, i) => (
                    <MessageScrollerItem
                      key={m.id}
                      messageId={m.id}
                      scrollAnchor={m.role === "user"}
                    >
                      <Row message={m} streaming={streaming && i === messages.length - 1} />
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <div className="flex items-end gap-2 border-t p-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask noti…"
              aria-label="Message"
              rows={1}
              className="max-h-32 min-h-10 resize-none"
            />
            {streaming ? (
              <Button
                size="icon"
                variant="secondary"
                aria-label="Stop generating"
                onClick={() => abortRef.current?.abort()}
              >
                <SquareIcon />
              </Button>
            ) : (
              <Button size="icon" aria-label="Send message" disabled={!input.trim()} onClick={send}>
                <SendIcon />
              </Button>
            )}
          </div>
        </section>
      )}

      <Button
        size="icon-lg"
        className="size-14 rounded-full shadow-lg"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <XIcon /> : <MessageCircleIcon />}
      </Button>
    </div>
  );
}

/* ---------- one transcript row: Message + Bubble ---------- */

function Row({ message, streaming }: { message: ChatMessage; streaming: boolean }) {
  const isUser = message.role === "user";
  const waiting = streaming && !message.content;

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser && (
        <MessageAvatar>
          <Avatar className="size-6">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold italic">
              n
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
      )}
      <MessageContent>
        {waiting ? (
          <Marker role="status">
            <MarkerIcon>
              <Spinner />
            </MarkerIcon>
            <MarkerContent>Searching your documents…</MarkerContent>
          </Marker>
        ) : (
          <Bubble
            align={isUser ? "end" : "start"}
            variant={isUser ? "default" : message.error ? "destructive" : "ghost"}
          >
            <BubbleContent className="whitespace-pre-wrap">{message.content}</BubbleContent>
          </Bubble>
        )}

        {!isUser && !streaming && message.id !== "welcome" && !message.error && (
          <MessageFooter className="flex-wrap">
            <CopyButton text={message.content} />
            {message.sources && message.sources.length > 0 && <Sources sources={message.sources} />}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy answer"}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

function Sources({ sources }: { sources: Source[] }) {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs">
        {sources.length} {sources.length === 1 ? "source" : "sources"}
        <ChevronDownIcon className="size-3" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="mt-2 flex flex-col gap-1">
          {sources.map((s) => (
            <li key={s.noteId ?? s.url ?? s.title}>
              {s.noteId ? (
                <Link
                  href={`/show/${s.noteId}`}
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs underline-offset-2 hover:underline"
                >
                  <FileTextIcon className="size-3 shrink-0" />
                  {s.title}
                </Link>
              ) : s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs underline-offset-2 hover:underline"
                >
                  <FileTextIcon className="size-3 shrink-0" />
                  {s.title}
                </a>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <FileTextIcon className="size-3 shrink-0" />
                  {s.title}
                </span>
              )}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
