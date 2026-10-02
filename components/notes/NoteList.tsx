"use client";

import type { MouseEvent } from "react";
import type { NoteRecord } from "@/actions/notes";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import NoteCard from "@/components/notes/NoteCard";

type NoteListProps = {
  notes: NoteRecord[];
  isLoading: boolean;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onOpen: (id: string) => void;
};

export default function NoteList({
  notes,
  isLoading,
  page,
  pageCount,
  onPageChange,
  onOpen,
}: NoteListProps) {
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const pageNumbers = Array.from(
    { length: Math.max(0, pageCount - 2) },
    (_, index) => index + 2,
  ).filter((pageNumber) => Math.abs(pageNumber - currentPage) <= 1);

  const goToPage = (nextPage: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onPageChange(nextPage);
  };

  return (
    <>
      <div className="divide-y divide-black/6 rounded-2xl border border-black/6 bg-white/60">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-[#999]">Loading notes...</div>
        ) : notes.length ? (
          notes.map((note) => <NoteCard key={note.id} note={note} onOpen={onOpen} />)
        ) : (
          <div className="p-12 text-center text-sm text-[#999]">No notes match your search.</div>
        )}
      </div>

      {!isLoading && pageCount > 1 && (
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                onClick={goToPage(currentPage - 1)}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive={currentPage === 1} onClick={goToPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pageNumbers.map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === pageNumber}
                  onClick={goToPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < pageCount - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {pageCount > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={currentPage === pageCount}
                  onClick={goToPage(pageCount)}
                >
                  {pageCount}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={currentPage === pageCount}
                className={currentPage === pageCount ? "pointer-events-none opacity-50" : undefined}
                onClick={goToPage(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
