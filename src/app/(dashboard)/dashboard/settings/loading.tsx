export default function SettingsLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-28 rounded-lg bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-10 w-full rounded-lg bg-gray-200" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-10 w-full rounded-lg bg-gray-200" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
