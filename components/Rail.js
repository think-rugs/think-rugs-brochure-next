'use client';

import { STYLES, COLOURS } from '@/lib/catalogue';
import { Mark } from './icons';

export default function Rail({
  ranges, rangeVisCounts, activeRange,
  q, onQ, styleF, onStyle, colourF, onColour,
  imgOnly, onImgOnly, showTrade, onShowTrade, selOnly, onSelOnly,
  selectedCount, shown, total,
  onClearFilters, onClearSelection, onExport,
}) {
  return (
    <aside className="rail" aria-label="Browse and filter">
      <div className="brand"><Mark /><b>THINK&thinsp;RUGS</b></div>
      <p className="sub">New Products 2026</p>

      <h3>Find a product</h3>
      <div className="ctl">
        <label htmlFor="q">Search</label>
        <input
          id="q" type="search" placeholder="Range, design, code or colour"
          value={q} onChange={(e) => onQ(e.target.value)}
        />
      </div>
      <div className="ctl">
        <label htmlFor="fstyle">Style</label>
        <select id="fstyle" value={styleF} onChange={(e) => onStyle(e.target.value)}>
          <option value="">All styles</option>
          {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="ctl">
        <label htmlFor="fcolour">Colour</label>
        <select id="fcolour" value={colourF} onChange={(e) => onColour(e.target.value)}>
          <option value="">All colours</option>
          {COLOURS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={imgOnly} onChange={(e) => onImgOnly(e.target.checked)} /> Photographed only
      </label>
      <label className="toggle">
        <input type="checkbox" checked={showTrade} onChange={(e) => onShowTrade(e.target.checked)} /> Show trade prices
      </label>
      <label className="toggle">
        <input type="checkbox" checked={selOnly} onChange={(e) => onSelOnly(e.target.checked)} /> My selection only{' '}
        <span className={`selcount${selectedCount === 0 ? ' empty' : ''}`}>{selectedCount}</span>
      </label>
      {selectedCount > 0 ? (
        <button className="dl" type="button" onClick={onExport}>Export selection (CSV)</button>
      ) : null}
      <div className="selrow">
        <button className="clear" type="button" onClick={onClearFilters}>Clear filters</button>
        {selectedCount > 0 ? (
          <button className="clear" type="button" onClick={onClearSelection}>Clear selection</button>
        ) : null}
      </div>
      <p className="results">{shown} of {total} colourways shown</p>
      <a className="dl" href="/downloads/Think_Rugs_Product_Info_2026.xlsx" download>
        Download full product info (Excel)
      </a>

      <h3>Ranges</h3>
      <nav className="rlinks" aria-label="Ranges">
        {ranges.map((rm) => {
          const vis = rangeVisCounts[rm.name] || 0;
          const cls = ['rlink',
            activeRange === rm.name ? 'active' : '',
            vis === 0 ? 'dimmed' : ''].filter(Boolean).join(' ');
          return (
            <a key={rm.name} href={`#r-${rm.name}`} className={cls}>
              <span>{rm.name}</span><small className="rcount">{vis}</small>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
