export default function SubmitLoading() {
  return (
    <div className="mx-auto max-w-xl animate-pulse">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center space-y-3">
        <div className="h-8 w-64 rounded-lg bg-gray-200" />
        <div className="h-4 w-80 rounded bg-gray-200" />
      </div>

      {/* URL input */}
      <div className="space-y-4">
        <div className="h-12 w-full rounded-xl bg-gray-200" />
        <div className="h-12 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
