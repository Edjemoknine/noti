export default function NoteDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading note details"
      className="mx-auto h-full max-w-225 overflow-y-auto px-5 py-9 sm:px-8 sm:py-12 lg:px-12 lg:py-16"
    >
      <div className="mb-10 flex items-center justify-between gap-4 animate-pulse motion-reduce:animate-none">
        <div className="h-4 w-28 rounded bg-black/8" />
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-black/8" />
          <div className="size-9 rounded-lg bg-black/6" />
        </div>
      </div>

      <div className="rounded-2xl border border-black/6 bg-white/70 px-6 py-8 sm:px-10 sm:py-12">
        <div className="animate-pulse motion-reduce:animate-none">
          <div className="mb-8 flex items-center gap-3">
            <div className="size-9 rounded-[10px] bg-[#eee8fc]" />
            <div className="h-3 w-24 rounded bg-black/6" />
            <div className="h-3 w-20 rounded bg-black/6" />
          </div>
          <div className="h-12 w-4/5 rounded bg-black/8 sm:h-16" />
          <div className="mt-8 rounded-xl border border-[#dfe8bc] bg-[#f4f7df] p-5">
            <div className="h-3 w-full rounded bg-[#e5ebc8]" />
            <div className="mt-2 h-3 w-3/4 rounded bg-[#e5ebc8]" />
          </div>
          <div className="mt-10 space-y-3">
            <div className="h-3 w-full rounded bg-black/6" />
            <div className="h-3 w-full rounded bg-black/6" />
            <div className="h-3 w-5/6 rounded bg-black/6" />
            <div className="h-3 w-2/3 rounded bg-black/6" />
          </div>
          <div className="mt-12 grid gap-8 border-t border-black/8 pt-8 sm:grid-cols-2">
            <div>
              <div className="mb-4 h-3 w-20 rounded bg-black/6" />
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-full bg-[#eee8fc]" />
                <div className="h-7 w-20 rounded-full bg-[#eee8fc]" />
              </div>
            </div>
            <div>
              <div className="mb-4 h-3 w-24 rounded bg-black/6" />
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-black/6" />
                <div className="h-3 w-4/5 rounded bg-black/6" />
              </div>
            </div>
          </div>
        </div>
        <span className="sr-only">Loading note details...</span>
      </div>
    </div>
  );
}
