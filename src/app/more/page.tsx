import Link from "next/link";
import { Bell, ChevronRight, HelpCircle, ReceiptText, UserRound, Wallet } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import TopTabs from "@/components/TopTabs";

const menu = [
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Orders", href: "/orders", icon: ReceiptText },
  { label: "Portfolio", href: "/portfolio", icon: Wallet },
  { label: "Help & Support", href: "/support", icon: HelpCircle },
];

export default function MorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />
      <TopTabs />

      <main className="flex-1 space-y-4 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">More</h1>

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

      <BottomNavigation />
    </div>
  );
}
