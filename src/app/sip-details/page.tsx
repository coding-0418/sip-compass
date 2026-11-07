import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { sampleSIP } from "@/lib/data";

const rows = [
  { label: "Fund name", value: sampleSIP.fundName },
  { label: "Monthly SIP amount", value: `₹${sampleSIP.monthlyAmount.toLocaleString("en-IN")}` },
  { label: "Next instalment", value: sampleSIP.nextInstalmentDate },
  { label: "Status", value: sampleSIP.status },
  { label: "Frequency", value: "Monthly" },
  { label: "SIP start date", value: "12 March" },
];

export default function SipDetailsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="SIP details" backHref="/" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <div className="rounded-2xl border border-border bg-white">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-3 ${
                i !== rows.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-muted">{row.label}</span>
              <span className="text-sm font-medium text-ink">{row.value}</span>
            </div>
          ))}
        </div>

        <Link
          href="/sip-assist"
          className="block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Ask SIP Assist about this SIP
        </Link>
      </main>
    </div>
  );
}
