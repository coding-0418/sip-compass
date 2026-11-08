import { generateText, Output, type LanguageModel } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { z } from "zod";
import { INTENT_IDS, SPECIAL, applyGate, buildPrompt, type RouteResult } from "./intents";

// Groq (free key) if GROQ_API_KEY is set; otherwise Vercel AI Gateway.
const groqKey = process.env.GROQ_API_KEY;
export const MODEL = groqKey
  ? `groq/${process.env.SIP_COMPASS_MODEL ?? "llama-3.3-70b-versatile"}`
  : (process.env.SIP_COMPASS_MODEL ?? "openai/gpt-4o-mini");
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
