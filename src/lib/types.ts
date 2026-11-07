export type SipStatus = "Active" | "Paused" | "Stopped";
export type AutopayStatus = "Approved" | "Pending" | "Rejected" | "Cancelled";
export type InstalmentStatus = "Scheduled" | "Debited" | "Processing" | "Allotted" | "Failed";

export interface Instalment {
  date: string;
  status: InstalmentStatus;
  amount: number;
}

export interface SIP {
  id: string;
  fundName: string;
  monthlyAmount: number;
  frequency: "Monthly";
  startDate: string;
  status: SipStatus;
  autopayStatus: AutopayStatus;
  mandateApprovedDate?: string;
  bankAccountMasked: string;
  totalInvested: number;
  currentValue: number;
  unitsHeld: number;
  xirrPct: number;
  totalSuccessfulInstalments: number;
  recentInstalments: Instalment[];
  nextInstalmentDate: string | null;
  previousInstalmentDate: string | null;
  stoppedDate?: string;
  lastInstalmentDate?: string;
}

export interface SuggestedActionData {
  id: string;
  label: string;
  description?: string;
  tag?: string;
  href: string;
}

export interface InfoCardData {
  title?: string;
  body: string;
  tone?: "default" | "warning";
}

export interface ConversationOption {
  id: string;
  label: string;
  nextNodeId: string;
}

export interface TimelineStep {
  label: string;
  caption?: string;
  done: boolean;
}

export interface StructuredExplanation {
  whatHappened: string;
  whatItMeans: string;
  verifiedNote: string;
  isVerified: boolean;
  timeline?: TimelineStep[];
  nextSteps: SuggestedActionData[];
  supportNote?: string;
}

export interface ConversationNode {
  id: string;
  assistantText?: string[];
  structured?: StructuredExplanation;
  infoCard?: InfoCardData;
  verified?: boolean;
  options?: ConversationOption[];
  suggestedActions?: SuggestedActionData[];
}

export type Topic = "payment" | "mandate" | "manage" | "understand";

export type StopReason = "failures" | "budget" | "returns" | "break" | "other";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string[];
  structured?: StructuredExplanation;
  infoCard?: InfoCardData;
  verified?: boolean;
  options?: ConversationOption[];
  suggestedActions?: SuggestedActionData[];
  resolved?: boolean;
}
