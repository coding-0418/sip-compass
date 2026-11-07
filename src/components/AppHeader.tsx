"use client";

import { ArrowLeft, Bell, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  variant?: "main" | "sub";
  title?: string;
  subtitle?: string;
  backHref?: string;
}

export default function AppHeader({ variant = "main", title, subtitle, backHref }: AppHeaderProps) {
  const router = useRouter();

  if (variant === "sub") {
    return (
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          type="button"
          aria-label="Go back"
          onClick={() => (backHref ? router.push(backHref) : router.back())}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-ink">{title}</h1>
          {subtitle ? <p className="truncate text-xs text-muted">{subtitle}</p> : null}
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between px-4 py-3">
      <Link href="/" className="text-xl font-extrabold tracking-tight text-ink">
        groww<span className="text-primary">.</span>
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
        >
          <Bell size={20} />
        </Link>
        <Link
          href="/profile"
          aria-label="Profile"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface"
        >
          <UserRound size={20} />
        </Link>
      </div>
    </header>
  );
}
