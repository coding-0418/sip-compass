import type { ConversationNode, SIP, StopReason, Topic } from "./types";

export const FALLBACK_TEXT =
  "I don't have verified information about this transaction yet. Please check your order status or contact Groww Support.";

export const RESTRICTED_TEXT =
  "I can't recommend specific mutual funds, stocks, or predict market returns — that's outside what SIP Compass is here for. For fund research and performance data, you can explore the Mutual Funds section in the Groww app.";

export const topicEntryNode: Record<Topic, string> = {
  payment: "payment-start",
  mandate: "mandate-info",
  manage: "manage-start",
  understand: "understand-info",
};

export const topicOpeningMessage: Record<Topic, string> = {
  payment: "My money was debited yesterday, but my units aren't showing yet. Is that normal?",
  mandate: "What does my AutoPay status actually mean?",
  manage: "I want to manage my SIP. What are my options?",
  understand: "Help me understand my investment returns.",
};

function monthYearOf(dateStr: string) {
  const parts = dateStr.split(" ");
  return `${parts[1]} ${parts[2]}`;
}

function latestInstalment(sip: SIP) {
  return sip.recentInstalments[sip.recentInstalments.length - 1];
}

function fmtMoney(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

/** Builds the full node map for a SIP whose status is Active/Paused — i.e. the payment/mandate/manage/understand journeys. */
export function buildActiveNodes(sip: SIP): Record<string, ConversationNode> {
  const latest = latestInstalment(sip);
  const latestMonth = monthYearOf(latest.date);
  const absReturn = sip.currentValue - sip.totalInvested;
  const returnPct = ((absReturn / sip.totalInvested) * 100).toFixed(1);
  const detailsHref = `/sip-details/${sip.id}`;

  const mandateVerified = sip.autopayStatus === "Approved";
  const latestIsProcessingOrFailed = latest.status === "Processing" || latest.status === "Failed";

  const nodes: Record<string, ConversationNode> = {
    "payment-start": {
      id: "payment-start",
      assistantText: [
        "Let's check your instalment before you take another action.",
        "Which situation describes what you're seeing?",
      ],
      options: [
        { id: "opt-a", label: "Money was not deducted", nextNodeId: "payment-case-not-deducted" },
        {
          id: "opt-b",
          label: "Money was deducted, but units aren't showing",
          nextNodeId: "payment-case-processing",
        },
        { id: "opt-c", label: "My AutoPay mandate is pending or rejected", nextNodeId: "payment-case-mandate" },
        { id: "opt-d", label: "I'm not sure", nextNodeId: "payment-case-unsure" },
      ],
    },
    "payment-case-processing": {
      id: "payment-case-processing",
      structured: {
        whatHappened: `Your ${fmtMoney(latest.amount)} instalment for ${latestMonth} was debited on ${latest.date}.`,
        whatItMeans:
          "Bank debit and unit allotment are separate steps — the fund house allots units at the NAV of the applicable business day, so units can appear later than the debit, especially around weekends and holidays. Since a debit is already confirmed, there's no need to pay again for this instalment.",
        verifiedNote: latestIsProcessingOrFailed
          ? `Verified: debited on ${latest.date}, currently ${latest.status} — units not yet allotted.`
          : `Verified: your latest instalment (${latest.date}) was already allotted — no instalment is currently stuck in processing.`,
        isVerified: true,
        timeline: [
          { label: "Bank debit", caption: latest.date, done: true },
          { label: "Order processing", caption: "Fund house confirming the order", done: latest.status !== "Scheduled" },
          { label: "Units allotted", caption: "Awaiting NAV allotment", done: latest.status === "Allotted" },
        ],
        nextSteps: [
          { id: "sa-1", label: "View instalment details", description: "See this in your SIP details", href: detailsHref },
          { id: "sa-2", label: "Check order status", description: "Latest status from your bank and Groww", href: "/help/transaction-status" },
          { id: "sa-3", label: "Understand processing timelines", description: "How long allotment usually takes", href: "/help/order-processing" },
        ],
        supportNote: "Groww's help centre advises contacting Support if your latest instalment still isn't showing after more than a day.",
      },
    },
    "payment-case-not-deducted": {
      id: "payment-case-not-deducted",
      structured: {
        whatHappened: "You're asking about a payment that wasn't deducted at all.",
        whatItMeans:
          "This usually happens because of insufficient balance, an AutoPay mandate that isn't active, or a temporary issue on the bank's end.",
        verifiedNote: `Not verified for your SIP — your latest instalment (${latest.date}) shows as ${latest.status.toLowerCase()}, not missed.`,
        isVerified: false,
        nextSteps: [
          { id: "sa-4", label: "View pending SIP payments", description: "Check the status of your instalment", href: "/help/pending-payments" },
          { id: "sa-5", label: "Understand why SIP instalments fail", description: "Common reasons, explained", href: "/help/instalment-failures" },
          { id: "sa-6", label: "Contact Groww support", description: "Get help from a human", href: `/support?context=${encodeURIComponent("Payment not deducted — " + sip.fundName)}` },
        ],
      },
    },
    "payment-case-mandate": {
      id: "payment-case-mandate",
      structured: {
        whatHappened: "You're asking about a pending or rejected AutoPay mandate.",
        whatItMeans:
          "Mandate approval is your bank's one-time permission for Groww to auto-debit instalments. A pending or rejected mandate means instalments can't be processed until it's fixed, even if everything else looks fine.",
        verifiedNote: mandateVerified
          ? `Not verified for your SIP — your AutoPay mandate is Approved (since ${sip.mandateApprovedDate}), so this isn't affecting your instalments.`
          : `Verified: your AutoPay mandate is currently ${sip.autopayStatus}.`,
        isVerified: !mandateVerified,
        nextSteps: [
          { id: "sa-7", label: "Understand AutoPay status", description: "What pending, approved and rejected mean", href: "/help/autopay-status" },
          { id: "sa-8", label: "View mandate-related help", description: "Step-by-step mandate guidance", href: "/help/mandate-help" },
          { id: "sa-9", label: "Contact support", description: "Get help from a human", href: `/support?context=${encodeURIComponent("AutoPay mandate query — " + sip.fundName)}` },
        ],
      },
    },
    "payment-case-unsure": {
      id: "payment-case-unsure",
      assistantText: [
        "No problem — let's narrow it down one step at a time.",
        "Did you notice a debit entry or a bank notification around your instalment date?",
      ],
      options: [
        { id: "opt-d1", label: "Yes, there was a debit", nextNodeId: "payment-case-processing" },
        { id: "opt-d2", label: "No debit that I noticed", nextNodeId: "payment-case-not-deducted" },
        { id: "opt-d3", label: "I'm not sure about my mandate approval", nextNodeId: "payment-case-mandate" },
      ],
    },
    "mandate-info": {
      id: "mandate-info",
      structured: {
        whatHappened: `Your AutoPay (mandate) is currently ${sip.autopayStatus}.`,
        whatItMeans:
          "AutoPay (mandate) is a one-time permission you give your bank so Groww can auto-debit each instalment — it's separate from any single instalment actually going through.",
        verifiedNote: `Verified: approved on ${sip.mandateApprovedDate} for ${sip.bankAccountMasked}.`,
        isVerified: true,
        nextSteps: [
          { id: "sa-10", label: "Understand AutoPay status", description: "What pending, approved and rejected mean", href: "/help/autopay-status" },
          { id: "sa-11", label: "View mandate-related help", description: "Step-by-step mandate guidance", href: "/help/mandate-help" },
          { id: "sa-12", label: "Contact support", description: "Get help from a human", href: `/support?context=${encodeURIComponent("AutoPay mandate — " + sip.fundName)}` },
        ],
      },
    },
    "manage-start": {
      id: "manage-start",
      assistantText: ["Manage your SIP", "Here are the options available for your SIP."],
      infoCard: {
        title: "Before you proceed",
        body: "Your available actions and timelines can depend on your mandate type and your next instalment date.",
        tone: "warning",
      },
      options: [
        { id: "opt-m1", label: "Change amount or date", nextNodeId: "manage-change" },
        { id: "opt-m2", label: "Skip an instalment", nextNodeId: "manage-skip" },
        { id: "opt-m3", label: "Understand cancellation", nextNodeId: "manage-cancel" },
      ],
    },
    "manage-change": {
      id: "manage-change",
      verified: true,
      assistantText: [
        "You can update your SIP amount or monthly instalment date from your SIP details page.",
        "Changes usually apply from the next eligible cycle — that's your " +
          (sip.nextInstalmentDate ?? "upcoming") +
          " instalment.",
      ],
      suggestedActions: [
        { id: "sa-13", label: "Go to SIP details", description: "Edit amount, date or frequency", tag: "Existing Groww functionality", href: detailsHref },
      ],
    },
    "manage-skip": {
      id: "manage-skip",
      verified: true,
      assistantText: [
        "You can skip an upcoming instalment without cancelling your SIP.",
        sip.nextInstalmentDate
          ? `Your ${sip.nextInstalmentDate} instalment hasn't been processed yet, so it's eligible to skip.`
          : "An instalment that's already been debited can't be skipped.",
      ],
      suggestedActions: [
        { id: "sa-14", label: "View upcoming instalments", description: "See which one is still eligible to skip", tag: "Existing Groww functionality", href: "/help/upcoming-instalments" },
      ],
    },
    "manage-cancel": {
      id: "manage-cancel",
      verified: true,
      assistantText: [
        "Stopping a SIP only pauses future instalments — it doesn't redeem your existing investment.",
        "If you want to withdraw money, that's a separate action called redemption, done from your holdings.",
      ],
      suggestedActions: [
        { id: "sa-15", label: "Learn about stopping a SIP", description: "What happens to future instalments", href: "/help/stopping-sip" },
        { id: "sa-16", label: "Learn about redemption", description: "How to withdraw existing units", href: "/help/redemption" },
      ],
    },
    "understand-info": {
      id: "understand-info",
      structured: {
        whatHappened: "Here's where your SIP stands financially.",
        whatItMeans: `You've invested ${fmtMoney(sip.totalInvested)}; current value is ${fmtMoney(sip.currentValue)} (${absReturn >= 0 ? "+" : ""}${fmtMoney(absReturn)}, ${absReturn >= 0 ? "+" : ""}${returnPct}%). XIRR is ${sip.xirrPct.toFixed(1)}% — it annualises your return so instalments made at different times are comparable.`,
        verifiedNote: `Verified: figures as of your latest allotted instalment (${sip.previousInstalmentDate ?? latest.date}), ${sip.unitsHeld} units held.`,
        isVerified: true,
        nextSteps: [
          { id: "sa-17", label: "View portfolio returns", description: "See your full holdings", href: "/portfolio" },
          { id: "sa-18", label: "Understand SIP terminology", description: "Glossary of common terms", href: "/help/sip-terminology" },
        ],
      },
      options: [
        { id: "opt-u1", label: "What does XIRR mean?", nextNodeId: "understand-xirr" },
        { id: "opt-u2", label: "Why might returns be negative?", nextNodeId: "understand-negative" },
      ],
    },
    "understand-xirr": {
      id: "understand-xirr",
      assistantText: [
        "XIRR (Extended Internal Rate of Return) annualises your return across instalments made at different times, so your first instalment — invested longer — is weighted differently from your most recent one.",
        `Your current XIRR is ${sip.xirrPct.toFixed(1)}%. It differs from your simple absolute-return percentage because XIRR adjusts for time, not just amount.`,
      ],
      suggestedActions: [
        { id: "sa-19", label: "Understand SIP terminology", description: "More terms explained", href: "/help/sip-terminology" },
      ],
    },
    "understand-negative": {
      id: "understand-negative",
      structured: {
        whatHappened: `You've invested ${fmtMoney(sip.totalInvested)}; current value is ${fmtMoney(sip.currentValue)} (${absReturn >= 0 ? "+" : ""}${fmtMoney(absReturn)}, ${absReturn >= 0 ? "+" : ""}${returnPct}%), with an XIRR of ${sip.xirrPct.toFixed(1)}%.`,
        whatItMeans:
          "In general, mutual fund values move with the market, so a negative return at any point in time is normal and doesn't by itself mean something is wrong — it simply means the market value of your units is below what's been invested so far, which can change as markets move. I can't predict where returns will go next, and I won't tell you whether to continue or stop investing — that depends on your own goals and horizon.",
        verifiedNote:
          absReturn >= 0
            ? `Verified: your returns are currently positive (${returnPct}%), as of your latest allotted instalment (${sip.previousInstalmentDate ?? latest.date}).`
            : `Verified: your returns are currently negative (${returnPct}%), as of your latest allotted instalment (${sip.previousInstalmentDate ?? latest.date}).`,
        isVerified: true,
        nextSteps: [
          { id: "sa-20", label: "View portfolio returns", description: "See your full holdings", href: "/portfolio" },
          { id: "sa-21", label: "Understand SIP terminology", description: "Glossary of common terms", href: "/help/sip-terminology" },
        ],
      },
    },
  };

  return nodes;
}

// Single-word / short-phrase triggers, matched against individual words in the message
// (not raw substrings) so natural phrasing like "skip my next instalment" or
// "why did my sip fail" still routes correctly — a plain .includes(phrase) check
// missed both of those in testing.
// Checked in this order: an action verb like "skip" or "edit" is a more specific
// signal of intent than a generic word like "instalment", which shows up in
// almost every SIP question regardless of topic — so manage/mandate are
// checked before the broader payment list.
const topicKeywords: Record<Topic, string[]> = {
  manage: ["manage", "skip", "edit", "cancel", "pause", "stop"],
  mandate: ["mandate", "autopay"],
  payment: [
    "fail",
    "failed",
    "failing",
    "debit",
    "debited",
    "deduct",
    "deducted",
    "deduction",
    "units",
    "showing",
    "reflecting",
    "processing",
    "pending",
  ],
  understand: [
    "return",
    "returns",
    "invested",
    "value",
    "terminology",
    "profit",
    "loss",
    "xirr",
    "negative",
    "performance",
    "investment",
  ],
};

const restrictedKeywords = [
  "best fund",
  "which fund",
  "which mutual fund",
  "should i buy",
  "should i invest in",
  "recommend",
  "will the market",
  "market crash",
  "market will",
  "continue investing",
  "stock tip",
  "buy now",
  "sell now",
  "guaranteed return",
  "will i make money",
];

export function matchMessage(raw: string): { restricted: boolean; topic: Topic | null; nodeId?: string } {
  const text = raw.toLowerCase();

  if (restrictedKeywords.some((kw) => text.includes(kw))) {
    return { restricted: true, topic: null };
  }

  for (const topic of Object.keys(topicKeywords) as Topic[]) {
    if (topicKeywords[topic].some((kw) => text.includes(kw))) {
      // Route a couple of specific, unambiguous phrasings straight to the
      // relevant explanation instead of the generic topic overview.
      if (topic === "understand" && text.includes("xirr")) {
        return { restricted: false, topic, nodeId: "understand-xirr" };
      }
      if (topic === "understand" && text.includes("negative")) {
        return { restricted: false, topic, nodeId: "understand-negative" };
      }
      return { restricted: false, topic };
    }
  }

  return { restricted: false, topic: null };
}

// ---- Lapsed / stopped-SIP journey ----

export const stopReasons: { id: StopReason; label: string }[] = [
  { id: "failures", label: "Instalments were failing" },
  { id: "budget", label: "Monthly budget changed" },
  { id: "returns", label: "Concern about returns" },
  { id: "break", label: "Needed a break" },
  { id: "other", label: "Other reason" },
];

export function buildStoppedReasonNode(sip: SIP, reason: StopReason): ConversationNode {
  const detailsHref = `/sip-details/${sip.id}`;
  const supportHref = `/support?context=${encodeURIComponent(`Stopped SIP (${reason}) — ${sip.fundName}`)}`;

  const byReason: Record<StopReason, { text: string[]; actions: ConversationNode["suggestedActions"] }> = {
    failures: {
      text: [
        "That's a common reason — repeated failed instalments can happen when there's insufficient balance or an inactive mandate at the time.",
        "Your existing units are unaffected and still reflect today's market value.",
      ],
      actions: [
        { id: "r1", label: "Understand why SIP instalments fail", description: "Common reasons, explained", href: "/help/instalment-failures" },
        { id: "r2", label: "View instalment history", description: "See what happened before it stopped", href: detailsHref },
      ],
    },
    budget: {
      text: [
        "Totally reasonable — monthly budgets change.",
        "Your existing investment stays exactly as it is; nothing further happens unless you choose to act.",
      ],
      actions: [
        { id: "r3", label: "View your investment snapshot", description: "Current value of what you already hold", href: "/portfolio" },
      ],
    },
    returns: {
      text: [
        "That's a fair concern. Stopping a SIP doesn't change the units you already hold — they continue to reflect the market regardless of whether you're still investing.",
      ],
      actions: [
        { id: "r4", label: "View your investment snapshot", description: "Current value of what you already hold", href: "/portfolio" },
        { id: "r5", label: "Understand redemption", description: "How withdrawing existing units works", href: "/help/redemption" },
      ],
    },
    break: {
      text: ["Makes sense — taking a break doesn't affect the units you already hold."],
      actions: [
        { id: "r6", label: "View your investment snapshot", description: "Current value of what you already hold", href: "/portfolio" },
      ],
    },
    other: {
      text: ["No problem. You're always in control of your SIPs — here are a few things you might find useful."],
      actions: [
        { id: "r7", label: "View SIP details", description: "See the full history for this SIP", href: detailsHref },
        { id: "r8", label: "Understand redemption", description: "How withdrawing existing units works", href: "/help/redemption" },
      ],
    },
  };

  const content = byReason[reason];

  return {
    id: `stopped-${reason}`,
    assistantText: content.text,
    verified: true,
    suggestedActions: [...(content.actions ?? []), { id: "r-support", label: "Contact Groww support", description: "Talk to a human about this SIP", href: supportHref }],
  };
}

export const stoppedIntroNode = "stopped-intro";
export const stoppedIntroMessage = "I'd like to understand why my SIP was stopped.";

/** Builds the full node map for a stopped/lapsed SIP: an intro asking why, branching into neutral, non-pressuring guidance per reason. */
export function buildStoppedNodes(sip: SIP): Record<string, ConversationNode> {
  const nodes: Record<string, ConversationNode> = {
    [stoppedIntroNode]: {
      id: stoppedIntroNode,
      assistantText: ["Your SIP has been stopped.", "Would you like help understanding what happened?"],
      options: stopReasons.map((r) => ({ id: `opt-${r.id}`, label: r.label, nextNodeId: `stopped-${r.id}` })),
    },
  };

  for (const r of stopReasons) {
    nodes[`stopped-${r.id}`] = buildStoppedReasonNode(sip, r.id);
  }

  return nodes;
}
