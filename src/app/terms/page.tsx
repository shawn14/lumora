import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/"
        className="text-sm font-medium text-lumora-600 hover:text-lumora-700"
      >
        &larr; Back to home
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Terms of Service
      </h1>
      <p className="mt-4 text-sm text-gray-500">Last updated: February 2026</p>
      <div className="mt-8 space-y-6 text-sm leading-7 text-gray-600">
        <p>
          By accessing or using Lumora, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use the
          platform.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">Use of Service</h2>
        <p>
          Lumora provides AI-powered and community-driven app reviews. You may
          submit apps for review and provide reviews of other users&apos; apps.
          You agree to use the platform responsibly and not submit malicious,
          misleading, or inappropriate content.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">User Content</h2>
        <p>
          You retain ownership of any content you submit. By submitting content,
          you grant Lumora a non-exclusive license to display and use that
          content as part of the platform&apos;s services.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">
          Limitation of Liability
        </h2>
        <p>
          Lumora is provided &ldquo;as is&rdquo; without warranties of any kind.
          We are not liable for any damages arising from your use of the
          platform.
        </p>
        <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        <p>
          If you have questions about these Terms, please contact us through the
          platform.
        </p>
      </div>
    </div>
  );
}
