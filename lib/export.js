// Browser download helpers, ported from the single-file brochure.

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 0);
}

function csvCell(v) {
  v = v == null ? '' : String(v);
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}

// One row per size, catalogue order. Columns mirror the source spreadsheet
// (variant code and description included, no Washable column).
export function exportSelectionCsv(products, selected) {
  if (!selected.size) return;
  const head = ['Product Code', 'Variant Code', 'Variant Description', 'Range', 'Design', 'Colour', 'Style',
                'Size (cm)', 'Approx', 'Wholesale Price (GBP)', 'RRP (GBP)'];
  const lines = [head.map(csvCell).join(',')];
  products.forEach((p) => {
    if (!selected.has(p.code)) return;
    const colour = p.c1 + (p.c2 ? '/' + p.c2 : '');
    p.sizes.forEach((s) => {
      lines.push(
        [p.code, s.vcode || '', s.vdesc || '', p.range, p.design, colour, p.style,
         s.size || '', s.approx || '',
         s.ws == null ? '' : s.ws, s.rrp == null ? '' : s.rrp].map(csvCell).join(','),
      );
    });
  });
  // BOM so Excel reads pound signs and UTF-8 cleanly.
  const csv = '\ufeff' + lines.join('\r\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'Think_Rugs_My_Selection.csv');
}
