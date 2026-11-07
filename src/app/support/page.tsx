"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Headset, Info, Mail, Phone } from "lucide-react";
import AppHeader from "@/components/AppHeader";

const options = [
  { icon: Headset, label: "Chat with us", caption: "Available in-app, 9 AM – 9 PM" },
  { icon: Phone, label: "Call support", caption: "1800-419-7799 (toll-free)" },
  { icon: Mail, label: "Email", caption: "support@groww-assist-demo.example" },
];

function SupportContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get("context");

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="Contact Groww Support" subtitle="Human support" backHref="/sip-assist" />

      <main className="flex-1 space-y-4 px-4 py-5">
        {context ? (
          <div className="rounded-2xl border border-border bg-surface p-3.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Your issue, so far</p>
            <p className="mt-1 text-sm text-ink">{context}</p>
          </div>
        ) : null}

        <div className="flex gap-2.5 rounded-xl border border-[#F5DCA8] bg-warning-bg p-3 text-sm">
          <Info size={16} className="mt-0.5 shrink-0 text-[#B8781A]" />
          <p className="text-[#7A4E0A]">
            You&apos;re being redirected to Groww Support{context ? " with the context above" : ""}. This is a
            demonstration prototype — no support ticket has actually been created.
          </p>
        </div>

        <p className="text-sm text-muted">Here&apos;s how you can reach the support team:</p>

        <div className="space-y-2.5">
          {options.map((option) => (
            <div key={option.label} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-bg text-primary-dark">
                <option.icon size={16} />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{option.label}</p>
                <p className="text-xs text-muted">{option.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportContent />
    </Suspense>
  );
}
