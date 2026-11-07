import { AlertTriangle, Info } from "lucide-react";
import type { InfoCardData } from "@/lib/types";

export default function InformationCard({ title, body, tone = "default" }: InfoCardData) {
  const isWarning = tone === "warning";
  return (
    <div
      className={`flex gap-2.5 rounded-xl border p-3 text-sm ${
        isWarning ? "border-[#F5DCA8] bg-warning-bg" : "border-border bg-surface"
      }`}
    >
      <span className={`mt-0.5 shrink-0 ${isWarning ? "text-[#B8781A]" : "text-muted"}`}>
        {isWarning ? <AlertTriangle size={16} /> : <Info size={16} />}
      </span>
      <div>
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        <p className="text-ink/80 leading-snug">{body}</p>
      </div>
    </div>
  );
}
