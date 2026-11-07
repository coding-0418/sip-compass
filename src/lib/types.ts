export interface SIP {
  id: string;
  fundName: string;
  monthlyAmount: number;
  nextInstalmentDate: string;
  status: "Active" | "Paused" | "Failed";
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

export interface ConversationNode {
  id: string;
  assistantText: string[];
  infoCard?: InfoCardData;
  verified?: boolean;
  options?: ConversationOption[];
  suggestedActions?: SuggestedActionData[];
}

export type Topic = "payment" | "mandate" | "manage" | "understand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text?: string[];
  infoCard?: InfoCardData;
  verified?: boolean;
  options?: ConversationOption[];
  suggestedActions?: SuggestedActionData[];
  resolved?: boolean;
}
