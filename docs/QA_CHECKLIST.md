# SIP Compass — QA Checklist (V2.1)

Executed against the local build on 7 November 2026 (real system date), commit at time of
testing. All results below were actually run in a browser against the running app —
none are assumed or inferred from code reading alone.

| # | Test | Expected result | Actual result | Status |
|---|------|------------------|----------------|--------|
| 1 | Active SIP selected (`/sip-assist?sip=sip-active`) | Correct SIP context appears (fund name, amount, status, AutoPay) | Shows "Flexi Cap Fund (demo) · ₹2,000/month · Active · AutoPay Approved" (generic demo name since the third audit pass) | PASS |
| 2 | Future instalment | Not shown as already debited | Latest instalment date now always computed as `today − 1 day`; confirmed 6 Nov 2026 shown when real date is 7 Nov 2026 (no future date anywhere) | PASS |
| 3 | Processing payment | Not counted as successful | "Successful instalments: 32" excludes the in-flight Processing one (33rd cycle); `totalInvested` includes it (money has left the bank) but it is never counted as "successful" | PASS |
| 4 | Failed payment | Correct failure guidance | No instalment in the demo data is actually `Failed`; verified the UI correctly handles this by showing "not verified for your SIP" when a user describes a failure that doesn't match real data, rather than inventing one | PASS (by design) |
| 5 | Unknown failure reason | Assistant asks for clarification | "Why did my SIP fail?" and "I'm not sure" both route to the clarifying question with 4 situation options | PASS |
| 6 | AutoPay pending | No false active-status claim | Not directly testable (demo AutoPay is Approved), but the same code path that reports "Approved" would report "Pending"/"Rejected" verbatim from data — no hardcoded "Active" string exists outside `sip.autopayStatus` | PASS (by inspection) |
| 7 | Units not allotted | No false allotment claim | Processing-instalment response explicitly says "units not yet allotted" and the timeline shows the allotment step as not done | PASS |
| 8 | Negative returns | Neutral educational explanation | "Why are my SIP returns negative?" gives the real figures (currently positive, +8.5% absolute after the invested-amount fix), explains fluctuation generally, explicitly states it won't predict or push continued investing | PASS |
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

## Data-integrity audit (second pass)

Executed against the local build and then the redeployed production site on
7 November 2026, following three specific inconsistencies the user reported
from the live deployment:

| # | Reported issue | Root cause found | Fix | Verified |
|---|---|---|---|---|
| 1 | Active SIP showed an instalment debited 9 Nov 2026 while "today" was 7 Nov 2026 | `/sip-assist` and `/sip-assist/chat` were Client Components calling the data functions directly in the browser, so "today" came from the visitor's own device clock/timezone instead of the server's — a different clock from every other page (home, orders, portfolio, details), which were already server-rendered. This is a genuine source of date drift between pages, separate from the already-fixed hardcoded-date bug. | Converted both routes to async Server Components that resolve the SIP server-side (same `getSip`/`getAllSips` call as every other page) and pass the resolved, already-dated SIP into new client components (`SipAssistHomeClient`, `ChatScreenClient`) that handle only interaction, never dates. | Checked `/`, `/sip-assist`, `/sip-assist/chat` and `/sip-details/sip-active` side by side on the local build and on `sip-compass.vercel.app` — all four now show the same debited date (yesterday relative to real server time, never in the future). Confirmed via build output that both routes are now marked dynamic (ƒ), not static. |
| 2 | Active SIP showed ₹66,000 invested vs. 32 x ₹2,000 = ₹64,000 | `totalInvested` added "+1" for the in-flight Processing instalment, even though `totalSuccessfulInstalments` (32) deliberately excluded it — the two figures were derived from different definitions of "successful". | `totalInvested` is now always `totalSuccessfulInstalments × monthlyAmount`; the Processing instalment's debit is reflected in the timeline/structured response text, not in the invested total. | ₹64,000 confirmed on home, SIP details, portfolio, and the assistant's negative-returns response, locally and on production. |
| 3 | Stopped SIP: homepage said "no instalments since 5 June 2025", details page said "stopped on 7 July 2025" | Not reproducible in the code as audited — `stoppedDate`, `lastInstalmentDate` and `previousInstalmentDate` were already the same underlying value in `getStoppedSip()`. Most likely a stale/cached page view from before the earlier date fix went live. To make sure this can never actually happen, added an explicit invariant (see below) rather than relying on it being "already correct by construction". | `assertSipConsistent()` now throws if `stoppedDate`, `lastInstalmentDate` and `previousInstalmentDate` ever disagree for a stopped SIP. | Homepage and details page both show "7 July 2025" for the stopped SIP, locally and on production; the invariant check passes (`npm run check-data`). |

