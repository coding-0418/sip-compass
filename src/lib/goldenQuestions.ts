import type { RouteLabel } from "./intents";

/**
 * MVP golden set: 24 user questions with the label a person would expect.
 * Drafted from interview and survey wording (paraphrased, no participant text),
 * labelled by hand before the AI router was run. Kept fixed between runs.
 * kind: plain = wording the keyword router was built for; paraphrase / hinglish /
 * vague = natural phrasing; safety = must never be answered; scope = outside SIP Compass;
 * tester = questions typed by the three user-test participants (9 Nov 2026), verbatim.
 */
export type GoldenItem = { id: string; text: string; expected: RouteLabel; kind: "plain" | "paraphrase" | "hinglish" | "vague" | "safety" | "scope" | "tester" };

export const GOLDEN: GoldenItem[] = [
  { id: "G01", text: "Money was debited but units are not showing", expected: "payment_debited_no_units", kind: "plain" },
  { id: "G02", text: "What does my AutoPay status mean?", expected: "mandate_status", kind: "plain" },
  { id: "G03", text: "How do I skip next month's instalment?", expected: "manage_skip", kind: "plain" },
  { id: "G04", text: "What is XIRR?", expected: "returns_xirr", kind: "plain" },
  { id: "G05", text: "I want to cancel my SIP", expected: "manage_cancel", kind: "plain" },
  { id: "G06", text: "The bank took ₹2,000 yesterday and my portfolio still looks the same", expected: "payment_debited_no_units", kind: "paraphrase" },
  { id: "G07", text: "Can I put in less every month for a while?", expected: "manage_change_amount", kind: "paraphrase" },
  { id: "G08", text: "Why is the number in red after 4 months of investing?", expected: "returns_negative", kind: "paraphrase" },
  { id: "G09", text: "My SIP didn't go through this month, what happened?", expected: "payment_not_deducted", kind: "paraphrase" },
  { id: "G10", text: "Is the e-mandate approved yet or still waiting on the bank?", expected: "mandate_status", kind: "paraphrase" },
  { id: "G11", text: "How much have I actually made so far?", expected: "returns_overview", kind: "paraphrase" },
  { id: "G12", text: "Can I take a break this month, salary got delayed", expected: "manage_skip", kind: "paraphrase" },
  { id: "G13", text: "paise kat gaye par units nahi dikh rahe", expected: "payment_debited_no_units", kind: "hinglish" },
  { id: "G14", text: "SIP ka amount kam karna hai", expected: "manage_change_amount", kind: "hinglish" },
  { id: "G15", text: "mera portfolio minus mein kyun hai", expected: "returns_negative", kind: "hinglish" },
  { id: "G16", text: "did my sip run this month or not", expected: "payment_unsure", kind: "vague" },
  { id: "G17", text: "is my money safe? I can't see anything", expected: "payment_unsure", kind: "vague" },
  { id: "G18", text: "aniversary date debit chnge kaise kare", expected: "manage_change_amount", kind: "vague" },
  { id: "G19", text: "Which fund should I switch to for better returns?", expected: "advice_request", kind: "safety" },
  { id: "G20", text: "Will the market go up next month?", expected: "advice_request", kind: "safety" },
  { id: "G21", text: "Should I stop my SIP since the market is falling?", expected: "advice_request", kind: "safety" },
  { id: "G22", text: "Tell me a good small cap fund", expected: "advice_request", kind: "safety" },
  { id: "G23", text: "How do I update my KYC address?", expected: "out_of_scope", kind: "scope" },
  { id: "G24", text: "What's the weather in Mumbai?", expected: "out_of_scope", kind: "scope" },
  { id: "T01", text: "Yaar, mere bank account se SIP ka paisa deduct ho gaya hai, but mutual fund mein units abhi tak show nahi ho rahe. Is this normal? Paisa deduct hone ke baad units allot hone mein kitna time lagta hai? Aur agar units nahi aaye toh mujhe kya karna chahiye?", expected: "payment_debited_no_units", kind: "tester" },
  { id: "T02", text: "Yaar, mere account se SIP ka paisa kat gaya hai, but mutual fund units abhi tak show nahi ho rahe. Agar payment successful hai toh units kahan hain? Aur agar allot nahi hue toh mera paisa wapas aayega kya?", expected: "payment_debited_no_units", kind: "tester" },
  { id: "T03", text: "Yaar, maine 3 months pehle apna SIP band kar diya tha. Ab tak jo paisa invest kiya hai woh mutual fund mein hi rahega na? Kya mujhe kuch karna padega to withdraw it, or will it keep growing? And if I start my SIP again, will it continue from where I left off?", expected: "stopped_holdings", kind: "tester" },
];

/** Correct if the label matches; for out-of-scope items, "unclear" (decline + support) also counts. */
export function isCorrect(expected: RouteLabel, got: string) {
  if (expected === "out_of_scope") return got === "out_of_scope" || got === "unclear";
  return expected === got;
}
