"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log({ query });

  async function handleSearch() {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      const data = await response.json();

      setResults(data.results);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="relative max-w-[350px] flex-1">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa7a5]" />
      <input
        aria-label="Search notes"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Search your notes..."
        className="h-10 w-full rounded-xl border border-black/[0.06] bg-white/70 pl-10 pr-4 text-sm outline-none placeholder:text-[#b5b2b0] focus:border-[#b5a6e6] focus:ring-2 focus:ring-[#b5a6e6]/20"
      />

      {loading && <p>Searching...</p>}

      {results?.map((result: any) => (
        <div key={result.chunkId}>
          <h3>{result.noteTitle}</h3>
          <p>{result.content}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchBar;
