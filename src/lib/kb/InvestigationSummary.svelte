<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, readAs, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  const unique = uniqueById(reports as Report[]).filter(r => r.mergedInto === 4471);
  const groups = groupByCause(unique, tenantOf);
  const disagreements = groups.reduce((sum, g) => sum + g.reports.filter(r => r.meta.intakeTag !== g.cause).length, 0);
</script>

<p><strong>{reports.length}</strong> exported rows contain <strong>{unique.length}</strong> unique reports;
  <strong>{reports.length - unique.length}</strong> repeated rows are excluded.
  The tenant-based classifier finds <strong>{groups.length}</strong> causes.
  Intake tags disagree with it on <strong>{disagreements}</strong> reports.</p>
<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Tenants</th><th>First received</th><th>Last received</th><th>Intake tags</th><th>One-day notes</th></tr></thead>
  <tbody>
    {#each groups as group (group.cause)}
      <tr>
        <td>{group.cause}</td><td>{group.reports.length}</td><td>{group.tenants}</td>
        <td>{group.firstSeen}</td><td>{group.lastSeen}</td>
        <td>{Object.entries(group.taggedAs).map(([tag, count]) => `${tag}: ${count}`).join('; ')}</td>
        <td>{readAs(group, notes.oneDayMove)}</td>
      </tr>
    {/each}
  </tbody>
</table>
