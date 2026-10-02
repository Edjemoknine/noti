export default function NoteCardSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-start gap-4 p-5 sm:p-6">
      <div className="mt-1 size-9 shrink-0 animate-pulse rounded-[10px] bg-black/6 motion-reduce:animate-none" />
      <div className="min-w-0 flex-1 animate-pulse motion-reduce:animate-none">
        <div className="h-4 w-2/5 rounded bg-black/8" />
        <div className="mt-2 h-3 w-4/5 rounded bg-black/6" />
        <div className="mt-1 h-3 w-3/5 rounded bg-black/6" />
        <div className="mt-3 flex gap-2">
          <div className="h-5 w-14 rounded-full bg-[#e8edcf]" />
          <div className="h-5 w-20 rounded-full bg-[#e8edcf]" />
        </div>
        <div className="mt-3 h-3 w-1/3 rounded bg-black/5" />
      </div>
    </div>
  );
}
