import Link from "next/link";
import { Bell, ChevronRight, HelpCircle, ReceiptText, Wallet } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const menu = [
  { label: "Orders", href: "/orders", icon: ReceiptText },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="Profile" backHref="/" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-bg text-base font-semibold text-primary-dark">
            DI
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Demo Investor</p>
            <p className="text-xs text-muted">demo.investor@example.com</p>
          </div>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
          {menu.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} className="flex items-center justify-between px-4 py-3.5 transition-colors hover:bg-surface">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary-dark">
                  <Icon size={17} />
                </span>
                <span className="text-sm font-medium text-ink">{label}</span>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
