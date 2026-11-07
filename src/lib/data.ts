import { addDays, addMonths, formatDate, today } from "./dates";
import type { SIP, Topic } from "./types";

/**
 * Every SIP object is COMPUTED fresh, relative to the real current date,
 * each time these functions are called — never a hardcoded literal date.
 * This is what guarantees the prototype can never show a "debited" date
 * that sits in the future relative to whoever is actually viewing it,
 * no matter how long the server process has been running for.
 */

export function getActiveSip(): SIP {
  const latestDate = addDays(today(), -1); // "debited yesterday" — the Journey 2 scenario, always true
  const previousDate = addMonths(latestDate, -1);
  const nextDate = addMonths(latestDate, 1);
  const totalSuccessfulInstalments = 32;
  const startDate = addMonths(latestDate, -totalSuccessfulInstalments);
  const mandateApprovedDate = addDays(startDate, -9);
  const monthlyAmount = 2000;

  const recentInstalments = [5, 4, 3, 2, 1, 0].map((monthsAgo) => ({
    date: formatDate(addMonths(latestDate, -monthsAgo)),
    status: monthsAgo === 0 ? ("Processing" as const) : ("Allotted" as const),
    amount: monthlyAmount,
  }));

  const totalInvested = (totalSuccessfulInstalments + 1) * monthlyAmount; // +1 for the in-flight debit

  return {
    id: "sip-active",
    fundName: "Parag Parikh Flexi Cap Fund",
    monthlyAmount,
    frequency: "Monthly",
    startDate: formatDate(startDate),
    status: "Active",
    autopayStatus: "Approved",
    mandateApprovedDate: formatDate(mandateApprovedDate),
    bankAccountMasked: "HDFC Bank •••• 4821",
    totalInvested,
    currentValue: 69420,
    unitsHeld: 612.48,
    xirrPct: 7.8,
    totalSuccessfulInstalments,
    recentInstalments,
    nextInstalmentDate: formatDate(nextDate),
    previousInstalmentDate: formatDate(previousDate),
  };
}

export function getStoppedSip(): SIP {
  const lastInstalmentDate = addMonths(today(), -16);
  const totalSuccessfulInstalments = 30;
  const startDate = addMonths(lastInstalmentDate, -(totalSuccessfulInstalments - 1));
  const mandateApprovedDate = addDays(startDate, -3);
  const monthlyAmount = 1500;

  const recentInstalments = [2, 1, 0].map((monthsAgo) => ({
    date: formatDate(addMonths(lastInstalmentDate, -monthsAgo)),
    status: "Allotted" as const,
    amount: monthlyAmount,
  }));

  return {
    id: "sip-stopped",
    fundName: "Axis Small Cap Fund",
    monthlyAmount,
    frequency: "Monthly",
    startDate: formatDate(startDate),
    status: "Stopped",
    autopayStatus: "Cancelled",
    mandateApprovedDate: formatDate(mandateApprovedDate),
    bankAccountMasked: "HDFC Bank •••• 4821",
    totalInvested: totalSuccessfulInstalments * monthlyAmount,
    currentValue: 51870,
    unitsHeld: 489.12,
    xirrPct: 9.1,
    totalSuccessfulInstalments,
    recentInstalments,
    nextInstalmentDate: null,
    previousInstalmentDate: formatDate(lastInstalmentDate),
    stoppedDate: formatDate(lastInstalmentDate),
    lastInstalmentDate: formatDate(lastInstalmentDate),
  };
}

export function getAllSips(): SIP[] {
  return [getActiveSip(), getStoppedSip()];
}

export function getSip(id: string): SIP | undefined {
  return getAllSips().find((s) => s.id === id);
}

export function getToday(): string {
  return formatDate(today());
}

/** The one real, verified issue a SIP currently has — or null if everything's normal. Never a fabricated warning. */
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
    return { headline: "AutoPay (mandate) pending", detail: "Your bank hasn't confirmed it yet." };
  }
  if (sip.autopayStatus === "Rejected") {
    return { headline: "AutoPay (mandate) rejected", detail: "Instalments can't be processed until this is fixed." };
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
    title: "AutoPay (mandate) status",
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
