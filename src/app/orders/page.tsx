import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { sampleSIP } from "@/lib/data";

const orders = [
  { date: "12 October", label: `${sampleSIP.fundName} — SIP instalment`, amount: 2000, status: "Completed" },
  { date: "12 September", label: `${sampleSIP.fundName} — SIP instalment`, amount: 2000, status: "Completed" },
  { date: "12 August", label: `${sampleSIP.fundName} — SIP instalment`, amount: 2000, status: "Completed" },
];

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />

      <main className="flex-1 space-y-4 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Orders</h1>

        <div className="space-y-2.5">
          {orders.map((order) => (
            <div key={order.date} className="flex items-center justify-between rounded-2xl border border-border bg-white p-3.5">
              <div>
                <p className="text-sm font-medium text-ink">{order.label}</p>
                <p className="mt-0.5 text-xs text-muted">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">₹{order.amount.toLocaleString("en-IN")}</p>
                <span className="mt-0.5 inline-block rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-medium text-primary-dark">
                  {order.status}
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
