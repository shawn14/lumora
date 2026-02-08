export default function AppDetailLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Back link */}
      <div className="h-4 w-32 rounded bg-gray-200" />

      {/* App header */}
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="flex gap-4 pt-1">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-2">
        <div className="h-5 w-44 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-5/6 rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>

      {/* Review summary placeholder */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-6 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        <div className="h-5 w-28 rounded bg-gray-200" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-6 w-14 rounded-lg bg-gray-200" />
              </div>
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-4/5 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
