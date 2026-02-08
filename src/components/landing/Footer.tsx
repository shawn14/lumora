const footerLinks = {
  Product: [
    { label: "AI Reviews", href: "#" },
    { label: "Community Reviews", href: "#" },
    { label: "Structured Ratings", href: "#" },
    { label: "Reports", href: "#" },
    { label: "Browse Apps", href: "/dashboard/browse" },
  ],
  "For Developers": [
    { label: "Submit App", href: "/signup" },
    { label: "Review Apps", href: "/dashboard/browse" },
    { label: "Leaderboard", href: "#" },
    { label: "API", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lumora-600">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Lumora</span>
            </a>
            <p className="mt-4 text-sm leading-6 text-gray-500">
              Get expert feedback on your apps from AI and the developer community.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900">
                {category}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-500 transition-colors hover:text-gray-700"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-100 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Lumora, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
