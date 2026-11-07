"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, FileCheck2, SendHorizonal, Settings2, TrendingUp } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import TopicCard from "@/components/TopicCard";
import { topics } from "@/lib/data";
import type { Topic } from "@/lib/types";

const topicIcons: Record<Topic, typeof CreditCard> = {
  payment: CreditCard,
  mandate: FileCheck2,
  manage: Settings2,
  understand: TrendingUp,
};

export default function SipAssistHomePage() {
  const router = useRouter();
  const [input, setInput] = useState("");

  function openTopic(topic: Topic) {
    router.push(`/sip-assist/chat?topic=${topic}`);
  }

  function submitInput() {
    const trimmed = input.trim();
    if (!trimmed) return;
    router.push(`/sip-assist/chat?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title="SIP Assist" subtitle="Your SIP guidance assistant" backHref="/" />

      <main className="flex-1 space-y-5 px-4 py-5">
        <div>
          <h1 className="text-lg font-bold text-ink">Hi! How can I help?</h1>
          <p className="mt-1 text-sm text-muted">
            I can help explain your SIP journey and guide you to the right action.
          </p>
        </div>

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
