import type { LucideIcon } from "lucide-react";

interface TopicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export default function TopicCard({ icon: Icon, title, description, onClick }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border bg-white p-3.5 text-left transition-colors hover:border-primary hover:bg-success-bg"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-primary-dark">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted">{description}</p>
      </div>
    </button>
  );
}
