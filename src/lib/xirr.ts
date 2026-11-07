/**
 * XIRR computed from actual dated cash flows (instalments out, current value in),
 * so the displayed figure can never drift from the invested amount and dates.
 * Uses bisection on the NPV function; returns a percentage rounded to 1 decimal.
 */
export type CashFlow = { date: Date; amount: number };

export function xirrPct(cashFlows: CashFlow[]): number {
  if (cashFlows.length < 2) throw new Error("XIRR needs at least two cash flows");
  const t0 = cashFlows[0].date.getTime();
  const yearMs = 365 * 24 * 60 * 60 * 1000;
  const npv = (r: number) =>
    cashFlows.reduce((sum, cf) => sum + cf.amount / Math.pow(1 + r, (cf.date.getTime() - t0) / yearMs), 0);

  let lo = -0.99;
  let hi = 10;
  if (npv(lo) * npv(hi) > 0) throw new Error("XIRR could not be bracketed for these cash flows");
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(mid) > 0) lo = mid;
    else hi = mid;
  }
  return Math.round(((lo + hi) / 2) * 1000) / 10;
}
