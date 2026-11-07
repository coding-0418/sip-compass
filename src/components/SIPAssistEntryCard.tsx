import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SIPAssistEntryCard() {
  return (
    <div className="rounded-2xl border border-border bg-success-bg p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary-dark">
          <Sparkles size={16} />
        </span>
        <p className="text-sm font-semibold text-ink">Need help with your SIP?</p>
      </div>
      <p className="mt-2 text-sm text-muted">
        Understand payments, mandates, instalments and SIP management.
      </p>
      <Link
        href="/sip-assist"
        className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Ask SIP Assist
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
