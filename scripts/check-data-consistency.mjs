// Runs the SIP data model's self-checks by actually calling the data functions.
// The assertions themselves live in src/lib/data.ts (assertSipConsistent), so this
// script is not a second source of truth — it just exercises the real code path
// and fails loudly (non-zero exit) if any invariant is violated.
import { getAllSips, getSip } from "../src/lib/data.ts";

const sips = getAllSips();

for (const sip of sips) {
  console.log(
    `[OK] ${sip.id}: totalInvested=₹${sip.totalInvested} (${sip.totalSuccessfulInstalments} x ₹${sip.monthlyAmount}), ` +
      `status=${sip.status}, stoppedDate=${sip.stoppedDate ?? "-"}, lastInstalmentDate=${sip.lastInstalmentDate ?? "-"}`
  );
}

if (getSip("sip-does-not-exist") !== undefined) {
  throw new Error("getSip should return undefined for an unknown id");
}

console.log("\nAll SIP data consistency checks passed.");
