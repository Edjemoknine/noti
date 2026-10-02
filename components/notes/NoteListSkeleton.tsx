import NoteCardSkeleton from "@/components/notes/NoteCardSkeleton";

type NoteListSkeletonProps = {
  count?: number;
};

export default function NoteListSkeleton({ count = 5 }: NoteListSkeletonProps) {
  return (
    <div role="status" aria-label="Loading notes">
      {Array.from({ length: count }, (_, index) => (
        <NoteCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading notes...</span>
    </div>
  );
}
