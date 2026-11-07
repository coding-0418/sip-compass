import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import { getSipAlert } from "@/lib/data";
import type { SIP } from "@/lib/types";

export default function SIPAssistEntryCard({ sip }: { sip: SIP }) {
  const alert = getSipAlert(sip);
  const isIssue = Boolean(alert);

  return (
    <div className={`rounded-2xl border p-4 ${isIssue ? "border-[#F5DCA8] bg-warning-bg" : "border-border bg-success-bg"}`}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-dark">
          {isIssue ? <AlertTriangle size={16} className="text-[#B8781A]" /> : <Sparkles size={16} />}
        </span>
        <p className="text-sm font-semibold text-ink">{isIssue ? alert!.headline : "Your SIP, made clearer."}</p>
      </div>
      <p className="mt-2 text-sm text-muted">
        {isIssue ? "Let's understand what's happening." : "Check status, understand payments and manage your SIP."}
      </p>
      <Link
        href={`/sip-assist?sip=${sip.id}`}
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Ask SIP Compass
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
