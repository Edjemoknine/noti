"use client";
import { FileText, Search, X } from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type SearchResult = {
  id: number;
  noteId: number;
  noteTitle: string;
  content: string;
};

const RECENT_SEARCHES_KEY = "noti-recent-search-results";
const PREVIEW_COUNT = 3;

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentResults, setRecentResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function openSearch() {
    try {
      const storedResults = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedResults) setRecentResults(JSON.parse(storedResults) as SearchResult[]);
    } catch {
      setRecentResults([]);
    }
    setHasSearched(false);
    setIsOpen(true);
  }

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  async function handleSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setHasSearched(true);
    setShowAll(false);
    setSearchError(false);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Search failed");
      const nextResults = (data.results ?? []) as SearchResult[];
      setResults(nextResults);
      setRecentResults(nextResults);
      try {
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(nextResults));
      } catch {}
    } catch {
      setResults([]);
      setSearchError(true);
    } finally {
      setLoading(false);
    }
  }

  const displayedResults = showAll ? results : results.slice(0, PREVIEW_COUNT);

  return (
    <div className="relative max-w-87.5 flex-1">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa7a5]"
      />
      <input
        aria-label="Search notes"
        value={query}
        onFocus={openSearch}
        onChange={(event) => setQuery(event.target.value)}
        onClick={openSearch}
        placeholder="Search your notes..."
        className="h-10 w-full cursor-text rounded-xl border border-black/6 bg-white/70 pl-10 pr-14 text-sm outline-none placeholder:text-[#8c9189] transition hover:border-black/12 focus:border-[#85973a] focus:ring-2 focus:ring-[#85973a]/15"
        readOnly
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-black/8 bg-white/80 px-1.5 py-0.5 text-[10px] text-[#898d86]">
        ⌘ K
      </kbd>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#1e241f]/25 px-3 pt-[10vh] backdrop-blur-[2px] sm:px-6">
          <button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Search your notes"
            className="relative z-10 w-full max-w-160 overflow-hidden rounded-2xl border border-black/8 bg-[#fffefa] shadow-[0_24px_80px_rgba(22,28,23,0.22)]"
          >
            <form onSubmit={handleSearch} className="flex h-15.5 items-center gap-3 px-5">
              <Search size={19} className="shrink-0 text-[#7c8d37]" />
              <input
                ref={inputRef}
                aria-label="Search your notes"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your notes..."
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-[#242b25] outline-none placeholder:text-[#a3a69e]"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setIsOpen(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#81867f] transition hover:bg-black/5 hover:text-[#252c26]"
              >
                <X size={17} />
              </button>
            </form>

            <div className="max-h-[min(58vh,520px)] overflow-y-auto border-t border-black/[0.07] px-3 py-4 sm:px-5">
              {loading ? (
                <div className="flex h-36 items-center justify-center gap-3 text-sm text-[#777d75]">
                  <span className="size-4 animate-spin rounded-full border-2 border-[#dce2c9] border-t-[#7c8d37]" />
                  Finding relevant notes...
                </div>
              ) : hasSearched ? (
                <>
                  <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#81867f]">
                    Search results
                  </p>
                  {results.length ? (
                    <div className="divide-y divide-black/[0.07]">
                      {displayedResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/show/${result.noteId}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex gap-3 rounded-lg px-2 py-3 transition hover:bg-[#f3f5e9]"
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef1df] text-[#71832e]">
                            <FileText size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-[#303830] group-hover:text-[#596b20]">
                              {result.noteTitle}
                            </span>
                            <span className="mt-1 line-clamp-2 block text-xs leading-[1.55] text-[#777d75]">
                              {result.content}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : searchError ? (
                    <p className="px-2 py-8 text-center text-sm text-[#8b5146]">
                      Search failed. Please try again.
                    </p>
                  ) : (
                    <p className="px-2 py-8 text-center text-sm text-[#777d75]">
                      No matching notes found. Try a different phrase.
                    </p>
                  )}
                  {results.length > PREVIEW_COUNT && (
                    <button
                      type="button"
                      onClick={() => setShowAll((current) => !current)}
                      className="mt-3 w-full rounded-lg py-2.5 text-center text-xs font-semibold text-[#66782a] transition hover:bg-[#f3f5e9]"
                    >
                      {showAll ? "Show fewer results" : "View all results"}
                      <span className="ml-1" aria-hidden="true">
                        →
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#81867f]">
                    Recent
                  </p>
                  {recentResults.length ? (
                    <div className="space-y-1">
                      {recentResults.slice(0, PREVIEW_COUNT).map((result) => (
                        <Link
                          key={result.id}
                          href={`/show/${result.noteId}`}
                          onClick={() => setIsOpen(false)}
                          className="group flex gap-3 rounded-lg px-2 py-3 transition hover:bg-[#f3f5e9]"
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#eef1df] text-[#71832e]">
                            <FileText size={16} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-[#303830] group-hover:text-[#596b20]">
                              {result.noteTitle}
                            </span>
                            <span className="mt-1 line-clamp-1 block text-xs text-[#777d75]">
                              {result.content}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-2 py-8 text-center text-sm text-[#777d75]">
                      Your recent note matches will appear here.
                    </p>
                  )}
                </>
              )}
            </div>

            {!hasSearched && !loading && (
              <div className="flex items-center justify-between border-t border-black/[0.07] bg-[#fafaf5] px-5 py-3 text-[11px] text-[#858a82]">
                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-black/10 bg-white px-1.5 py-0.5 text-[10px]">
                    ↵
                  </kbd>
                  Search notes
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="rounded border border-black/10 bg-white px-1.5 py-0.5 text-[10px]">
                    esc
                  </kbd>
                  Close
                </span>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
