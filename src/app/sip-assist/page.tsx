"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ChevronRight, CreditCard, FileCheck2, LifeBuoy, SendHorizonal, Settings2, TrendingUp } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import TopicCard from "@/components/TopicCard";
import { getSip, getSipAlert, getAllSips, topics } from "@/lib/data";
import type { Topic } from "@/lib/types";

const topicIcons: Record<Topic, typeof CreditCard> = {
  payment: CreditCard,
  mandate: FileCheck2,
  manage: Settings2,
  understand: TrendingUp,
};

function SipAssistHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");

  const sipParam = searchParams.get("sip");
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
    </div>
  );
}

export default function SipAssistHomePage() {
  return (
    <Suspense fallback={null}>
      <SipAssistHome />
    </Suspense>
  );
}
