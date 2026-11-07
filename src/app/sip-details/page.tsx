import { redirect } from "next/navigation";
import { getActiveSip } from "@/lib/data";

export default function SipDetailsIndexPage() {
  redirect(`/sip-details/${getActiveSip().id}`);
}
