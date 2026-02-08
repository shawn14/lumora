export default function BrowseLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-40 rounded-lg bg-gray-200" />
        <div className="h-4 w-56 rounded bg-gray-200" />
      </div>

      {/* App cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="space-y-3">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-2/3 rounded bg-gray-200" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
