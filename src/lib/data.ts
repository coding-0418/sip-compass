import type { SIP, Topic } from "./types";

/**
 * TODAY is the fixed reference date the whole demo is built around.
 * Every date below is hand-picked relative to this so the app never
 * shows contradictory dates across screens.
 */
export const TODAY = "10 November 2026";

export const activeSip: SIP = {
  id: "sip-active",
  fundName: "Parag Parikh Flexi Cap Fund",
  monthlyAmount: 2000,
  frequency: "Monthly",
  startDate: "9 March 2024",
  status: "Active",
  autopayStatus: "Approved",
  mandateApprovedDate: "28 February 2024",
  bankAccountMasked: "HDFC Bank •••• 4821",
  totalInvested: 66000,
  currentValue: 69420,
  unitsHeld: 612.48,
  xirrPct: 7.8,
  totalSuccessfulInstalments: 32,
  recentInstalments: [
    { date: "9 June 2026", status: "Allotted", amount: 2000 },
    { date: "9 July 2026", status: "Allotted", amount: 2000 },
    { date: "9 August 2026", status: "Allotted", amount: 2000 },
    { date: "9 September 2026", status: "Allotted", amount: 2000 },
    { date: "9 October 2026", status: "Allotted", amount: 2000 },
    { date: "9 November 2026", status: "Processing", amount: 2000 },
  ],
  nextInstalmentDate: "9 December 2026",
  previousInstalmentDate: "9 October 2026",
};

export const stoppedSip: SIP = {
  id: "sip-stopped",
  fundName: "Axis Small Cap Fund",
  monthlyAmount: 1500,
  frequency: "Monthly",
  startDate: "5 January 2023",
  status: "Stopped",
  autopayStatus: "Cancelled",
  mandateApprovedDate: "2 January 2023",
  bankAccountMasked: "HDFC Bank •••• 4821",
  totalInvested: 45000,
  currentValue: 51870,
  unitsHeld: 489.12,
  xirrPct: 9.1,
  totalSuccessfulInstalments: 30,
  recentInstalments: [
    { date: "5 April 2025", status: "Allotted", amount: 1500 },
    { date: "5 May 2025", status: "Allotted", amount: 1500 },
    { date: "5 June 2025", status: "Allotted", amount: 1500 },
  ],
  nextInstalmentDate: null,
  previousInstalmentDate: "5 June 2025",
  stoppedDate: "5 July 2025",
  lastInstalmentDate: "5 June 2025",
};

export const allSips: SIP[] = [activeSip, stoppedSip];

export function getSip(id: string): SIP | undefined {
  return allSips.find((s) => s.id === id);
}

/** The one real, verified issue the active SIP currently has — or null if everything's normal. */
export function getSipAlert(sip: SIP): { headline: string; detail: string } | null {
  const latest = sip.recentInstalments[sip.recentInstalments.length - 1];
  if (sip.status === "Stopped") {
    return { headline: "This SIP has been stopped", detail: `No instalments since ${sip.lastInstalmentDate}.` };
  }
  if (latest?.status === "Processing") {
    return {
      headline: `Your ${monthOf(latest.date)} instalment is processing`,
      detail: `Debited on ${latest.date} — units aren't allotted yet.`,
    };
  }
  if (latest?.status === "Failed") {
    return {
      headline: `Your ${monthOf(latest.date)} instalment failed`,
      detail: "Let's understand what happened.",
    };
  }
  if (sip.autopayStatus === "Pending") {
    return { headline: "AutoPay mandate pending", detail: "Your bank hasn't confirmed it yet." };
  }
  if (sip.autopayStatus === "Rejected") {
    return { headline: "AutoPay mandate rejected", detail: "Instalments can't be processed until this is fixed." };
  }
  return null;
}

function monthOf(dateStr: string) {
  return dateStr.split(" ")[1];
}

export const topics: { id: Topic; title: string; description: string }[] = [
  {
    id: "payment",
    title: "Payment and instalments",
    description: "Failed, pending or debited payments.",
  },
  {
    id: "mandate",
    title: "AutoPay status",
    description: "The bank permission behind your instalments.",
  },
  {
    id: "manage",
    title: "Manage my SIP",
    description: "Edit, skip or understand your options.",
  },
  {
    id: "understand",
    title: "Understand my investment",
    description: "Returns, XIRR and terminology.",
  },
];
