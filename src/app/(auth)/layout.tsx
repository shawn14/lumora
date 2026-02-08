export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-lumora-600 via-lumora-700 to-lumora-900 flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lumora</h1>
          <p className="mt-1 text-lumora-200 text-sm">AI-Powered Customer Research</p>
        </div>
        <div className="space-y-6">
          <blockquote className="text-lg font-medium leading-relaxed text-lumora-100">
            &ldquo;Lumora transformed how we understand our customers. The AI
            interviews surface insights we never would have found manually.&rdquo;
          </blockquote>
          <p className="text-sm text-lumora-300">
            Sarah Chen, Head of Product at Acme Inc
          </p>
        </div>
        <p className="text-xs text-lumora-400">
          &copy; {new Date().getFullYear()} Lumora. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 bg-gray-50">
        {children}
      </div>
    </div>
  );
}
