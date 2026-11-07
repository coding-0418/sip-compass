# SIP Compass — User Testing Protocol

**Status: protocol only.** No usability sessions have been run yet. The six
qualitative feedback responses referenced in earlier project notes were design
feedback on static screens/wireframes — they are evidence that people reacted
to the *concept*, not proof that anyone completed these interactive tasks in
this build. Do not conflate the two.

## Tasks

| Task | Starting screen | Success condition |
|---|---|---|
| T1 — Understand a debited-but-unreflected payment | My SIPs (`/`) | User reaches the structured "debited, awaiting allotment" explanation and can state in their own words that it's normal and no second payment is needed |
| T2 — Check AutoPay status | My SIPs (`/`) | User reaches the AutoPay (mandate) explanation and correctly states their mandate is Approved |
| T3 — Find how to skip an instalment | My SIPs (`/`) | User reaches the Manage-SIP → Skip flow and can state which date is eligible to skip |
| T4 — Understand negative returns | My SIPs (`/`) | User reaches the Understand-investment flow and can explain, in their own words, that fluctuation is normal and the app won't predict returns |
| T5 — Explore options after stopping a SIP | My SIPs (`/`), stopped SIP card | User reaches the reason-selection flow, picks a reason, and can name at least one option offered (without feeling pressured to restart) |

## Data to record per participant per task

- Completion time (start click → success condition met)
- Number of errors (wrong taps, backtracking, dead ends)
- Whether assistance was required (and what kind)
- Participant's stated understanding of "what to do next"
- Verbatim feedback / friction points

## Protocol notes

- Run tasks in the order above; reset to `/` between tasks.
- Do not prompt the participant toward the "right" tap — note where they
  actually look first.
- A task is only "complete" if the participant can restate the success
  condition in their own words, not just if they clicked through it.
- Record "assistance required" honestly — a facilitator hint invalidates a
  clean completion-time read for that task.

## What this document is not

This is a protocol to run the test, not a report of results. Until real
sessions are conducted, there is no completion-time, error-count or
comprehension data to report — fabricating plausible-sounding numbers here
would misrepresent the state of the project to reviewers.
