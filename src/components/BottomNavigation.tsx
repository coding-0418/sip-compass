"use client";

import { Home, LineChart, ReceiptText, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Mutual Funds", href: "/", icon: LineChart },
  { label: "Orders", href: "/orders", icon: ReceiptText },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
];

const mutualFundsAreaPrefixes = ["/sip-assist", "/sip-details", "/help", "/stocks", "/us-stocks", "/more"];

export default function BottomNavigation() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/" || mutualFundsAreaPrefixes.some((p) => pathname.startsWith(p));
    }
    return pathname === href;
  }

  return (
    <nav className="flex border-t border-border bg-white px-2 py-2">
      {items.map(({ label, href, icon: Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={label}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors ${
              active ? "text-primary" : "text-muted hover:text-ink"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
