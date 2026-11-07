import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SuggestedActionData } from "@/lib/types";

export default function SuggestedAction({ label, description, tag, href }: SuggestedActionData) {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-white px-3.5 py-3 text-left transition-colors hover:border-primary hover:bg-success-bg"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        {description ? <p className="mt-0.5 truncate text-xs text-muted">{description}</p> : null}
        {tag ? (
          <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-[10px] font-medium text-muted">
            {tag}
          </span>
        ) : null}
      </div>
      <ChevronRight size={16} className="shrink-0 text-muted" />
    </Link>
  );
}
