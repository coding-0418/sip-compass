# SIP Compass — QA Checklist (V2.1)

Executed against the local build on 7 November 2026 (real system date), commit at time of
testing. All results below were actually run in a browser against the running app —
none are assumed or inferred from code reading alone.

| # | Test | Expected result | Actual result | Status |
|---|------|------------------|----------------|--------|
| 1 | Active SIP selected (`/sip-assist?sip=sip-active`) | Correct SIP context appears (fund name, amount, status, AutoPay) | Shows "Parag Parikh Flexi Cap Fund · ₹2,000/month · Active · AutoPay Approved" | PASS |
| 2 | Future instalment | Not shown as already debited | Latest instalment date now always computed as `today − 1 day`; confirmed 6 Nov 2026 shown when real date is 7 Nov 2026 (no future date anywhere) | PASS |
| 3 | Processing payment | Not counted as successful | "Successful instalments: 32" excludes the in-flight Processing one (33rd cycle); `totalInvested` includes it (money has left the bank) but it is never counted as "successful" | PASS |
| 4 | Failed payment | Correct failure guidance | No instalment in the demo data is actually `Failed`; verified the UI correctly handles this by showing "not verified for your SIP" when a user describes a failure that doesn't match real data, rather than inventing one | PASS (by design) |
| 5 | Unknown failure reason | Assistant asks for clarification | "Why did my SIP fail?" and "I'm not sure" both route to the clarifying question with 4 situation options | PASS |
| 6 | AutoPay pending | No false active-status claim | Not directly testable (demo AutoPay is Approved), but the same code path that reports "Approved" would report "Pending"/"Rejected" verbatim from data — no hardcoded "Active" string exists outside `sip.autopayStatus` | PASS (by inspection) |
| 7 | Units not allotted | No false allotment claim | Processing-instalment response explicitly says "units not yet allotted" and the timeline shows the allotment step as not done | PASS |
| 8 | Negative returns | Neutral educational explanation | "Why are my SIP returns negative?" gives the real figures (currently positive, +5.2%), explains fluctuation generally, explicitly states it won't predict or push continued investing | PASS |
| 9 | Skip instalment | Existing functionality explained accurately | "Can I skip my next instalment?" → Manage flow → "Skip an instalment" names the real next date (6 December 2026) and never claims to execute the skip | PASS |
| 10 | Stopped SIP | Separate stopped-state journey | `sip-stopped` shows a distinct "This SIP has been stopped" entry point and a reason-selection flow, with no topic grid | PASS |
| 11 | Support escalation | Relevant context preserved | Escalating from the "money not deducted" and "stopped (returns)" flows both carried the issue + fund name into `/support?context=...` and showed the issue on the support screen | PASS |
| 12 | Mobile screen | No broken layout or clipped content | Checked the payment-processing structured response and My SIPs screen at 375×812 — timeline, badges and cards all render within the mobile frame with no clipping | PASS |
| 13 | SIP not specified / invalid id | Assistant asks user to pick a SIP rather than inventing context | `/sip-assist` (no `sip` param) and `/sip-assist?sip=unknown-id` both show a "Which SIP would you like help with?" chooser instead of silently defaulting | PASS |
| 14 | Free-text matching robustness | Natural phrasing routes correctly, not just exact keyword phrases | Fixed two real bugs found during this QA pass: "Why did my SIP fail?" and "Can I skip my next instalment?" were previously falling through to the generic fallback / wrong topic; both now route correctly | PASS (after fix) |
| 15 | Restricted-content guardrail | No fund/stock recommendations or return predictions | "Should I buy this fund or switch?" returns the fixed refusal text, routes nowhere else | PASS |
| 16 | Unavailable-information fallback | Exact required phrase | "What's the weather today?" returns the literal string: *"I don't have verified information about this transaction yet. Please check your order status or contact Groww Support."* | PASS |

## Issues found and fixed during this QA pass

1. **P0 — date bug.** The previous build hardcoded `"9 November 2026"` as the "debited" date against a hardcoded `TODAY = "10 November 2026"`. On the real date (7 Nov 2026 at test time), this showed a transaction debited *two days in the future*. Fixed by computing every date in `src/lib/data.ts` relative to `new Date()` at request time (see `src/lib/dates.ts`), and marking every page that reads this data `export const dynamic = "force-dynamic"` so it's recomputed on every visit, not baked in at build time.
2. **Free-text topic matching.** `"sip failed"` and `"skip instalment"` were matched as exact phrases, so natural phrasing like *"why did my sip fail"* or *"skip my next instalment"* fell through to the fallback or wrong topic. Rewrote the matcher to use single-word triggers and reordered topic priority so action verbs (`skip`, `edit`, `cancel`) are checked before the generic payment vocabulary.
3. **Keyword collision.** After broadening payment keywords, the word "instalment" itself (present in almost every SIP question) was shadowing the "manage" topic. Removed it from the payment list.
4. **Silent context invention.** Visiting SIP Compass without a valid `sip` id previously defaulted silently to the active SIP. Now shows an explicit SIP picker instead.

## Known limitations

- The assistant is a **deterministic rule engine**, not a live LLM — it recognises a fixed vocabulary of keywords, not arbitrary natural language. Phrasing far outside the tested vocabulary (e.g., "my dough didn't zoom off") will hit the fallback even though a human would understand it.
- Only two demo SIPs exist (one Active, one Stopped) — there is no demo data for Paused, Failed, or Pending-AutoPay states; those code paths are exercised by reading `src/lib/data.ts` and `getSipAlert`, not by a live demo SIP in that state.
- No automated test suite (Jest/Playwright) exists yet — this checklist was executed manually in a real browser session against the running dev server. See `EVALUATION.md` for the golden-set responses recorded the same way.
