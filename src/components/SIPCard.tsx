import Link from "next/link";
import type { SIP } from "@/lib/types";

export default function SIPCard({ sip }: { sip: SIP }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{sip.fundName}</p>
          <p className="mt-0.5 text-xs text-muted">Monthly SIP</p>
        </div>
        <span className="shrink-0 rounded-full bg-success-bg px-2.5 py-1 text-xs font-medium text-primary-dark">
          {sip.status}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-ink">₹{sip.monthlyAmount.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted">Next instalment: {sip.nextInstalmentDate}</p>
        </div>
      </div>

      <Link
        href="/sip-details"
        className="mt-4 block rounded-xl border border-border py-2.5 text-center text-sm font-semibold text-primary-dark transition-colors hover:bg-surface"
      >
        View SIP details
      </Link>
    </div>
  );
}
