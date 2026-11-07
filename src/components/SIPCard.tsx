import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getSipAlert } from "@/lib/data";
import type { SIP } from "@/lib/types";

export default function SIPCard({ sip }: { sip: SIP }) {
  const alert = getSipAlert(sip);
  const absReturn = sip.currentValue - sip.totalInvested;
  const returnPct = ((absReturn / sip.totalInvested) * 100).toFixed(1);
  const statusTone =
    sip.status === "Active" ? "bg-success-bg text-primary-dark" : "bg-surface text-muted";

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      {alert ? (
        <div className="flex items-start gap-2 border-b border-[#F5DCA8] bg-warning-bg px-4 py-2.5 text-xs text-[#7A4E0A]">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">{alert.headline}</p>
            <p className="text-[#8A5C13]">{alert.detail}</p>
          </div>
        </div>
      ) : null}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">{sip.fundName}</p>
            <p className="mt-0.5 text-xs text-muted">{sip.frequency} SIP</p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusTone}`}>{sip.status}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-ink">₹{sip.monthlyAmount.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted">
              {sip.nextInstalmentDate ? `Next instalment: ${sip.nextInstalmentDate}` : "No upcoming instalment"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
          <div>
            <p className="text-[11px] text-muted">Invested</p>
            <p className="text-sm font-semibold text-ink">₹{sip.totalInvested.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Current value</p>
            <p className="text-sm font-semibold text-ink">₹{sip.currentValue.toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted">Returns</p>
            <p className={`text-sm font-semibold ${absReturn >= 0 ? "text-primary-dark" : "text-red-500"}`}>
              {absReturn >= 0 ? "+" : ""}
              {returnPct}%
            </p>
          </div>
        </div>

        <Link
          href={`/sip-details/${sip.id}`}
          className="mt-4 block rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-primary-dark transition-colors hover:bg-surface"
        >
          View SIP details
        </Link>
      </div>
    </div>
  );
}
