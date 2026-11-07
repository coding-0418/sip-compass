import type { ConversationNode, Topic } from "./types";

export const FALLBACK_TEXT =
  "I don't have enough verified information to answer that confidently. You can check the relevant Groww help section or contact support.";

export const RESTRICTED_TEXT =
  "I can't recommend specific mutual funds, stocks, or predict market returns — that's outside what SIP Assist is here for. For fund research and performance data, you can explore the Mutual Funds section in the Groww app.";

export const topicEntryNode: Record<Topic, string> = {
  payment: "payment-start",
  mandate: "mandate-info",
  manage: "manage-start",
  understand: "understand-info",
};

export const topicOpeningMessage: Record<Topic, string> = {
  payment: "My SIP payment failed. What should I do?",
  mandate: "Help me understand my mandate status.",
  manage: "I want to manage my SIP. What are my options?",
  understand: "Help me understand my investment returns.",
};

export const nodes: Record<string, ConversationNode> = {
  "payment-start": {
    id: "payment-start",
    assistantText: [
      "Let's understand what happened.",
      "A failed SIP instalment can have different causes. Which situation describes yours?",
    ],
    options: [
      { id: "opt-a", label: "Money was not deducted", nextNodeId: "payment-case-a" },
      {
        id: "opt-b",
        label: "Money was deducted, but the investment isn't showing",
        nextNodeId: "payment-case-b",
      },
      {
        id: "opt-c",
        label: "My AutoPay mandate is pending or rejected",
        nextNodeId: "payment-case-c",
      },
      { id: "opt-d", label: "I'm not sure", nextNodeId: "payment-case-d" },
    ],
  },
  "payment-case-a": {
    id: "payment-case-a",
    verified: true,
    assistantText: [
      "If the money wasn't deducted, a few things can usually explain it: insufficient balance in your linked bank account, an AutoPay mandate that isn't active yet, a temporary issue on your bank's end, or another payment-related failure at the time of debit.",
    ],
    suggestedActions: [
      { id: "sa-1", label: "View pending SIP payments", description: "Check the status of this instalment", href: "/help/pending-payments" },
      { id: "sa-2", label: "Understand why SIP instalments fail", description: "Common reasons, explained", href: "/help/instalment-failures" },
      { id: "sa-3", label: "Contact Groww support", description: "Get help from the support team", href: "/help/contact-support" },
    ],
  },
  "payment-case-b": {
    id: "payment-case-b",
    verified: true,
    assistantText: [
      "This usually happens because your bank's debit confirmation and your mutual fund order update don't always land at the same time.",
    ],
    infoCard: {
      body:
        "Bank debit and mutual fund order status may not update at the same time. Let's verify the transaction before suggesting another payment.",
      tone: "warning",
    },
    suggestedActions: [
      { id: "sa-4", label: "View transaction status", description: "See the latest status from your bank and Groww", href: "/help/transaction-status" },
      { id: "sa-5", label: "Understand order processing", description: "How a SIP order moves from debit to allotment", href: "/help/order-processing" },
      {
        id: "sa-6",
        label: "Contact Groww support if the issue remains unresolved",
        description: "Get help from the support team",
        href: "/help/contact-support",
      },
    ],
  },
  "payment-case-c": {
    id: "payment-case-c",
    verified: true,
    assistantText: [
      "It helps to separate two things here: mandate approval is your bank's one-time permission for Groww to debit your account automatically, while instalment execution is the actual monthly payment itself.",
      "A pending or rejected mandate means an instalment can't be processed yet — even if everything else on your SIP looks fine.",
    ],
    suggestedActions: [
      { id: "sa-7", label: "Understand AutoPay status", description: "What pending, approved and rejected mean", href: "/help/autopay-status" },
      { id: "sa-8", label: "View mandate-related help", description: "Step-by-step mandate guidance", href: "/help/mandate-help" },
      { id: "sa-9", label: "Contact support", description: "Get help from the support team", href: "/help/contact-support" },
    ],
  },
  "payment-case-d": {
    id: "payment-case-d",
    assistantText: [
      "No problem — let's narrow it down one step at a time.",
      "Did you notice a debit entry or a notification from your bank around the instalment date?",
    ],
    options: [
      { id: "opt-d1", label: "Yes, there was a debit", nextNodeId: "payment-case-b" },
      { id: "opt-d2", label: "No debit that I noticed", nextNodeId: "payment-case-a" },
      { id: "opt-d3", label: "I'm not sure about my mandate approval", nextNodeId: "payment-case-c" },
    ],
  },
  "mandate-info": {
    id: "mandate-info",
    verified: true,
    assistantText: [
      "Your AutoPay mandate is your bank's approval that lets Groww debit your account automatically for your SIP.",
      "Mandate approval and SIP instalment execution are two separate steps — a mandate can be approved, pending or rejected independently of whether a specific instalment has gone through.",
    ],
    suggestedActions: [
      { id: "sa-10", label: "Understand AutoPay status", description: "What pending, approved and rejected mean", href: "/help/autopay-status" },
      { id: "sa-11", label: "View mandate-related help", description: "Step-by-step mandate guidance", href: "/help/mandate-help" },
      { id: "sa-12", label: "Contact support", description: "Get help from the support team", href: "/help/contact-support" },
    ],
  },
  "manage-start": {
    id: "manage-start",
    assistantText: ["Manage your SIP", "Here are the options available for your SIP."],
    infoCard: {
      title: "Before you proceed",
      body:
        "Your available actions and processing timelines can depend on your mandate type and your next instalment date.",
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
      "Changes usually apply from the next eligible instalment cycle, depending on your mandate type.",
    ],
    suggestedActions: [
      {
        id: "sa-13",
        label: "Go to SIP details",
        description: "Edit amount, date or frequency",
        tag: "Existing Groww functionality",
        href: "/sip-details",
      },
    ],
  },
  "manage-skip": {
    id: "manage-skip",
    verified: true,
    assistantText: [
      "You can skip an upcoming instalment without cancelling your SIP.",
      "The change takes effect from the next instalment that hasn't been processed yet — one that's already in progress can't be skipped.",
    ],
    suggestedActions: [
      {
        id: "sa-14",
        label: "View upcoming instalments",
        description: "See which one is still eligible to skip",
        tag: "Existing Groww functionality",
        href: "/help/upcoming-instalments",
      },
    ],
  },
  "manage-cancel": {
    id: "manage-cancel",
    verified: true,
    assistantText: [
      "Stopping a SIP only pauses future instalments — it doesn't redeem your existing investment.",
      "If you want to withdraw your money, that's a separate action called redemption, done from your holdings.",
    ],
    suggestedActions: [
      { id: "sa-15", label: "Learn about stopping a SIP", description: "What happens to future instalments", href: "/help/stopping-sip" },
      { id: "sa-16", label: "Learn about redemption", description: "How to withdraw existing units", href: "/help/redemption" },
    ],
  },
  "understand-info": {
    id: "understand-info",
    verified: true,
    assistantText: [
      "Here's a simple way to read your SIP numbers: invested amount is the total you've put in so far, current value reflects today's market price of your units, and returns are simply the difference between the two.",
      "Returns move up and down with the market — that's normal for mutual funds. I can't predict future returns or tell you whether to keep investing; that depends on your own goals and risk appetite.",
    ],
    suggestedActions: [
      { id: "sa-17", label: "View portfolio returns", description: "See your current invested amount and value", href: "/portfolio" },
      { id: "sa-18", label: "Understand SIP terminology", description: "Glossary of common terms", href: "/help/sip-terminology" },
    ],
  },
};

const topicKeywords: Record<Topic, string[]> = {
  payment: [
    "payment failed",
    "sip failed",
    "instalment failed",
    "installment failed",
    "money deducted",
    "not deducted",
    "payment fail",
    "debit fail",
    "autopay fail",
    "failed sip",
    "deduction",
  ],
  mandate: ["mandate", "autopay status", "approval pending", "e-mandate", "emandate"],
  manage: [
    "manage my sip",
    "manage sip",
    "skip instalment",
    "skip installment",
    "change amount",
    "change date",
    "cancel sip",
    "stop sip",
    "edit sip",
    "pause sip",
  ],
  understand: [
    "returns",
    "invested amount",
    "current value",
    "terminology",
    "understand my investment",
    "how much have i earned",
    "profit",
    "loss",
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

export function matchMessage(raw: string): { restricted: boolean; topic: Topic | null } {
  const text = raw.toLowerCase();

  if (restrictedKeywords.some((kw) => text.includes(kw))) {
    return { restricted: true, topic: null };
  }

  for (const topic of Object.keys(topicKeywords) as Topic[]) {
    if (topicKeywords[topic].some((kw) => text.includes(kw))) {
      return { restricted: false, topic };
    }
  }

  return { restricted: false, topic: null };
}
