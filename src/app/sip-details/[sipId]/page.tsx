import Link from "next/link";
import { notFound } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { getSip } from "@/lib/data";
import type { Instalment, InstalmentStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statusStyle: Record<InstalmentStatus, string> = {
  Allotted: "bg-success-bg text-primary-dark",
  Processing: "bg-warning-bg text-[#8A5C13]",
  Debited: "bg-warning-bg text-[#8A5C13]",
  Scheduled: "bg-surface text-muted",
  Failed: "bg-red-50 text-red-600",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="px-1 text-sm font-semibold text-ink">{title}</h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">{children}</div>
    </section>
  );
}

function InstalmentRow({ instalment }: { instalment: Instalment }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm font-medium text-ink">{instalment.date}</p>
        <p className="text-xs text-muted">₹{instalment.amount.toLocaleString("en-IN")}</p>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[instalment.status]}`}>
        {instalment.status}
      </span>
    </div>
  );
}

export default async function SipDetailsPage({ params }: { params: Promise<{ sipId: string }> }) {
  const { sipId } = await params;
  const sip = getSip(sipId);
  if (!sip) notFound();

  const absReturn = sip.currentValue - sip.totalInvested;
  const returnPct = ((absReturn / sip.totalInvested) * 100).toFixed(1);
  const isStopped = sip.status === "Stopped";

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="SIP details" backHref="/" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <Section title="SIP overview">
          <Row label="Fund name" value={sip.fundName} />
          <Row label="Monthly amount" value={`₹${sip.monthlyAmount.toLocaleString("en-IN")}`} />
          <Row label="Frequency" value={sip.frequency} />
          <Row label="Start date" value={sip.startDate} />
          <Row label="Status" value={sip.status} />
          {isStopped ? <Row label="Stopped on" value={sip.stoppedDate ?? "—"} /> : null}
        </Section>

        <Section title="Investment snapshot">
          <Row label="Total invested" value={`₹${sip.totalInvested.toLocaleString("en-IN")}`} />
          <Row label="Current value" value={`₹${sip.currentValue.toLocaleString("en-IN")}`} />
          <Row
            label="Absolute return"
            value={`${absReturn >= 0 ? "+" : ""}₹${absReturn.toLocaleString("en-IN")} (${absReturn >= 0 ? "+" : ""}${returnPct}%)`}
          />
          <Row label="XIRR" value={`${sip.xirrPct}%`} />
          <Row label="Successful instalments" value={String(sip.totalSuccessfulInstalments)} />
          <Row label="Units held" value={sip.unitsHeld.toFixed(2)} />
        </Section>

        <Section title="Payment details">
          <Row label="Next instalment" value={sip.nextInstalmentDate ?? "None scheduled"} />
          <Row label="Previous instalment" value={sip.previousInstalmentDate ?? "—"} />
          <Row label="AutoPay status" value={sip.autopayStatus} />
          <Row label="Bank account" value={sip.bankAccountMasked} />
        </Section>

        <section className="space-y-2">
          <h2 className="px-1 text-sm font-semibold text-ink">Recent instalments</h2>
          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
            {sip.recentInstalments
              .slice()
              .reverse()
              .map((inst) => (
                <InstalmentRow key={inst.date} instalment={inst} />
              ))}
          </div>
          <p className="px-1 text-xs text-muted">
            Showing the most recent instalments · {sip.totalSuccessfulInstalments} successful instalments in total.
          </p>
        </section>

        {!isStopped ? (
          <section className="space-y-2">
            <h2 className="px-1 text-sm font-semibold text-ink">Manage SIP</h2>
            <div className="rounded-2xl border border-border bg-warning-bg p-3 text-xs text-[#7A4E0A]">
              These represent existing Groww functionality and may depend on your eligibility and mandate type.
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link href={`/sip-assist?sip=${sip.id}&topic=manage`} className="rounded-xl border border-border bg-white py-3 text-center text-xs font-medium text-primary-dark transition-colors hover:bg-surface">
                Edit amount
              </Link>
              <Link href={`/sip-assist?sip=${sip.id}&topic=manage`} className="rounded-xl border border-border bg-white py-3 text-center text-xs font-medium text-primary-dark transition-colors hover:bg-surface">
                Change date
              </Link>
              <Link href={`/sip-assist?sip=${sip.id}&topic=manage`} className="rounded-xl border border-border bg-white py-3 text-center text-xs font-medium text-primary-dark transition-colors hover:bg-surface">
                Skip instalment
              </Link>
            </div>
          </section>
        ) : null}

        <Link
          href={`/sip-assist?sip=${sip.id}`}
          className="block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ask SIP Compass about this SIP
        </Link>
      </main>
    </div>
  );
}
