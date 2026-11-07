import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getSip, getAllSips, getSipAlert } from "@/lib/data";
import SipAssistHomeClient from "./SipAssistHomeClient";

export const dynamic = "force-dynamic";

/**
 * The SIP (and every date/amount derived from it) is resolved here, on the
 * server, from the single central data source — never recomputed in the
 * browser, so it can't drift from what the homepage or details page show.
 */
export default async function SipAssistHomePage({
  searchParams,
}: {
  searchParams: Promise<{ sip?: string }>;
}) {
  const { sip: sipParam } = await searchParams;
  const sip = sipParam ? getSip(sipParam) : undefined;

  if (!sip) {
    const allSips = getAllSips();
    return (
      <div className="flex min-h-screen flex-col">
        <AppHeader variant="sub" title="SIP Compass" subtitle="Your SIP guidance assistant" backHref="/" />
        <main className="flex-1 space-y-4 px-4 py-5">
          <div>
            <h1 className="text-lg font-bold text-ink">Which SIP would you like help with?</h1>
            <p className="mt-1 text-sm text-muted">
              {sipParam
                ? "I couldn't find that SIP, so I don't want to guess — pick one below."
                : "Select a SIP so I can give you context-specific guidance."}
            </p>
          </div>
          <div className="space-y-2.5">
            {allSips.map((s) => (
              <Link
                key={s.id}
                href={`/sip-assist?sip=${s.id}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-white p-3.5 transition-colors hover:border-primary hover:bg-success-bg"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{s.fundName}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    ₹{s.monthlyAmount.toLocaleString("en-IN")}/month · {s.status}
                  </p>
                </div>
                <ChevronRight size={16} className="shrink-0 text-muted" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const alert = getSipAlert(sip);
  return <SipAssistHomeClient sip={sip} alert={alert} />;
}
