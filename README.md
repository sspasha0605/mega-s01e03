# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.


## S01E03 investigation

The review source is `src/routes/kb/incidents/4471-review/+page.svx`.
The actual prerendered page is `build/kb/incidents/4471-review/index.html`;
serve the whole `build/` folder so its CSS and interactive assets resolve.
The page includes computed cause counts, the received/merged chart,
deduplication examples, and a signature-derived desk reference.

Run `npm ci`, `npm run analyze`, and `npm run build` to reproduce it.
Use `npm run preview` to inspect the generated site.

Issue drafts are in `issues/`. Exact report membership and weekly counts
are in `analysis/`. The accepted decision 0001 is preserved unchanged.
Decision 0002 is a proposal, not a claim of adoption by the desk.
The export is dated 4 October 2026; live desk updates must be checked
before treating its counts as current.
