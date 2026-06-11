'use client';

import { gbp } from '@/lib/catalogue';
import { Tick, Placeholder } from './icons';

export default function ProductCard({ p, visible, isSelected, onOpen, onTogglePick }) {
  const sizesLabel = `${p.sizes.length} size${p.sizes.length !== 1 ? 's' : ''}`;
  return (
    <article
      className={`card${isSelected ? ' selected' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={`View ${p.name}`}
      style={visible ? undefined : { display: 'none' }}
      onClick={() => onOpen(p.code)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) {
          e.preventDefault();
          onOpen(p.code);
        }
      }}
    >
      <div className="card-media">
        {p.hasImg ? (
          <img loading="lazy" src={`/images/cutout/${p.code}.jpg`} alt={`${p.name} rug`} />
        ) : (
          <Placeholder code={p.code} />
        )}
        {p.wash ? <span className="badge">Washable</span> : null}
        <button
          className="pick"
          type="button"
          aria-pressed={isSelected}
          aria-label={`${isSelected ? 'Remove' : 'Add'} ${p.name} ${isSelected ? 'from' : 'to'} my selection`}
          title={isSelected ? 'Remove from my selection' : 'Add to my selection'}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePick(p.code);
          }}
        >
          <Tick />
        </button>
      </div>
      <div className="card-body">
        <span className="card-code">{p.code}</span>
        <h4>{p.range} {p.design}</h4>
        <p>{p.colourLine}</p>
        <div className="card-foot">
          <span>{sizesLabel}</span>
          <span className="frm">From <b>{gbp(p.from)}</b> <i>trade</i></span>
        </div>
      </div>
    </article>
  );
}
