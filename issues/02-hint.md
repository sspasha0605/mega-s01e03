# booking-v3 displays a month-first hint to day-first tenants — 33 reports

## Problem and scope

33 unique reports merged into course ticket #4471 classify as `hint`, a separate cause from the shared parser. They come from booking-v3 form submissions at Alder Physio (de-DE), Copper Studio (es-ES), and Pale Harbour (pt-PT), from 17 April through 22 September 2026.

## Evidence and reproduction

`DATE_HINT` in `src/lib/kb/causes.ts` sets booking-v3 to `MM/DD/YYYY`, but the form reads input according to the day-first tenant locale. Enter a date following that hint, such as `01/06/2026` for January 6, and the tenant's form interprets it as June 1. R-41230 (Copper Studio, form) reports precisely that mismatch. R-41241 (Alder Physio, form) and R-41251 (Pale Harbour, form) provide further examples.

## Count method

Deduplicate by report ID, restrict to #4471, join tenant metadata, and run the exported `causeOf`. The 33 reports are day-first tenants using booking-v3 via the form channel. Intake tagged 15 as parser and 18 as hint, so counting intake tags would miss this split. Full membership is in `analysis/hint-report-ids.txt`; `npm run analyze` regenerates it.

## Proposed acceptance criteria

- The date hint, validation and parsing agree with the tenant's date convention.
- Test a day-first locale through booking-v3 with ambiguous dates and a month-first locale as a control.
- Route form-hint reports separately from shared-parser reports even when their subjects match.
- Verify the count against subsequent desk updates before submission.

## Engineering outcome — 5 October 2026

The course desk now records #4471 closed and hint WON'T FIX: booking-v3 form retired.
Close this issue as not planned, not completed: the affected form was retired rather than its
misleading hint repaired. The 33 reports remain part of the historical incident record.
