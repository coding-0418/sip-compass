import type { RouteLabel } from "./intents";

/**
 * Example phrasings per label for the embedding router. Written from the intent
 * definitions, interview themes and public-review wording patterns — deliberately
 * NOT copied from the golden set, which is held out for evaluation.
 */
export const PROTOTYPES: Record<Exclude<RouteLabel, "out_of_scope">, string[]> = {
  payment_debited_no_units: [
    "amount deducted from my bank account but units not allotted yet",
    "SIP money got debited but I can't see it in my portfolio",
    "payment done but investment not reflecting in the app",
    "debited yesterday, order still processing, no units",
    "bank se paise cut ho gaye lekin units nahi aaye",
    "account se paisa gaya par investment show nahi ho raha",
    "where are my units, money already taken from account",
  ],
  payment_not_deducted: [
    "my SIP instalment failed this month",
    "instalment was not deducted from my bank",
    "SIP payment did not go through",
    "why did my monthly SIP fail",
    "is mahine ka SIP fail ho gaya",
    "SIP ka paisa kata hi nahi, failed dikha raha hai",
  ],
  mandate_status: [
    "what does AutoPay pending mean",
    "my e-mandate was rejected by the bank",
    "is my NACH mandate approved",
    "UPI autopay for SIP not set up",
    "autopay ka status kya hai, approve hua ya nahi",
    "mandate rejected kyun hua",
  ],
  payment_unsure: [
    "I don't know if my SIP happened this month",
    "how do I confirm my instalment went through",
    "did my monthly investment actually get invested",
    "I'm worried, I can't tell if my money is invested",
    "pata nahi is month SIP hua ya nahi",
    "mera paisa safe hai na, kuch dikh nahi raha",
  ],
  manage_change_amount: [
    "how do I increase my SIP amount",
    "I want to reduce my monthly SIP",
    "change the date my SIP gets debited",
    "lower the instalment amount for a few months",
    "SIP amount badhana hai",
    "SIP ki date change karni hai",
  ],
  manage_skip: [
    "skip next month's SIP instalment",
    "pause my SIP for one month",
    "I need a break from paying this month",
    "can I miss one instalment without cancelling",
    "is mahine SIP skip karna hai",
    "kuch mahine ke liye SIP rok sakte hain kya",
  ],
  manage_cancel: [
    "stop my SIP permanently",
    "how to cancel a SIP",
    "close this SIP, I don't want to continue",
    "end my systematic investment plan",
    "SIP band karna hai",
    "SIP cancel kaise kare",
  ],
  manage_overview: [
    "what options do I have to manage my SIP",
    "how can I modify my SIP",
    "SIP settings and controls",
    "SIP mein kya kya change kar sakte hain",
  ],
  returns_overview: [
    "what is my current value versus invested amount",
    "how much profit have I made on this SIP",
    "explain my returns",
    "what does invested amount and current value mean",
    "kitna return mila hai abhi tak",
    "mera total gain kitna hai",
  ],
  returns_xirr: [
    "what does XIRR mean",
    "why is XIRR different from absolute return",
    "annualised return on my SIP",
    "XIRR kya hota hai",
  ],
  returns_negative: [
    "my SIP is showing a loss",
    "why is my portfolio value below what I invested",
    "returns are negative after a few months",
    "the value went down, is something wrong",
    "portfolio loss mein kyun hai",
    "returns minus mein dikha rahe hain",
  ],
  stopped_holdings: [
    "I stopped my SIP, what happens to the money already invested",
    "after cancelling SIP is my money still in the fund",
    "does stopping a SIP mean my money is withdrawn",
    "will my old investment keep growing after I stop",
    "SIP band kar diya, ab paisa kahan hai",
    "SIP rok diya to jo invest kiya woh rahega kya",
  ],
  stopped_restart: [
    "how do I restart my stopped SIP",
    "can I resume the SIP I cancelled",
    "start SIP again where I left off",
    "SIP dobara shuru kaise kare",
  ],
  advice_request: [
    "which mutual fund should I buy",
    "suggest the best fund for high returns",
    "should I stop investing because the market is falling",
    "will the market go up or down",
    "is it a good time to invest more",
    "kaunsa fund best hai",
    "market girega kya, SIP band kar du",
    "recommend a stock or fund to switch to",
  ],
};
