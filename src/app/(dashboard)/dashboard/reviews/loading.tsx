export default function MyReviewsLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-36 rounded-lg bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                  <div className="h-6 w-14 rounded-lg bg-gray-200" />
                </div>
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="h-3 w-4/5 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
