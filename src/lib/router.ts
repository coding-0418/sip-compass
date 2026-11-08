import { generateText, Output, type LanguageModel } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import { INTENTS, INTENT_IDS, SPECIAL, applyGate, buildPrompt, type IntentId, type RouteResult } from "./intents";
import { EMBED_MODEL, embedClassify } from "./embedRouter";

/** Below this best-match similarity the question is treated as out of scope (set on a dev set, not the golden set). */
export const SIM_MIN = Number(process.env.SIP_COMPASS_SIM_MIN ?? "0.425");

// Groq (free key) if GROQ_API_KEY is set; otherwise Vercel AI Gateway.
const groqKey = process.env.GROQ_API_KEY;
const gatewayOn = !!process.env.AI_GATEWAY_API_KEY || process.env.SIP_COMPASS_USE_GATEWAY === "1";
export const MODEL = groqKey
  ? `groq/${process.env.SIP_COMPASS_MODEL ?? "llama-3.3-70b-versatile"}`
  : gatewayOn
    ? (process.env.SIP_COMPASS_MODEL ?? "openai/gpt-4o-mini")
    : `embedding/${EMBED_MODEL}`;
const model: LanguageModel = groqKey ? createGroq({ apiKey: groqKey })(MODEL.slice(5)) : MODEL;

const schema = z.object({
  label: z.enum([...INTENT_IDS, ...SPECIAL] as [string, ...string[]]),
  confidence: z.number().min(0).max(1),
  restatement: z.string().max(200),
});

/** AI routing + quality gate. Never throws: on any AI failure the gate falls back. */
export async function routeQuestion(text: string): Promise<RouteResult & { model: string; ms: number }> {
  const t0 = Date.now();
  let ai: z.infer<typeof schema> | null = null;
  let err: string | null = null;
  if (MODEL.startsWith("embedding/")) {
    try {
      const r = await embedClassify(text);
      const label = r.similarity < SIM_MIN ? "out_of_scope" : r.label;
      const restatement = label in INTENTS ? INTENTS[label as IntentId].label : label === "advice_request" ? "Asking for a fund or market view" : "Something outside SIP Compass";
      ai = { label, confidence: r.similarity < SIM_MIN ? 1 - r.similarity : r.confidence, restatement };
    } catch (e) {
      err = e instanceof Error ? e.message.slice(0, 160) : "embedding model failed";
    }
    return { ...applyGate(text, ai, err), model: MODEL, ms: Date.now() - t0 };
  }
  try {
    const res = await generateText({
      model,
      output: Output.object({ schema }),
      prompt: buildPrompt(text),
      temperature: 0,
      abortSignal: AbortSignal.timeout(8000),
    });
    ai = res.output;
  } catch (e) {
    err = e instanceof Error ? e.message.slice(0, 160) : "AI call failed";
  }
  return { ...applyGate(text, ai, err), model: MODEL, ms: Date.now() - t0 };
}
