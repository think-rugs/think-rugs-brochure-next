'use client';

import { gbp } from '@/lib/catalogue';
import ProductCard from './ProductCard';

export default function RangeSection({
  rm, products, visibleCodes, selected,
  design, onDesign, onToggleRangeSelect,
  onOpen, onTogglePick,
}) {
  const visList = products.filter((p) => visibleCodes.has(p.code));
  const visCount = visList.length;
  const allSelected = visCount > 0 && visList.every((p) => selected.has(p.code));
  const mats = (rm.m1 || '') + (rm.m2 ? ` and ${rm.m2}` : '');
  const showChips = rm.designs.length > 1;

  return (
    <section
      className="range"
      id={`r-${rm.name}`}
      data-range={rm.name}
      style={visCount ? undefined : { display: 'none' }}
    >
      <header className="range-head">
        <div className="range-title">
          <h2>{rm.name}</h2>
          <span className="range-count">
            <b className="cnt">{visCount}</b> colourways, {rm.variants} product options
          </span>
          <button
            className={`selall${allSelected ? ' on' : ''}`}
            type="button"
            disabled={visCount === 0}
            onClick={() => onToggleRangeSelect(rm.name)}
          >
            {allSelected ? 'Deselect all' : 'Select all'}
          </button>
        </div>
        <p className="range-meta">
          <b>{rm.styles.join(' and ')}</b> &middot; {rm.construction} &middot; {mats}
          <span className="range-from"> &middot; From <b>{gbp(rm.from)}</b> trade</span>
        </p>
        <div className="feats">
          {rm.feats.map((f) => <span className="feat" key={f}>{f}</span>)}
          {rm.wash ? <span className="feat wash">Washable</span> : null}
        </div>
        {showChips ? (
          <div className="dchips" role="group" aria-label={`Filter ${rm.name} by design`}>
            <span>Designs:</span>
            <button
              className={`chip dchip${!design ? ' active' : ''}`}
              type="button"
              onClick={() => onDesign(rm.name, '')}
            >
              All
            </button>
            {rm.designs.map((d) => (
              <button
                key={d}
                className={`chip dchip${design === d ? ' active' : ''}`}
                type="button"
                onClick={() => onDesign(rm.name, d)}
              >
                {d}
              </button>
            ))}
          </div>
        ) : null}
      </header>
      <div className="grid">
        {products.map((p) => (
          <ProductCard
            key={p.code}
            p={p}
            visible={visibleCodes.has(p.code)}
            isSelected={selected.has(p.code)}
            onOpen={onOpen}
            onTogglePick={onTogglePick}
          />
        ))}
      </div>
    </section>
  );
}