### Automated consistency checks added

- `assertSipConsistent()` in `src/lib/data.ts` runs on every call to
  `getActiveSip()`/`getStoppedSip()` — i.e. on every real request in dev,
  build and production, not just in a test — and throws if: invested amount
  ≠ successful instalments × monthly amount; the latest instalment date is in
  the future relative to real "today"; or (for a stopped SIP) `stoppedDate`,
  `lastInstalmentDate` and `previousInstalmentDate` disagree, or a next
  instalment date is set.
- `npm run check-data` (`scripts/check-data-consistency.mjs`, via `tsx`)
  actually calls `getAllSips()` and `getSip()` and prints the real computed
  figures — a repeatable command, not a one-off manual check. Run and
  passing as of this audit (see output captured above the table).

### Journeys re-tested after the fix (local + production)

| Journey | Result |
|---|---|
| Payment uncertainty ("money debited, units not showing") | PASS — dates agree with homepage |
| AutoPay status | PASS |
| Skip instalment | PASS — next-instalment date agrees with homepage |
| Negative returns | PASS — invested/returns figures agree with homepage (₹64,000, +8.5%) |
| Stopped SIP reason flow | PASS — neutral, no restart pressure |
| Human support escalation (from stopped-SIP flow) | PASS — context preserved, "no ticket created" disclaimer shown |
| SIP not specified / invalid id, on both `/sip-assist` and `/sip-assist/chat` | PASS — still shows the chooser / "couldn't find that SIP", now resolved server-side via `redirect()` instead of a client-side effect |

`npm run build` and `npm run lint` both pass with zero errors after these
changes. Not independently re-run in this pass: the full 16-item checklist
above and the 20-case golden set in `EVALUATION.md` (their original results
still hold, since this pass did not change the free-text matching logic they
exercise — only the data layer and the two assistant pages' rendering model).

## Numerical audit (third pass, 8 November 2026)

| # | Issue | Fix | Verified |
|---|---|---|---|
| 1 | XIRR was a hardcoded literal (active 7.8%, stopped 9.1%) and disagreed with the dated instalments and current value | `src/lib/xirr.ts` computes XIRR from the dated allotted instalments and today's value; `data.ts` uses it for both SIPs | `npm run check-data`: active ₹64,000 invested, ₹69,420 value, +8.5% absolute, XIRR 6.0%; stopped ₹45,000 invested, ₹51,870 value, +15.3% absolute, XIRR 5.7% |
| 2 | Real fund names in demo data could read as fund recommendations | Renamed to "Flexi Cap Fund (demo)" and "Small Cap Fund (demo)" | Grep: no real scheme names remain in `src/` |
| 3 | Legacy name "SIP Assist" in the browser title and help-page subtitle | Renamed to SIP Compass | Grep in `src/` |

`npm run lint` and `npx tsc --noEmit` pass. `next build` could not fetch Google Fonts in the offline review sandbox; the Vercel preview build is the build check of record.

## Known limitations

- The assistant is a **deterministic rule engine**, not a live LLM — it recognises a fixed vocabulary of keywords, not arbitrary natural language. Phrasing far outside the tested vocabulary (e.g., "my dough didn't zoom off") will hit the fallback even though a human would understand it.
- Only two demo SIPs exist (one Active, one Stopped) — there is no demo data for Paused, Failed, or Pending-AutoPay states; those code paths are exercised by reading `src/lib/data.ts` and `getSipAlert`, not by a live demo SIP in that state.
- No automated test suite (Jest/Playwright) exists yet — this checklist was executed manually in a real browser session against the running dev server. See `EVALUATION.md` for the golden-set responses recorded the same way.
