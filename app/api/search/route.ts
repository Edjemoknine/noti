import { searchNotes } from "@/lib/semantic-search";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    console.log({ query });

    if (!query?.trim()) {
      return NextResponse.json({
        results: [],
      });
    }

    const results = await searchNotes(query, new URL("/api/embed", req.url), 8);
    console.log({ results });

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error("[search]", error);

    return NextResponse.json(
      {
        error: "Search failed",
      },
      {
        status: 500,
      },
    );
  }
}
