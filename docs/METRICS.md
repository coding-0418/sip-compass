# SIP Compass — Product Metrics

These are proposed metrics for evaluating SIP Compass in a real product context.
**None of these have been measured** — this prototype has no analytics
instrumentation and no real user base. This is a measurement plan to validate
or reject the retention hypothesis through a controlled experiment, not a
report of observed impact.

## North Star Metric

**12-month active SIP retention**

```
Number of eligible first-time SIP investors with ≥1 successful instalment
in the trailing 30 days at month 12
──────────────────────────────────────────────────────────────────────────
Total eligible first-time SIP investors who started their first SIP
exactly 12 months earlier
```

- **Eligibility cohort:** users who started their *first-ever* Groww SIP
  (not switched from another platform) within a defined acquisition window,
  and who were exposed to SIP Compass from day one of that SIP.
- **Observation window:** trailing 30 days, measured at the 12-month
  anniversary of each user's first instalment — not calendar-month cohorts,
  to avoid seasonal bias.
- A successful instalment = order status `Allotted`, not merely `Debited`.

## Leading indicators

- **First instalment success rate** — % of first instalments that reach
  `Allotted` without manual intervention.
- **Successful instalment rate** — successful / attempted instalments,
  trailing 90 days.
- **Payment issue resolution rate** — % of "payment/instalment" assistant
  sessions that end in the user reaching a next-step action (not a dead end
  or immediate support escalation).
- **Assistant task completion rate** — % of sessions that reach a terminal,
  non-fallback assistant node (proxy for "the assistant was useful").
- **Correct answer rate** — sampled, human-graded against the golden-set
  methodology in `EVALUATION.md`, run periodically against real queries.
- **Support escalation rate** — % of assistant sessions that end in
  "Contact support", segmented by topic (high payment-escalation rate =
  assistant isn't resolving payment confusion on its own).
- **SIP pause-to-restart rate** — interpreted *neutrally*: a low rate is not
  automatically good (users may have been pressured) and a high rate is not
  automatically good (may reflect false starts). Pair with qualitative
  reason data from the stopped-SIP flow, not a single trend line.

## Guardrails

- **Incorrect financial guidance** — any assistant response contradicted by
  actual account state (should be ~0 by construction, since this prototype's
  logic is deterministic and derived from one data source; a live version
  backed by real account data needs this as an active monitor).
- **Complaints** — support tickets referencing the assistant specifically.
- **Unnecessary support escalations** — escalations where the assistant had
  verified, correct information available but the user still bailed out
  (signals a UX/trust problem, not a data problem).
- **Accidental actions** — any case where a user believed an action (skip,
  edit, cancel) was executed by the assistant when it was not. This
  prototype never executes financial actions; a production version must keep
  that boundary legible in the UI at all times.
- **Notification opt-outs** — proxy for notification fatigue/mistrust.
- **User confusion** — measured via support-ticket tagging or a lightweight
  in-app "was this helpful?" signal (not implemented in this prototype).

## Explicit non-claim

This prototype has not been shown to improve retention, reduce support load,
or change user behavior in any way. These are hypotheses a controlled
experiment (e.g., holdout vs. SIP-Compass-exposed cohorts) would need to test
before any of the above numbers are treated as real.
