import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { getAllSips } from "@/lib/data";
import type { Instalment, InstalmentStatus, SIP } from "@/lib/types";

const statusStyle: Record<InstalmentStatus, string> = {
  Allotted: "bg-success-bg text-primary-dark",
  Processing: "bg-warning-bg text-[#8A5C13]",
  Debited: "bg-warning-bg text-[#8A5C13]",
  Scheduled: "bg-surface text-muted",
  Failed: "bg-red-50 text-red-600",
};

const statusLabel: Record<InstalmentStatus, string> = {
  Allotted: "Completed",
  Processing: "Processing",
  Debited: "Debited",
  Scheduled: "Scheduled",
  Failed: "Failed",
};

interface Row {
  sip: SIP;
  instalment: Instalment;
}

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  const rows: Row[] = getAllSips()
    .flatMap((sip) => sip.recentInstalments.map((instalment) => ({ sip, instalment })))
    .sort((a, b) => Date.parse(b.instalment.date) - Date.parse(a.instalment.date));

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />

      <main className="flex-1 space-y-4 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Orders</h1>

        <div className="space-y-2.5">
          {rows.map(({ sip, instalment }) => (
            <div
              key={`${sip.id}-${instalment.date}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-white p-3.5"
            >
              <div>
                <p className="text-sm font-medium text-ink">{sip.fundName} — SIP instalment</p>
                <p className="mt-0.5 text-xs text-muted">{instalment.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">₹{instalment.amount.toLocaleString("en-IN")}</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle[instalment.status]}`}>
                  {statusLabel[instalment.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
