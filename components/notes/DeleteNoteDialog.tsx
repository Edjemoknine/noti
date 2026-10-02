"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";

type DeleteNoteDialogProps = {
  noteTitle: string;
  isDeleting: boolean;
  hasError: boolean;
  onDelete: () => void;
  onClose: () => void;
};

export default function DeleteNoteDialog({
  noteTitle,
  isDeleting,
  hasError,
  onDelete,
  onClose,
}: DeleteNoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        aria-label="Delete note"
        title="Delete note"
        onClick={() => dialogRef.current?.showModal()}
        disabled={isDeleting}
        className="flex size-9 items-center justify-center rounded-lg text-[#a16c63] transition hover:bg-[#f7e9e6] hover:text-[#8b3f35] disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
      <dialog
        ref={dialogRef}
        role="alertdialog"
        aria-labelledby="delete-note-title"
        aria-describedby="delete-note-description"
        onClick={(event) => {
          if (event.target === event.currentTarget && !isDeleting) {
            event.currentTarget.close();
          }
        }}
        onClose={onClose}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-black/8 bg-[#fffefa] p-0 text-[#1f2825] shadow-[0_24px_80px_rgba(22,28,23,0.22)] backdrop:bg-[#1e241f]/35 backdrop:backdrop-blur-[2px]"
      >
        <div className="p-6 sm:p-7">
          <div className="mb-5 flex size-10 items-center justify-center rounded-xl bg-[#f7e9e6] text-[#a34f43]">
            <Trash2 size={18} />
          </div>
          <h2 id="delete-note-title" className="text-lg font-semibold text-[#292d29]">
            Delete “{noteTitle}”?
          </h2>
          <p id="delete-note-description" className="mt-2 text-sm leading-6 text-[#777d75]">
            This note will be permanently deleted. This action can&apos;t be undone.
          </p>
          {hasError && (
            <p role="alert" className="mt-4 text-sm text-[#a34f43]">
              The note could not be deleted. Please try again.
            </p>
          )}
          <div className="mt-7 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              disabled={isDeleting}
              className="h-10 rounded-lg border border-black/10 px-4 text-sm font-medium text-[#5d625c] transition hover:bg-black/4 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#a34f43] px-4 text-sm font-medium text-white transition hover:bg-[#873e34] disabled:cursor-wait disabled:opacity-60"
            >
              <Trash2 size={15} /> {isDeleting ? "Deleting..." : "Delete note"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
