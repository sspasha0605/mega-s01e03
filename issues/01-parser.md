# Shared parser reads day-first tenant dates as month-first — 379 reports

## Problem and scope

379 unique reports merged into course ticket #4471 classify as `parser` using the exported tenant directory, report channel, and `causeOf` in `src/lib/kb/causes.ts`. They span 11 tenants, from 1 April through 4 October 2026. This count includes five reports the desk read as one-day moves; those symptoms need investigation and are not proof of a third cause.

## Evidence and reproduction

The shared parser reads dates month first for tenants whose date order is day first. For example, R-41200 (Harbour Dental, en-GB, app) reports a 7 April reminder appearing on 4 July. R-41201 describes the inverse swap. Pass an ambiguous day-first date such as `07/04/2026` through the shared parser for a day-first tenant and inspect the resulting invite date. Expected: 7 April. Reported behavior: 4 July.

## Count method

Deduplicate by report ID, restrict to `mergedInto === 4471`, join each report to its tenant, determine date order with `Intl.DateTimeFormat`, and run the supplied classifier. Intake tags are not the cause: this group was tagged parser 356 times and hint 23 times. Complete membership is in `analysis/parser-report-ids.txt`; `npm run analyze` regenerates the counts.

## Proposed acceptance criteria

- The shared parser uses the tenant's date convention or an explicit unambiguous date contract.
- Tests cover ambiguous dates and both directions of month/day swaps for day-first tenants.
- The separate booking-v3 hint problem has its own issue; fixing this parser does not establish that the hint is correct.
- Investigate the five one-day reports listed in `desk-notes.json` without silently removing them from the exported classification.

The export is a snapshot. Recheck new desk reports before treating this count as current.
