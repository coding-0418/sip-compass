import { routeQuestion } from "@/lib/router";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { text?: string };
  const text = (body.text ?? "").toString().trim();
  if (!text) return Response.json({ error: "text required" }, { status: 400 });
  return Response.json(await routeQuestion(text));
}

/** GET ?q=... for quick manual checks by testers and mentors. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q) return Response.json({ error: "add ?q=your question" }, { status: 400 });
  return Response.json(await routeQuestion(q));
}
