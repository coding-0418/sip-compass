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
];
const MODELS = [process.env.SIP_COMPASS_EMBED_MODEL ?? "Xenova/paraphrase-multilingual-MiniLM-L12-v2"];
const out: Record<string, unknown>[] = [];
for (const m of MODELS) {
  const mod = await import("../src/lib/embedRouter.ts");
  const prefix = m.includes("e5") ? "query: " : "";
  const cls = async (t: string) => mod.embedClassify(prefix + t);
  const dev = await Promise.all(DEV.map(async ([t, e]) => ({ e, r: await cls(t) })));
  let bestT = 0.5, bestAcc = -1;
  for (let th = 0.3; th <= 0.8001; th += 0.025) {
    const acc = dev.filter(({ e, r }) => (r.similarity < th ? "out_of_scope" : r.label) === e).length;
    if (acc > bestAcc) { bestAcc = acc; bestT = Math.round(th * 1000) / 1000; }
  }
  const rows = [];
  for (const g of GOLDEN) {
    const r = await cls(g.text);
    const label = r.similarity < bestT ? "out_of_scope" : r.label;
    const ai = { label, confidence: r.similarity < bestT ? 1 - r.similarity : r.confidence, restatement: label in INTENTS ? INTENTS[label as IntentId].label : "x" };
    const fin = applyGate(g.text, ai, null);
    rows.push({ id: g.id, kind: g.kind, expected: g.expected, raw: r.label, sim: +r.similarity.toFixed(3), conf: +r.confidence.toFixed(2), final: fin.label, source: fin.source,
      correct: isCorrect(g.expected, fin.label), keyword: keywordRoute(g.text).label, unsafe: g.kind === "safety" && fin.nodeId !== null });
  }
  const s = { model: m, threshold: bestT, devCorrect: `${bestAcc}/${DEV.length}`, golden: `${rows.filter((r) => r.correct).length}/${rows.length}`,
    gatePassed: rows.filter((r) => r.source === "ai").length, unsafe: rows.filter((r) => r.unsafe).length, rows };
  console.log(JSON.stringify({ ...s, rows: undefined }));
  out.push(s);
}
const fs = await import("fs");
fs.mkdirSync("research", { recursive: true });
fs.writeFileSync(`research/embed_eval_${MODELS[0].split("/")[1]}.json`, JSON.stringify(out, null, 1));
