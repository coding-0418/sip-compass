import type { SIP } from "./types";

export const sampleSIP: SIP = {
  id: "sip-001",
  fundName: "Parag Parikh Flexi Cap Fund",
  monthlyAmount: 2000,
  nextInstalmentDate: "12 November",
  status: "Active",
};

export const topics = [
  {
    id: "payment" as const,
    title: "Payment and instalments",
    description: "Failed, pending or debited payments.",
  },
  {
    id: "mandate" as const,
    title: "Mandate status",
    description: "Understand approval and mandate issues.",
  },
  {
    id: "manage" as const,
    title: "Manage my SIP",
    description: "Edit, skip or understand your options.",
  },
  {
    id: "understand" as const,
    title: "Understand my investment",
    description: "Returns, invested amount and terminology.",
  },
];
