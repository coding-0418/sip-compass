import { PROTOTYPES } from "./prototypes";

/**
 * Key-free AI router: a multilingual sentence-embedding model (runs inside the
 * server function via ONNX) compares the question with labelled example
 * phrasings and returns the nearest label, a confidence and the runner-up.
 */
export const EMBED_MODEL = process.env.SIP_COMPASS_EMBED_MODEL ?? "Xenova/paraphrase-multilingual-MiniLM-L12-v2";

type Extractor = (texts: string[], opts: { pooling: "mean"; normalize: boolean }) => Promise<{ tolist(): number[][] }>;
let extractorPromise: Promise<Extractor> | null = null;
let protoCache: { label: string; vec: number[] }[] | null = null;

async function getExtractor(): Promise<Extractor> {
  if (!extractorPromise) {
    extractorPromise = (async () => {
      const { pipeline, env } = await import("@huggingface/transformers");
      env.cacheDir = "/tmp/hf-cache";
      env.allowLocalModels = false;
      return (await pipeline("feature-extraction", EMBED_MODEL, { dtype: "q8" })) as unknown as Extractor;
    })();
    extractorPromise.catch(() => {
      extractorPromise = null;
    });
  }
  return extractorPromise;
}

const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);

export type EmbedResult = { label: string; confidence: number; similarity: number; runnerUp: string; margin: number };

/** Softmax temperature for confidence; chosen on the dev set in scripts/eval-embed.mts, never on the golden set. */
export const TEMPERATURE = Number(process.env.SIP_COMPASS_TEMPERATURE ?? "0.05");

/** Long, multi-part questions are split into sentences; each is scored and the strongest match per label wins. */
export function segments(text: string): string[] {
  const t = text.slice(0, 600);
  const parts = t.split(/(?<=[?.!])\s+|\s+(?:aur|and also)\s+/i).map((x) => x.trim()).filter((x) => x.length > 8);
  return parts.length > 1 ? [t, ...parts] : [t];
}

/** Confidence = softmax over per-label best similarity, so it reflects how clearly one label wins. */
export async function embedClassify(text: string, temperature = TEMPERATURE): Promise<EmbedResult> {
  const ex = await getExtractor();
  if (!protoCache) {
    const entries = Object.entries(PROTOTYPES).flatMap(([label, list]) => list.map((t) => ({ label, t })));
    const vecs = (await ex(entries.map((e) => e.t), { pooling: "mean", normalize: true })).tolist();
    protoCache = entries.map((e, i) => ({ label: e.label, vec: vecs[i] }));
  }
  const qs = (await ex(segments(text), { pooling: "mean", normalize: true })).tolist();
  const best: Record<string, number> = {};
  for (const q of qs) for (const p of protoCache) best[p.label] = Math.max(best[p.label] ?? -1, dot(q, p.vec));
  const ranked = Object.entries(best).sort((a, b) => b[1] - a[1]);
  const exps = ranked.map(([, s]) => Math.exp((s - ranked[0][1]) / temperature));
  const z = exps.reduce((a, b) => a + b, 0);
  return { label: ranked[0][0], similarity: ranked[0][1], confidence: exps[0] / z, runnerUp: ranked[1][0], margin: ranked[0][1] - ranked[1][1] };
}
