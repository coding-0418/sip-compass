import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { sampleSIP } from "@/lib/data";

const invested = 18000;
const currentValue = 19260;
const returns = currentValue - invested;
const returnsPct = ((returns / invested) * 100).toFixed(1);

export default function PortfolioPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="main" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <h1 className="text-xl font-bold text-ink">Portfolio</h1>

        <section className="rounded-2xl border border-border bg-white p-4">
          <p className="text-xs text-muted">Current value</p>
          <p className="mt-1 text-2xl font-bold text-ink">₹{currentValue.toLocaleString("en-IN")}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted">Invested amount</p>
              <p className="mt-0.5 text-sm font-semibold text-ink">₹{invested.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Returns</p>
              <p className="mt-0.5 text-sm font-semibold text-primary-dark">
                +₹{returns.toLocaleString("en-IN")} ({returnsPct}%)
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-ink">Holdings</h2>
          <div className="rounded-2xl border border-border bg-white p-3.5">
            <p className="text-sm font-medium text-ink">{sampleSIP.fundName}</p>
            <p className="mt-0.5 text-xs text-muted">Monthly SIP · ₹{sampleSIP.monthlyAmount.toLocaleString("en-IN")}</p>
          </div>
        </section>

        <p className="text-xs leading-relaxed text-muted">
          Returns shown are for illustration in this prototype and move with the market — they aren&apos;t a
          prediction of future performance.
        </p>
      </main>

      <BottomNavigation />
    </div>
  );
}
