import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/"
        className="text-sm font-medium text-lumora-600 hover:text-lumora-700"
      >
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Privacy Policy</h1>
      <p className="mt-4 text-sm text-gray-500">Last updated: February 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
        <p>
          This Privacy Policy describes how Lumora collects, uses, and protects
          your information when you use our platform. By using Lumora, you agree
          to the collection and use of information in accordance with this
          policy.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">
          Information We Collect
        </h2>
        <p>
          We collect information you provide directly, such as your name, email
          address, and any app URLs or reviews you submit. We also collect usage
          data such as pages visited and features used.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">
          How We Use Your Information
        </h2>
        <p>
          We use your information to provide and improve the Lumora platform,
          including generating AI reviews, displaying community feedback, and
          communicating with you about your account.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information.
          However, no method of transmission over the internet is 100% secure.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us
          through the platform.
        </p>
      </div>
    </div>
  );
}
