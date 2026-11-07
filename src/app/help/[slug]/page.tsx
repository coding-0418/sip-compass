import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Check, Circle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { helpContent } from "@/lib/helpContent";

async function HelpArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = helpContent[slug];
  if (!content) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader variant="sub" title={content.title} subtitle="SIP Assist help" backHref="/sip-assist" />

      <main className="flex-1 space-y-4 px-4 py-5">
        {content.type === "article" ? (
          <>
            {content.intro ? <p className="text-sm text-ink">{content.intro}</p> : null}
            {content.bullets ? (
              <ul className="space-y-2">
                {content.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2 rounded-xl border border-border bg-surface p-3 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
            {content.paragraphs?.map((p) => (
              <p key={p} className="text-sm leading-relaxed text-ink">
                {p}
              </p>
            ))}
          </>
        ) : null}

        {content.type === "list" ? (
          <>
            {content.intro ? <p className="text-sm text-muted">{content.intro}</p> : null}
            {content.items.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface p-3.5 text-sm text-muted">
                Nothing here right now — everything&apos;s up to date.
              </p>
            ) : null}
            <div className="space-y-2.5">
              {content.items.map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-white p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-ink">{item.label}</p>
                    {item.badge ? (
                      <span className="shrink-0 rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-medium text-primary-dark">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  {item.caption ? <p className="mt-1 text-xs text-muted">{item.caption}</p> : null}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {content.type === "status" ? (
          <>
            {content.intro ? <p className="text-sm font-medium text-ink">{content.intro}</p> : null}
            <div className="space-y-0">
              {content.steps.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        step.done ? "bg-primary text-white" : "border-2 border-border bg-white text-muted"
                      }`}
                    >
                      {step.done ? <Check size={13} /> : <Circle size={8} fill="currentColor" />}
                    </span>
                    {i !== content.steps.length - 1 ? (
                      <span className={`w-0.5 flex-1 ${step.done ? "bg-primary" : "bg-border"}`} style={{ minHeight: 28 }} />
                    ) : null}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium text-ink">{step.label}</p>
                    {step.caption ? <p className="mt-0.5 text-xs text-muted">{step.caption}</p> : null}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}

      </main>
    </div>
  );
}

export default function HelpPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={null}>
      <HelpArticle params={params} />
    </Suspense>
  );
}
