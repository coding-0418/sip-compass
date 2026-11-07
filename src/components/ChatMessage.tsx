import { BadgeCheck } from "lucide-react";
import InformationCard from "./InformationCard";
import SuggestedAction from "./SuggestedAction";
import type { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
  message: ChatMessageType;
  onOptionSelect?: (optionId: string, nextNodeId: string, label: string) => void;
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

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2.5">
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

        {message.infoCard ? <InformationCard {...message.infoCard} /> : null}

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
