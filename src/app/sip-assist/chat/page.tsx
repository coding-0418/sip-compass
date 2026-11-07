import { redirect } from "next/navigation";
import { getSip } from "@/lib/data";
import { buildActiveNodes, buildStoppedNodes } from "@/lib/conversation";
import type { Topic } from "@/lib/types";
import ChatScreenClient from "./ChatScreenClient";

export const dynamic = "force-dynamic";

/**
 * The SIP and its conversation nodes are built here, on the server, from the
 * single central data source — never recomputed client-side — so the chat
 * always agrees with the homepage and details page for the same SIP.
 */
export default async function SipAssistChatPage({
  searchParams,
}: {
  searchParams: Promise<{ sip?: string; topic?: string; stopped?: string; q?: string }>;
}) {
  const { sip: sipParam, topic: topicParam, stopped: stoppedParam, q: qParam } = await searchParams;
  const sip = sipParam ? getSip(sipParam) : undefined;

  if (!sip) {
    redirect(sipParam ? `/sip-assist?sip=${sipParam}` : "/sip-assist");
  }

  const isStopped = sip.status === "Stopped";
  const nodes = isStopped ? buildStoppedNodes(sip) : buildActiveNodes(sip);

  return (
    <ChatScreenClient
      sip={sip}
      nodes={nodes}
      topicParam={(topicParam as Topic) ?? null}
      stoppedParam={stoppedParam ?? null}
      qParam={qParam ?? null}
    />
  );
}
