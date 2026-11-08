"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, FileCheck2, LifeBuoy, SendHorizonal, Settings2, TrendingUp } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/data";
import type { SIP, Topic } from "@/lib/types";

const topicIcons: Record<Topic, typeof CreditCard> = {
  payment: CreditCard,
  mandate: FileCheck2,
  manage: Settings2,
  understand: TrendingUp,
};

/**
 * All SIP data (dates, amounts, alert) is resolved server-side in page.tsx and
 * passed in as plain props — this component only handles interaction (input,
 * navigation), never recomputes "today" or any figure on the client.
 */
export default function SipAssistHomeClient({
  sip,
  alert,
}: {
  sip: SIP;
  alert: { headline: string; detail: string } | null;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");

  const isStopped = sip.status === "Stopped";
  const sipId = sip.id;

  function openTopic(topic: Topic) {
    router.push(`/sip-assist/chat?sip=${sipId}&topic=${topic}`);
  }

  function openStopped() {
    router.push(`/sip-assist/chat?sip=${sipId}&stopped=1`);
  }

  function submitInput() {
    const trimmed = input.trim();
    if (!trimmed) return;
    router.push(`/sip-assist/chat?sip=${sipId}&q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="SIP Compass" subtitle="Your SIP guidance assistant" backHref="/" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <div>
          <h1 className="text-lg font-bold text-ink">Hi! I&apos;m SIP Compass.</h1>
          <p className="mt-1 text-sm text-muted">
            I can help you understand your SIP and guide you through the next step.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-3.5">
          <p className="text-sm font-semibold text-ink">{sip.fundName}</p>
          <p className="mt-0.5 text-xs text-muted">
            ₹{sip.monthlyAmount.toLocaleString("en-IN")}/month · {sip.status}
            {sip.status !== "Stopped" ? ` · AutoPay ${sip.autopayStatus}` : ""}
          </p>
          {alert ? <p className="mt-1.5 text-xs font-medium text-[#8A5C13]">{alert.headline}</p> : null}
        </div>

        {isStopped ? (
          <button
            type="button"
            onClick={openStopped}
            className="block w-full rounded-2xl border border-border bg-white p-4 text-left transition-colors hover:border-primary hover:bg-success-bg"
          >
            <p className="text-sm font-semibold text-ink">Understand why this was stopped</p>
            <p className="mt-1 text-sm text-muted">Walk through what happened and see your options — no pressure to restart.</p>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                icon={topicIcons[topic.id]}
                title={topic.title}
                description={topic.description}
                onClick={() => openTopic(topic.id)}
              />
            ))}
          </div>
        )}

        <Link
          href={`/support?context=${encodeURIComponent(sip.fundName)}`}
          className="flex items-center gap-2.5 rounded-2xl border border-border bg-white p-3.5 transition-colors hover:bg-surface"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-primary-dark">
            <LifeBuoy size={17} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink">Talk to a human</p>
            <p className="text-xs text-muted">Contact Groww Support about this SIP</p>
          </div>
        </Link>
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitInput();
        }}
        className="flex items-center gap-2 border-t border-border px-3 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Ask anything about your SIP..."
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-primary"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark disabled:opacity-40"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
      <p className="px-4 pb-3 text-center text-[11px] leading-snug text-muted">
        Not investment advice. AI only interprets your question; every figure comes from your SIP record (demo data).
      </p>
    </div>
  );
}
