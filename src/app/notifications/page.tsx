import AppHeader from "@/components/AppHeader";
import { activeSip, stoppedSip, TODAY } from "@/lib/data";
import { AlertTriangle, BadgeCheck, Bell } from "lucide-react";

const latest = activeSip.recentInstalments[activeSip.recentInstalments.length - 1];
const previous = activeSip.recentInstalments[activeSip.recentInstalments.length - 2];

const notifications = [
  {
    icon: AlertTriangle,
    title: `${latest.date.split(" ")[1]} instalment is ${latest.status.toLowerCase()}`,
    body: `₹${latest.amount.toLocaleString("en-IN")} was debited from your ${activeSip.bankAccountMasked} account for ${activeSip.fundName} on ${latest.date}. Units haven't been allotted yet.`,
    time: "Yesterday",
  },
  {
    icon: BadgeCheck,
    title: "SIP instalment successful",
    body: `₹${previous.amount.toLocaleString("en-IN")} was invested in ${activeSip.fundName} on ${previous.date}.`,
    time: "1 month ago",
  },
  {
    icon: BadgeCheck,
    title: "AutoPay mandate approved",
    body: `Your AutoPay mandate for ${activeSip.fundName} was approved on ${activeSip.mandateApprovedDate}.`,
    time: `On ${activeSip.mandateApprovedDate}`,
  },
  {
    icon: Bell,
    title: "SIP stopped",
    body: `Your ${stoppedSip.fundName} SIP was stopped on ${stoppedSip.stoppedDate}. Your existing units remain invested.`,
    time: `On ${stoppedSip.stoppedDate}`,
  },
];

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="Notifications" backHref="/" />

      <main className="flex-1 space-y-2.5 px-4 py-5">
        <p className="px-1 text-xs text-muted">As of {TODAY}</p>
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
