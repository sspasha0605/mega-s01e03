import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { uniqueById, groupByCause, dayFirst, readAs } from '../src/lib/kb/causes.ts';
const root = fileURLToPath(new URL('../', import.meta.url));
const data = root + 'src/lib/data/';
const read = path => JSON.parse(readFileSync(data + path, 'utf8'));
const rows = read('reports-4471.json');
const tenants = new Map(readdirSync(data + 'tenants').map(f => {
  const t = read('tenants/' + f); return [t.handle, t];
}));
const notes = read('desk-notes.json');
const reports = uniqueById(rows).filter(r => r.mergedInto === 4471);
const groups = groupByCause(reports, r => tenants.get(r.tenant));
const counts = groups.map(g => ({
  cause: g.cause, reports: g.reports.length, tenants: g.tenants,
  taggedAs: g.taggedAs, firstSeen: g.firstSeen, lastSeen: g.lastSeen,
  oneDayMove: readAs(g, notes.oneDayMove), ids: g.reports.map(r => r.id)
}));
const weeks = new Map();
const start = Date.parse('2026-03-30');
for (const r of reports) {
  for (const [key, field] of [['received', 'receivedAt'], ['merged', 'mergedAt']]) {
    if (!r[field]) continue;
    const week = Math.floor((Date.parse(r[field].slice(0, 10)) - start) / 604800000);
    const row = weeks.get(week) ?? { week: new Date(start + week * 604800000).toISOString().slice(0, 10), received: 0, merged: 0 };
    row[key]++; weeks.set(week, row);
  }
}
const result = {
  rawRows: rows.length, uniqueReports: reports.length,
  repeatedRows: rows.length - reports.length,
  allTenantLocalesDayFirst: [...tenants.values()].every(t => dayFirst(t.locale)),
  groups: counts,
  oneDayReports: reports.filter(r => notes.oneDayMove.includes(r.id)),
  weeks: [...weeks.entries()].sort(([a], [b]) => a - b).map(([, r]) => r)
};
mkdirSync(root + 'analysis', { recursive: true });
writeFileSync(root + 'analysis/counts.json', JSON.stringify(result, null, 2) + '\n');
for (const g of counts) writeFileSync(root + `analysis/${g.cause}-report-ids.txt`, g.ids.join('\n') + '\n');
console.log(JSON.stringify({ rawRows: result.rawRows, uniqueReports: reports.length, repeatedRows: result.repeatedRows, groups: counts.map(({ids, ...g}) => g) }, null, 2));
