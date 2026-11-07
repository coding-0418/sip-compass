import AppHeader from "@/components/AppHeader";
import { BadgeCheck, Bell, Info } from "lucide-react";

const notifications = [
  {
    icon: BadgeCheck,
    title: "SIP instalment successful",
    body: "₹2,000 was invested in Parag Parikh Flexi Cap Fund on 12 October.",
    time: "2 days ago",
  },
  {
    icon: Info,
    title: "Mandate approved",
    body: "Your AutoPay mandate for Parag Parikh Flexi Cap Fund is now active.",
    time: "3 weeks ago",
  },
  {
    icon: Bell,
    title: "SIP started",
    body: "Your monthly SIP of ₹2,000 in Parag Parikh Flexi Cap Fund has begun.",
    time: "2 months ago",
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="Notifications" backHref="/" />

      <main className="flex-1 space-y-2.5 px-4 py-5">
        {notifications.map((item) => (
          <div key={item.title} className="flex gap-3 rounded-2xl border border-border bg-white p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg text-primary-dark">
              <item.icon size={17} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{item.title}</p>
              <p className="mt-0.5 text-xs text-muted">{item.body}</p>
              <p className="mt-1 text-[11px] text-muted">{item.time}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
