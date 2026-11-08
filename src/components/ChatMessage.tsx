import { BadgeCheck, Check, Circle, Info, PhoneCall } from "lucide-react";
import InformationCard from "./InformationCard";
import SuggestedAction from "./SuggestedAction";
import type { ChatMessage as ChatMessageType, TimelineStep } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect?: (optionId: string, nextNodeId: string, label: string) => void;
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                step.done ? "bg-primary text-white" : "border-2 border-border bg-white text-muted"
              }`}
            >
              {step.done ? <Check size={11} /> : <Circle size={6} fill="currentColor" />}
            </span>
            {i !== steps.length - 1 ? (
              <span className={`w-0.5 flex-1 ${step.done ? "bg-primary" : "bg-border"}`} style={{ minHeight: 20 }} />
            ) : null}
          </div>
          <div className="pb-3">
            <p className="text-xs font-medium text-ink">{step.label}</p>
            {step.caption ? <p className="text-[11px] text-muted">{step.caption}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ChatMessage({ message, onOptionSelect }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
          {message.text?.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    );
  }

  const s = message.structured;

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] space-y-2.5">
        {s ? (
          <div className="space-y-2.5 rounded-2xl rounded-tl-sm border border-border bg-white p-4 text-sm text-ink">
            {message.text?.length ? (
              <div className="space-y-1 font-semibold leading-snug">
                {message.text.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ) : null}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">What happened</p>
              <p className="mt-0.5 leading-snug">{s.whatHappened}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">What it means</p>
              <p className="mt-0.5 leading-snug">{s.whatItMeans}</p>
            </div>
            <div
              className={`flex items-start gap-1.5 rounded-lg p-2 text-xs ${
                s.isVerified ? "bg-success-bg text-primary-dark" : "bg-surface text-muted"
              }`}
            >
              {s.isVerified ? <BadgeCheck size={14} className="mt-0.5 shrink-0" /> : <Info size={14} className="mt-0.5 shrink-0" />}
              <span>{s.verifiedNote}</span>
            </div>
            {s.timeline ? <Timeline steps={s.timeline} /> : null}
          </div>
        ) : message.text?.length || message.verified ? (
          <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-2.5 text-sm text-ink">
            {message.verified ? (
              <div className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-primary-dark">
                <BadgeCheck size={13} />
                Verified guidance
              </div>
            ) : null}
            <div className="space-y-1.5 leading-snug">
              {message.text?.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        ) : null}

        {message.infoCard ? <InformationCard {...message.infoCard} /> : null}

        {s?.nextSteps?.length ? (
          <div className="space-y-1.5">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">What you can do next</p>
            {s.nextSteps.map((action) => (
              <SuggestedAction key={action.id} {...action} />
            ))}
          </div>
        ) : null}

        {s?.supportNote ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted">
            <PhoneCall size={13} className="shrink-0" />
            {s.supportNote}
          </div>
        ) : null}

        {message.options && !message.resolved ? (
          <div className="space-y-1.5">
            {message.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onOptionSelect?.(opt.id, opt.nextNodeId, opt.label)}
                className="block w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-left text-sm font-medium text-primary-dark transition-colors hover:border-primary hover:bg-success-bg"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : null}

        {message.suggestedActions ? (
          <div className="space-y-1.5">
            {message.suggestedActions.map((action) => (
              <SuggestedAction key={action.id} {...action} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
