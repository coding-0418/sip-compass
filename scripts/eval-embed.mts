/* Offline eval of the embedding router in CI (internet needed for model download).
   1) choose the out-of-scope threshold on a DEV set (not the golden set)
   2) report golden-set results at that threshold, per model. */
import { GOLDEN, isCorrect } from "../src/lib/goldenQuestions.ts";
import { keywordRoute, applyGate, INTENTS, type IntentId } from "../src/lib/intents.ts";

const DEV: [string, string][] = [
  ["How do I open a demat account?", "out_of_scope"], ["IPO allotment status kab aayega", "out_of_scope"], ["forgot my login PIN", "out_of_scope"],
  ["What is the share price of Reliance today?", "out_of_scope"], ["how to add nominee", "out_of_scope"], ["F&O margin kitna lagega", "out_of_scope"],
  ["Tell me a joke", "out_of_scope"], ["update my email address", "out_of_scope"],
  ["units still not credited after my SIP debit", "payment_debited_no_units"], ["SIP failed because of low balance?", "payment_not_deducted"],
  ["autopay setup pending since a week", "mandate_status"], ["want to make my SIP smaller for now", "manage_change_amount"],
  ["skip this month please", "manage_skip"], ["I want to end the SIP", "manage_cancel"], ["XIRR samjhao", "returns_xirr"],
  ["value is less than what I put in", "returns_negative"], ["after stopping, is the money still invested", "stopped_holdings"],
  ["best fund to buy now?", "advice_request"],
  ["Mere account se 1000 rupaye kat gaye. Portfolio mein kuch nahi dikh raha. Kya karu?", "payment_debited_no_units"],
  ["I paid on the 5th. It is the 9th now. Still no units. Is something wrong? Who do I call?", "payment_debited_no_units"],
  ["autopay approve nahi hua, SIP kaise chalega", "mandate_status"],
  ["Is baar thoda tight hai, ek mahina chhod sakte hain kya", "manage_skip"],
  ["Mujhe SIP 500 kam karna hai. Possible hai?", "manage_change_amount"],
  ["I closed my SIP last month. Is my money gone? Do I need to sell anything?", "stopped_holdings"],
  ["SIP firse start karu to purane units ka kya hoga", "stopped_restart"],
  ["Mera return negative kyun hai jab market upar hai", "returns_negative"],
  ["Should I keep going with my SIP or stop it now?", "advice_request"],
  ["Which is better, index fund or flexi cap?", "advice_request"],
  ["How do I download my capital gains statement?", "out_of_scope"],
  ["Mera KYC reject ho gaya", "out_of_scope"],
];
const MODELS = [process.env.SIP_COMPASS_EMBED_MODEL ?? "Xenova/paraphrase-multilingual-MiniLM-L12-v2"];
const out: Record<string, unknown>[] = [];
for (const m of MODELS) {
  const mod = await import("../src/lib/embedRouter.ts");
  const prefix = m.includes("e5") ? "query: " : "";
  const temps = [0.01, 0.02, 0.03, 0.05, 0.08];
  let bestT = 0.5, bestAcc = -1, bestTemp = 0.05;
  for (const temp of temps) {
    const dev = await Promise.all(DEV.map(async ([t, e]) => ({ t, e, r: await mod.embedClassify(prefix + t, temp) })));
    for (let th = 0.3; th <= 0.8001; th += 0.025) {
      const acc = dev.filter(({ t, e, r }) => {
        const label = r.similarity < th ? "out_of_scope" : r.label;
        const fin = applyGate(t, { label, confidence: r.similarity < th ? 1 - r.similarity : r.confidence, restatement: "x" }, null);
        return fin.label === e || (e === "out_of_scope" && fin.label === "unclear");
      }).length;
      if (acc > bestAcc) { bestAcc = acc; bestT = Math.round(th * 1000) / 1000; bestTemp = temp; }
    }
  }
  const cls2 = async (t: string) => mod.embedClassify(prefix + t, bestTemp);
  const rows = [];
  for (const g of GOLDEN) {
    const r = await cls2(g.text);
    const label = r.similarity < bestT ? "out_of_scope" : r.label;
    const ai = { label, confidence: r.similarity < bestT ? 1 - r.similarity : r.confidence, restatement: label in INTENTS ? INTENTS[label as IntentId].label : "x" };
    const fin = applyGate(g.text, ai, null);
    rows.push({ id: g.id, kind: g.kind, expected: g.expected, raw: r.label, sim: +r.similarity.toFixed(3), conf: +r.confidence.toFixed(2), final: fin.label, source: fin.source,
      correct: isCorrect(g.expected, fin.label), keyword: keywordRoute(g.text).label, unsafe: g.kind === "safety" && fin.nodeId !== null });
  }
  const s = { model: m, threshold: bestT, temperature: bestTemp, devCorrect: `${bestAcc}/${DEV.length}`, golden: `${rows.filter((r) => r.correct).length}/${rows.length}`,
    gatePassed: rows.filter((r) => r.source === "ai").length, unsafe: rows.filter((r) => r.unsafe).length, rows };
  console.log(JSON.stringify({ ...s, rows: undefined }));
  out.push(s);
}
const fs = await import("fs");
fs.mkdirSync("research", { recursive: true });
fs.writeFileSync(`research/embed_eval_${MODELS[0].split("/")[1]}.json`, JSON.stringify(out, null, 1));
