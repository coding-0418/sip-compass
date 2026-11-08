"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import ChatMessageView from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import { RESTRICTED_TEXT, matchMessage, topicEntryNode, topicOpeningMessage, stoppedIntroNode, stoppedIntroMessage } from "@/lib/conversation";
import { INTENTS, type IntentId } from "@/lib/intents";
import type { ChatMessage, ConversationNode, SIP, Topic } from "@/lib/types";

const topicTitle: Record<Topic, string> = {
  payment: "Payment and instalments",
  mandate: "AutoPay (mandate) status",
  manage: "Manage my SIP",
  understand: "Understand my investment",
};

type RouteResponse = {
  label: string;
  nodeId: string | null;
  source: "ai" | "keyword" | "none";
  confidence: number | null;
  restatement: string | null;
};

function labelText(label: string) {
  return label in INTENTS ? INTENTS[label as IntentId].label : "your question";
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

function nodeToMessage(node: ConversationNode | undefined): ChatMessage | null {
  if (!node) return null;
  return {
    id: nextId(),
    role: "assistant",
    text: node.assistantText,
    structured: node.structured,
    infoCard: node.infoCard,
    verified: node.verified,
    options: node.options,
    suggestedActions: node.suggestedActions,
  };
}

/**
 * `sip` and `nodes` are resolved server-side (page.tsx) from the single
 * central data source — this component never calls getSip or recomputes any
 * date/amount itself, it only drives the conversation UI.
 */
export default function ChatScreenClient({
  sip,
  nodes,
  topicParam,
  stoppedParam,
  qParam,
}: {
  sip: SIP;
  nodes: Record<string, ConversationNode>;
  topicParam: Topic | null;
  stoppedParam: string | null;
  qParam: string | null;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const initialised = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isStopped = sip.status === "Stopped";
  const headerTitle = topicParam && topicTitle[topicParam] ? topicTitle[topicParam] : "SIP Compass";

  function respondWithNode(nodeId: string, delay = 700) {
    setTyping(true);
    window.setTimeout(() => {
      const assistantMsg = nodeToMessage(nodes[nodeId]);
      setTyping(false);
      if (assistantMsg) {
        setMessages((prev) => [...prev, assistantMsg]);
      }
    }, delay);
  }

  function respondWithText(text: string, delay = 700) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", text: [text] }]);
    }, delay);
  }

  function handleFreeText(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: [trimmed] }]);

    if (isStopped) {
      respondWithText(
        "I'm not able to answer free-form questions about a stopped SIP yet — pick one of the reasons above, or contact support for anything specific.",
      );
      return;
    }

    void routeWithAi(trimmed);
  }

  async function routeWithAi(text: string) {
    setTyping(true);
    let r: RouteResponse | null = null;
    try {
      const res = await fetch("/api/route-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) r = (await res.json()) as RouteResponse;
    } catch {
      r = null;
    }
    setTyping(false);

    // Network failure: use the on-device keyword router and say so.
    if (!r) {
      const { restricted, topic, nodeId } = matchMessage(text);
      if (restricted) return respondWithText(RESTRICTED_TEXT, 0);
      if (topic) {
        pushCheck(false, "Quality check: AI unavailable", "I matched your question by keywords instead. If this isn't what you meant, pick a topic or contact Groww Support.");
        return respondWithNode(nodeId ?? topicEntryNode[topic], 300);
      }
      return respondUnclear();
    }

    const conf = r.confidence !== null ? ` · confidence ${r.confidence.toFixed(2)}` : "";
    if (r.label === "advice_request") {
      pushCheck(true, "Quality check: advice request declined", `This asks for a fund, market or buy/sell view${conf}. SIP Compass doesn't give investment advice.`);
      return respondWithText(RESTRICTED_TEXT, 300);
    }
    if (r.nodeId && nodes[r.nodeId]) {
      if (r.source === "ai") {
        pushCheck(
          true,
          "Quality check passed",
          `Understood as: ${r.restatement ?? labelText(r.label)}${conf}. The answer below is built from your verified SIP record. The AI didn't write any figures.`,
        );
      } else {
        pushCheck(false, "Quality check: low confidence", `I wasn't sure I understood${conf}, so I matched keywords instead. If this isn't right, pick a topic or contact Groww Support.`);
      }
      return respondWithNode(r.nodeId, 300);
    }
    return respondUnclear(r.label === "out_of_scope");
  }

  function pushCheck(passed: boolean, title: string, body: string) {
    setMessages((prev) => [...prev, { id: nextId(), role: "assistant", infoCard: { title: (passed ? "✓ " : "⚠ ") + title, body, tone: passed ? "default" : "warning" } }]);
  }

  function respondUnclear(outOfScope = false) {
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "assistant",
        infoCard: {
          title: "⚠ Quality check: not confident",
          body: outOfScope
            ? "This looks outside what SIP Compass can answer from your SIP record, so I won't guess."
            : "I couldn't confidently tell what you meant, so I won't guess.",
          tone: "warning",
        },
        text: ["Pick the closest topic, or talk to Groww Support."],
        options: (Object.keys(topicEntryNode) as Topic[]).map((t) => ({ id: `t-${t}`, label: topicTitle[t], nextNodeId: topicEntryNode[t] })),
        suggestedActions: [{ id: "support", label: "Contact Groww Support", description: "Official help for anything else", href: `/support?context=${encodeURIComponent(sip.fundName)}` }],
      },
    ]);
  }

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    if (isStopped || stoppedParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time chat bootstrap, not a render loop
      setMessages([{ id: nextId(), role: "user", text: [stoppedIntroMessage] }]);
      respondWithNode(stoppedIntroNode);
      return;
    }

    if (topicParam && topicEntryNode[topicParam]) {
      setMessages([{ id: nextId(), role: "user", text: [topicOpeningMessage[topicParam]] }]);
      respondWithNode(topicEntryNode[topicParam]);
      return;
    }

    if (qParam) {
      handleFreeText(qParam);
      return;
    }

    setMessages([
      {
        id: nextId(),
        role: "assistant",
        text: ["Hi! I'm SIP Compass.", "I can help you understand your SIP and guide you through the next step."],
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function handleOptionSelect(messageId: string, _optionId: string, nextNodeId: string, label: string) {
    setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, resolved: true } : m)));
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: [label] }]);
    respondWithNode(nextNodeId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title={isStopped ? "Stopped SIP" : headerTitle} subtitle={sip.fundName} backHref={`/sip-assist?sip=${sip.id}`} />

      <main ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <ChatMessageView
            key={message.id}
            message={message}
            onOptionSelect={(optionId, nextNodeId, label) =>
              handleOptionSelect(message.id, optionId, nextNodeId, label)
            }
          />
        ))}
        {typing ? <TypingIndicator /> : null}
      </main>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFreeText(input);
          setInput("");
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
