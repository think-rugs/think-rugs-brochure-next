import data from '@/data/product_data.json';

export const PRODUCTS = data.products;
export const RANGES = data.ranges;

// Price formatters, kept identical to the original brochure:
// gbp adds thousands separators (range meta, card "from" price),
// gb is the plain table-cell format.
export const gbp = (v) =>
  v == null ? '' : '£' + v.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const gb = (v) => (v == null ? '' : '£' + v.toFixed(2));

export const productName = (p) => `${p.range} ${p.design} ${p.c1}${p.c2 ? ` / ${p.c2}` : ''}`;
export const colourLine = (p) => `${p.c1}${p.c2 ? ` / ${p.c2}` : ''}`;

export const searchText = (p) =>
  [p.range, p.design, p.code, p.c1, p.c2, p.style].filter(Boolean).join(' ').toLowerCase();

export const fromPrice = (p) => {
  const ws = p.sizes.map((s) => s.ws).filter((v) => v != null);
  return ws.length ? Math.min(...ws) : null;
};

export const STYLES = [...new Set(PRODUCTS.map((p) => p.style).filter(Boolean))].sort();
export const COLOURS = [...new Set(PRODUCTS.flatMap((p) => [p.c1, p.c2]).filter(Boolean))].sort();

export const TOTALS = {
  ranges: RANGES.length,
  colourways: PRODUCTS.length,
  options: PRODUCTS.reduce((n, p) => n + p.sizes.length, 0),
};
