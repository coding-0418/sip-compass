import { activeSip } from "./data";

export type HelpContent =
  | { type: "article"; title: string; intro?: string; paragraphs?: string[]; bullets?: string[] }
  | { type: "list"; title: string; intro?: string; items: { label: string; caption?: string; badge?: string }[] }
  | { type: "status"; title: string; intro?: string; steps: { label: string; caption?: string; done: boolean }[] };

const latest = activeSip.recentInstalments[activeSip.recentInstalments.length - 1];

export const helpContent: Record<string, HelpContent> = {
  "instalment-failures": {
    type: "article",
    title: "Why SIP instalments fail",
    intro: "A failed instalment almost always comes down to one of these:",
    bullets: [
      "Insufficient balance in your linked bank account on the debit date",
      "An AutoPay mandate that isn't active yet, or has expired",
      "A temporary issue on your bank's end during processing",
      "The bank's daily auto-debit limit being reached",
    ],
    paragraphs: [
      "Most failures resolve on their own by the next cycle once the underlying issue is fixed — you don't need to start a new SIP.",
    ],
  },
  "order-processing": {
    type: "article",
    title: "How a SIP order is processed",
    paragraphs: [
      "When your instalment date arrives, Groww raises a debit request against your bank account through your AutoPay mandate.",
      "Once the bank confirms the debit, the money is used to purchase units at the fund's applicable NAV — this allotment can take a day or two, especially around weekends and holidays.",
      "Your bank statement and your Groww order status update independently, so a debit showing in your bank app doesn't always mean the fund units have been allotted yet.",
    ],
  },
  "autopay-status": {
    type: "article",
    title: "Understanding AutoPay status",
    intro: "Your mandate can be in one of three states:",
    bullets: [
      "Approved — your bank has authorised Groww to auto-debit instalments",
      "Pending — your bank hasn't confirmed the mandate yet, usually within 1–2 working days",
      "Rejected — your bank declined the mandate; you'll need to set up a new one",
    ],
  },
  "mandate-help": {
    type: "article",
    title: "Mandate-related help",
    bullets: [
      "A mandate is a one-time authorisation, not a per-instalment approval",
      "It can be set up via net banking, debit card, or UPI AutoPay",
      "If rejected, you can retry mandate registration from your SIP details",
      "A pending mandate doesn't fail your SIP — it just delays the next debit",
    ],
  },
  "stopping-sip": {
    type: "article",
    title: "Stopping a SIP",
    paragraphs: [
      "Stopping a SIP cancels all future instalments from the next eligible date — it does not touch the units you already hold.",
      "Your existing investment continues to stay invested and keeps growing or shrinking with the market, exactly as before.",
    ],
  },
  redemption: {
    type: "article",
    title: "Understanding redemption",
    paragraphs: [
      "Redemption is the separate step of selling your existing mutual fund units to withdraw money.",
      "You can redeem fully or partially from your holdings at any time, subject to any exit load or lock-in the specific fund may have.",
      "Stopping future SIP instalments and redeeming existing units are independent actions — doing one doesn't automatically do the other.",
    ],
  },
  "sip-terminology": {
    type: "list",
    title: "SIP terminology",
    intro: "A few terms that come up often:",
    items: [
      { label: "Invested amount", caption: "The total of all instalments you've paid in so far" },
      { label: "Current value", caption: "What your units are worth today, at the latest NAV" },
      { label: "Returns", caption: "The difference between current value and invested amount" },
      { label: "NAV", caption: "Net Asset Value — the price of one unit of the fund" },
      { label: "Units", caption: "The quantity of the fund you own, credited after each instalment" },
      { label: "Mandate", caption: "Your bank's authorisation for Groww to auto-debit instalments" },
    ],
  },
  "transaction-status": {
    type: "status",
    title: "Transaction status",
    intro: `Latest instalment — ${latest.date}`,
    steps: [
      { label: "Debit initiated", caption: "Request sent to your bank", done: true },
      { label: "Debit confirmed", caption: `Bank confirmed the deduction on ${latest.date}`, done: true },
      { label: "Units allotted", caption: "Awaiting NAV allotment from the fund house", done: latest.status === "Allotted" },
    ],
  },
  "pending-payments": {
    type: "list",
    title: "Pending SIP payments",
    items:
      latest.status === "Processing" || latest.status === "Failed"
        ? [
            {
              label: activeSip.fundName,
              caption: `₹${latest.amount.toLocaleString("en-IN")} · Instalment of ${latest.date}`,
              badge: latest.status,
            },
          ]
        : [],
  },
  "upcoming-instalments": {
    type: "list",
    title: "Upcoming instalments",
    items: activeSip.nextInstalmentDate
      ? [
          {
            label: activeSip.fundName,
            caption: `₹${activeSip.monthlyAmount.toLocaleString("en-IN")} · ${activeSip.nextInstalmentDate}`,
            badge: "Eligible to skip",
          },
        ]
      : [],
  },
};
