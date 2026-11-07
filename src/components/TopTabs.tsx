"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Stocks", href: "/stocks" },
  { label: "Mutual Funds", href: "/" },
  { label: "US Stocks", href: "/us-stocks" },
  { label: "More", href: "/more" },
];

export default function TopTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-5 border-b border-border px-4">
      {tabs.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`border-b-2 py-3 text-sm font-medium transition-colors ${
              active ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
