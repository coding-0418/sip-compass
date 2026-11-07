import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { allSips } from "@/lib/data";

export default function PortfolioPage() {
  const invested = allSips.reduce((sum, s) => sum + s.totalInvested, 0);
  const currentValue = allSips.reduce((sum, s) => sum + s.currentValue, 0);
  const returns = currentValue - invested;
  const returnsPct = ((returns / invested) * 100).toFixed(1);

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
          <div className="space-y-2.5">
            {allSips.map((sip) => {
              const sipReturn = sip.currentValue - sip.totalInvested;
              const sipReturnPct = ((sipReturn / sip.totalInvested) * 100).toFixed(1);
              return (
                <Link
                  key={sip.id}
                  href={`/sip-details/${sip.id}`}
                  className="block rounded-2xl border border-border bg-white p-3.5 transition-colors hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-ink">{sip.fundName}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {sip.status === "Stopped" ? "Monthly SIP · Stopped" : `Monthly SIP · ₹${sip.monthlyAmount.toLocaleString("en-IN")}`}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
                      XIRR {sip.xirrPct}%
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-muted">₹{sip.totalInvested.toLocaleString("en-IN")} invested</span>
                    <span className={`font-medium ${sipReturn >= 0 ? "text-primary-dark" : "text-red-500"}`}>
                      ₹{sip.currentValue.toLocaleString("en-IN")} ({sipReturn >= 0 ? "+" : ""}
                      {sipReturnPct}%)
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="text-xs leading-relaxed text-muted">
          Figures shown are demonstration data for this prototype and move with the market — they aren&apos;t a
          prediction of future performance.
        </p>
      </main>

      <BottomNavigation />
    </div>
  );
}
