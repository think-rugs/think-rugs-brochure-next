'use client';

import { useEffect, useRef, useState } from 'react';
import { gb } from '@/lib/catalogue';
import { Placeholder } from './icons';

const GLABELS = ['Product', 'Lifestyle', 'Detail'];

export default function ProductModal({ p, isSelected, onTogglePick, onStep, onClose }) {
  const dialogRef = useRef(null);
  const infoRef = useRef(null);
  const touchX = useRef(null);
  const [gIdx, setGIdx] = useState(0);

  const open = !!p;
  const imgs = [];
  if (p?.hasImg) imgs.push({ src: `/images/cutout/${p.code}.jpg`, label: GLABELS[0] });
  if (p?.hasL2) imgs.push({ src: `/images/lifestyle/${p.code}.jpg`, label: imgs.length ? GLABELS[1] : GLABELS[0] });
  const multi = imgs.length > 1;

  // Keep the native <dialog> element in sync with React state.
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Reset gallery and scroll when the product changes.
  useEffect(() => {
    setGIdx(0);
    if (infoRef.current) infoRef.current.scrollTop = 0;
  }, [p?.code]);

  const gStep = (d) => {
    if (imgs.length < 2) return;
    setGIdx((i) => (i + d + imgs.length) % imgs.length);
  };

  if (!p) {
    return <dialog ref={dialogRef} aria-label="Product detail" onClose={onClose} />;
  }

  const cols = p.c1 + (p.c2 ? ' / ' + p.c2 : '');
  const spec = [
    ['Style', p.style],
    ['Construction', p.construction],
    ['Material', (p.m1 || '') + (p.m2 ? ' and ' + p.m2 : '')],
    ['Room', p.room],
    ['Pile height', p.pile ? p.pile + ' cm' : null],
    ['Washable', p.wash ? 'Yes' : null],
  ].filter((x) => x[1]);
  const cur = imgs[gIdx];

  return (
    <dialog
      ref={dialogRef}
      aria-label="Product detail"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialogRef.current) dialogRef.current.close(); }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') gStep(1);
        if (e.key === 'ArrowLeft') gStep(-1);
      }}
    >
      <button className="modal-close" aria-label="Close" onClick={() => dialogRef.current.close()}>&times;</button>
      <div className="modal">
        <div
          className="modal-media"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) gStep(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          {cur ? (
            <>
              <img src={cur.src} alt={`Product image ${gIdx + 1} of ${imgs.length}`} />
              <span className="glabel">{cur.label}</span>
              {multi ? (
                <>
                  <button className="gnav prev" aria-label="Previous image" onClick={() => gStep(-1)}>&larr;</button>
                  <button className="gnav next" aria-label="Next image" onClick={() => gStep(1)}>&rarr;</button>
                  <div className="gdots">
                    {imgs.map((_, i) => <i key={i} className={i === gIdx ? 'on' : ''} />)}
                  </div>
                  <span className="gcount">{gIdx + 1} / {imgs.length}</span>
                </>
              ) : null}
            </>
          ) : (
            <Placeholder />
          )}
        </div>
        <div className="modal-info" ref={infoRef}>
          <span className="mcode">{p.code}</span>
          <h3>{p.range} {p.design}</h3>
          <p className="mcols">{cols}</p>
          <button
            className={`mpick${isSelected ? ' on' : ''}`}
            aria-pressed={isSelected}
            onClick={() => onTogglePick(p.code)}
          >
            {isSelected ? '\u2713 In my selection' : '+ Add to my selection'}
          </button>
          <div className="feats">
            {p.feats.map((f) => <span className="feat" key={f}>{f}</span>)}
          </div>
          <dl className="spec">
            {spec.map(([dt, dd]) => (
              <div key={dt} style={{ display: 'contents' }}><dt>{dt}</dt><dd>{dd}</dd></div>
            ))}
          </dl>
          <table>
            <thead>
              <tr><th>Size (cm)</th><th>Approx</th><th className="col-ws">Wholesale</th><th>RRP</th></tr>
            </thead>
            <tbody>
              {p.sizes.map((s, i) => (
                <tr key={i}>
                  <td>{s.size || ''}</td>
                  <td>{s.approx || ''}</td>
                  <td className="col-ws">{gb(s.ws)}</td>
                  <td>{gb(s.rrp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="trade-note">Wholesale prices are trade prices in GBP.</p>
          <div className="modal-nav">
            <button onClick={() => onStep(-1)}>&larr; Previous</button>
            <button onClick={() => onStep(1)}>Next &rarr;</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
