import { redirect } from "next/navigation";
import { activeSip } from "@/lib/data";

export default function SipDetailsIndexPage() {
  redirect(`/sip-details/${activeSip.id}`);
}
