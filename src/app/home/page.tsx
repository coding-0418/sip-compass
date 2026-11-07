import Link from "next/link";
import { LineChart, TrendingUp, Wallet } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";

const quickLinks = [
  { label: "Mutual Funds", description: "View and manage your SIPs", href: "/", icon: LineChart },
  { label: "Stocks", description: "Browse trending stocks", href: "/stocks", icon: TrendingUp },
  { label: "Portfolio", description: "Track your net worth", href: "/portfolio", icon: Wallet },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />

      <main className="flex-1 space-y-6 px-4 py-5">
        <div>
          <h1 className="text-xl font-bold text-ink">Good to see you</h1>
          <p className="mt-1 text-sm text-muted">Here&apos;s a quick look at your investments.</p>
        </div>

        <section className="rounded-2xl border border-border bg-success-bg p-4">
          <p className="text-xs font-medium text-primary-dark">Total invested</p>
          <p className="mt-1 text-2xl font-bold text-ink">₹18,000</p>
          <p className="mt-1 text-xs text-muted">Across 1 active SIP</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Quick access</h2>
          <div className="space-y-2.5">
            {quickLinks.map(({ label, description, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white p-3.5 transition-colors hover:bg-surface"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-primary-dark">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{label}</p>
                  <p className="text-xs text-muted">{description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <BottomNavigation />
    </div>
  );
}
