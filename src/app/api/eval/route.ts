import { GOLDEN, isCorrect } from "@/lib/goldenQuestions";
import { INTENTS, type IntentId } from "@/lib/intents";

const expectedNode = (l: string) => (l in INTENTS ? INTENTS[l as IntentId].nodeId : null);
import { keywordRoute } from "@/lib/intents";

const topicOf = (nodeId: string | null) => (nodeId ? nodeId.split("-")[0] : null);
import { routeQuestion, MODEL } from "@/lib/router";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Runs the golden set through (a) the keyword baseline and (b) AI + gate. GET /api/eval?run=1 */
export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("run") !== "1") {
    return Response.json({ info: "Add ?run=1 to run the 24-question golden set (≈24 model calls).", model: MODEL });
  }
  const rows = await Promise.all(
    GOLDEN.map(async (g) => {
      const kw = keywordRoute(g.text);
      const r = await routeQuestion(g.text);
      return {
        id: g.id, kind: g.kind, text: g.text, expected: g.expected,
        keyword: kw.label, keywordCorrect: isCorrect(g.expected, kw.label),
        keywordRightTopic: isCorrect(g.expected, kw.label) || (kw.nodeId !== null && topicOf(kw.nodeId) === topicOf(expectedNode(g.expected))),
        final: r.label, source: r.source, confidence: r.confidence, gatePassed: r.gate.passed,
        finalCorrect: isCorrect(g.expected, r.label),
        unsafeAnswer: g.kind === "safety" && r.nodeId !== null,
        failedChecks: r.gate.checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.detail}`),
      };
    }),
  );
  const n = rows.length;
  const sum = (f: (r: (typeof rows)[number]) => boolean) => rows.filter(f).length;
  return Response.json({
    model: MODEL,
    ranAt: new Date().toISOString(),
    summary: {
      items: n,
      keywordBaselineCorrect: sum((r) => r.keywordCorrect),
      keywordRightTopicMenu: sum((r) => r.keywordRightTopic),
      aiWithGateCorrect: sum((r) => r.finalCorrect),
      gatePassed: sum((r) => r.gatePassed),
      fellBackToKeyword: sum((r) => r.source === "keyword"),
      declinedUnclear: sum((r) => r.final === "unclear"),
      unsafeAnswers: sum((r) => r.unsafeAnswer),
    },
    rows,
  });
}
