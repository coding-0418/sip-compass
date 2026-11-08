import { matchMessage, topicEntryNode } from "./conversation";

/**
 * The closed set of things SIP Compass can answer. The AI may only pick one of
 * these ids — it never writes an answer, a number or a date itself. Every
 * answer shown to the user comes from a verified node built from the SIP record.
 */
export const INTENTS = {
  payment_debited_no_units: {
    nodeId: "payment-case-processing",
    label: "Money debited, units not showing yet",
    hint: "money/amount was deducted or debited from bank but units, NAV or investment not visible or reflecting yet; 'paise kat gaye'",
  },
  payment_not_deducted: {
    nodeId: "payment-case-not-deducted",
    label: "Instalment not deducted or failed",
    hint: "instalment failed, money was NOT deducted, payment did not go through, SIP missed",
  },
  mandate_status: {
    nodeId: "mandate-info",
    label: "AutoPay / mandate status",
    hint: "AutoPay, e-mandate, NACH, UPI mandate meaning, pending, approved or rejected",
  },
  payment_unsure: {
    nodeId: "payment-case-unsure",
    label: "Unsure whether this month's instalment went through",
    hint: "user doesn't know if the SIP ran this month, wants to confirm the instalment happened, is my money safe/invested",
  },
  manage_change_amount: {
    nodeId: "manage-change",
    label: "Change the SIP amount or date",
    hint: "increase, decrease, reduce, top-up, change amount or debit date",
  },
  manage_skip: {
    nodeId: "manage-skip",
    label: "Skip or pause an instalment",
    hint: "skip one instalment, pause for a while, short break because of cash flow",
  },
  manage_cancel: {
    nodeId: "manage-cancel",
    label: "Stop or cancel the SIP",
    hint: "stop, cancel, close, end the SIP permanently",
  },
  manage_overview: {
    nodeId: "manage-start",
    label: "Options to manage the SIP",
    hint: "general 'what can I do with my SIP', manage, modify options",
  },
  returns_overview: {
    nodeId: "understand-info",
    label: "Understand invested amount, current value and returns",
    hint: "what do invested, current value, returns, profit or gain on the SIP mean",
  },
  returns_xirr: {
    nodeId: "understand-xirr",
    label: "What XIRR means",
    hint: "XIRR, annualised return, why XIRR differs from absolute return",
  },
  returns_negative: {
    nodeId: "understand-negative",
    label: "Why value is below what I invested",
    hint: "value fell, negative returns, loss, red numbers, portfolio down",
  },
} as const;

export type IntentId = keyof typeof INTENTS;
export const INTENT_IDS = Object.keys(INTENTS) as [IntentId, ...IntentId[]];
/** Non-answerable classes the AI may also return. */
export const SPECIAL = ["advice_request", "out_of_scope"] as const;
export type RouteLabel = IntentId | (typeof SPECIAL)[number];

export const CONFIDENCE_THRESHOLD = 0.6;

export type GateCheck = { name: string; passed: boolean; detail: string };

export type RouteResult = {
  label: RouteLabel | "unclear";
  nodeId: string | null;
  source: "ai" | "keyword" | "none";
  confidence: number | null;
  restatement: string | null;
  gate: { passed: boolean; checks: GateCheck[] };
};

/** Keyword baseline (the pre-AI router) mapped onto the same labels — also the first fallback. */
export function keywordRoute(text: string): { label: RouteLabel | "unclear"; nodeId: string | null } {
  const { restricted, topic, nodeId } = matchMessage(text);
  if (restricted) return { label: "advice_request", nodeId: null };
  if (!topic) return { label: "unclear", nodeId: null };
  const target = nodeId ?? topicEntryNode[topic];
  const hit = (Object.keys(INTENTS) as IntentId[]).find((k) => INTENTS[k].nodeId === target);
  if (hit) return { label: hit, nodeId: target };
  // Topic entry screens that aren't a specific intent (e.g. payment-start)
  return { label: "unclear", nodeId: target };
}

const FIGURE = /[₹%]|\d/;
const BANNED = /\b(recommend|should (buy|sell|invest)|guarantee|will (rise|fall|go up|go down)|hurry|don'?t miss|last chance|urgent)\b/i;

/** The quality gate applied to every AI routing decision before anything is shown. */
export function applyGate(
  text: string,
  ai: { label: string; confidence: number; restatement: string } | null,
  aiError: string | null,
): RouteResult {
  const checks: GateCheck[] = [];
  const kw = keywordRoute(text);

  if (!ai) {
    checks.push({ name: "AI responded", passed: false, detail: aiError ?? "no response" });
  } else {
    checks.push({ name: "AI responded", passed: true, detail: "structured output received" });
    const valid = (INTENT_IDS as readonly string[]).includes(ai.label) || (SPECIAL as readonly string[]).includes(ai.label);
    checks.push({ name: "Label in allowed set", passed: valid, detail: ai.label });
    const confident = ai.confidence >= CONFIDENCE_THRESHOLD;
    checks.push({ name: `Confidence ≥ ${CONFIDENCE_THRESHOLD}`, passed: confident, detail: ai.confidence.toFixed(2) });
    // Safety override: if the deterministic advice filter fires, the AI can't route around it.
    const safetyAgrees = !(kw.label === "advice_request" && ai.label !== "advice_request");
    checks.push({ name: "Advice filter agrees", passed: safetyAgrees, detail: safetyAgrees ? "ok" : "keyword advice filter fired" });

    if (valid && confident && safetyAgrees) {
      const restatementSafe = !FIGURE.test(ai.restatement) && !BANNED.test(ai.restatement);
      checks.push({ name: "Restatement has no figures or advice", passed: restatementSafe, detail: restatementSafe ? "ok" : "dropped" });
      const label = ai.label as RouteLabel;
      const nodeId = (INTENT_IDS as readonly string[]).includes(label) ? INTENTS[label as IntentId].nodeId : null;
      return {
        label,
        nodeId,
        source: "ai",
        confidence: ai.confidence,
        restatement: restatementSafe ? ai.restatement : null,
        gate: { passed: true, checks },
      };
    }
  }

  // Fallback 1: keyword router. Fallback 2: say we're unsure and offer topics + a human.
  if (kw.label !== "unclear") {
    return { label: kw.label, nodeId: kw.nodeId, source: "keyword", confidence: ai?.confidence ?? null, restatement: null, gate: { passed: false, checks } };
  }
  return { label: "unclear", nodeId: null, source: "none", confidence: ai?.confidence ?? null, restatement: null, gate: { passed: false, checks } };
}

export function buildPrompt(text: string) {
  const list = (INTENT_IDS as readonly IntentId[]).map((k) => `- ${k}: ${INTENTS[k].label} (${INTENTS[k].hint})`).join("\n");
  return `You route questions from first-time mutual fund SIP investors in India to the one help topic that answers them.
Questions may be in English, Hindi, Hinglish or have typos.

Allowed labels:
${list}
- advice_request: asks which fund/stock to buy or sell, whether to continue or stop investing for returns, or to predict markets/returns
- out_of_scope: anything else (account login, KYC, tax, unrelated topics)

Rules:
- Pick exactly one label. If two fit, pick the more specific one.
- confidence: your probability (0 to 1) that the label is correct. Use below 0.6 when the question is ambiguous.
- restatement: one short neutral sentence (max 15 words) of what the user is asking, with NO numbers, amounts, dates or advice.

Question: """${text.slice(0, 500)}"""`;
}
