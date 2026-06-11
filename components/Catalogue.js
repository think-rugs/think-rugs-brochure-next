'use client';

import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS, RANGES, productName, colourLine, searchText, fromPrice } from '@/lib/catalogue';
import { exportSelectionCsv } from '@/lib/export';
import Rail from './Rail';
import RangeSection from './RangeSection';
import ProductModal from './ProductModal';

const SEL_KEY = 'thinkrugs_selection_2026';

export default function Catalogue({ manifest }) {
  // Products enriched with derived fields and image availability.
  const products = useMemo(() => {
    const cut = new Set(manifest.cutout);
    const life = new Set(manifest.lifestyle);
    return PRODUCTS.map((p) => ({
      ...p,
      name: productName(p),
      colourLine: colourLine(p),
      search: searchText(p),
      from: fromPrice(p),
      hasImg: cut.has(p.code),
      hasL2: life.has(p.code),
    }));
  }, [manifest]);

  // Filters. "Photographed only" is the default view.
  const [q, setQ] = useState('');
  const [styleF, setStyleF] = useState('');
  const [colourF, setColourF] = useState('');
  const [imgOnly, setImgOnly] = useState(true);
  const [showTrade, setShowTrade] = useState(true);
  const [selOnly, setSelOnly] = useState(false);
  const [designSel, setDesignSel] = useState({});

  // Selection, persisted to localStorage after mount.
  const [selected, setSelected] = useState(() => new Set());
  const [storageLoaded, setStorageLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEL_KEY);
      if (saved) setSelected(new Set(JSON.parse(saved)));
    } catch (e) {}
    setStorageLoaded(true);
  }, []);
  useEffect(() => {
    if (!storageLoaded) return;
    try { localStorage.setItem(SEL_KEY, JSON.stringify([...selected])); } catch (e) {}
    if (selected.size === 0) setSelOnly(false); // nothing selected, drop the filter
  }, [selected, storageLoaded]);

  const [modalCode, setModalCode] = useState(null);
  const [activeRange, setActiveRange] = useState(null);

  // Which products pass the current filters.
  const visibleCodes = useMemo(() => {
    const term = q.trim().toLowerCase();
    const out = new Set();
    products.forEach((p) => {
      const ds = designSel[p.range] || '';
      const ok = (!term || p.search.includes(term))
        && (!styleF || p.style === styleF)
        && (!colourF || p.c1 === colourF || p.c2 === colourF)
        && (!imgOnly || p.hasImg)
        && (!selOnly || selected.has(p.code))
        && (!ds || p.design === ds);
      if (ok) out.add(p.code);
    });
    return out;
  }, [products, q, styleF, colourF, imgOnly, selOnly, selected, designSel]);

  const rangeVisCounts = useMemo(() => {
    const m = {};
    products.forEach((p) => {
      if (visibleCodes.has(p.code)) m[p.range] = (m[p.range] || 0) + 1;
    });
    return m;
  }, [products, visibleCodes]);

  // Scrollspy: highlight the range in view in the rail and topbar.
  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) setActiveRange(en.target.dataset.range);
      }),
      { rootMargin: '-30% 0px -60% 0px' },
    );
    document.querySelectorAll('.range').forEach((s) => spy.observe(s));
    return () => spy.disconnect();
  }, []);

  const toggleSelect = (code) => setSelected((prev) => {
    const next = new Set(prev);
    if (next.has(code)) next.delete(code); else next.add(code);
    return next;
  });

  // Select (or clear) every product currently shown in a range, honouring filters.
  const toggleRangeSelect = (range) => {
    const vis = products.filter((p) => p.range === range && visibleCodes.has(p.code));
    if (!vis.length) return;
    const allSel = vis.every((p) => selected.has(p.code));
    setSelected((prev) => {
      const next = new Set(prev);
      vis.forEach((p) => { if (allSel) next.delete(p.code); else next.add(p.code); });
      return next;
    });
  };

  const onDesign = (range, d) => setDesignSel((prev) => ({ ...prev, [range]: d }));

  const clearFilters = () => {
    setQ(''); setStyleF(''); setColourF('');
    setImgOnly(true); setSelOnly(false); setDesignSel({});
  };

  // Modal stepping moves through the currently visible products in catalogue order.
  const order = useMemo(() => {
    const vis = products.filter((p) => visibleCodes.has(p.code)).map((p) => p.code);
    if (modalCode && !vis.includes(modalCode)) return products.map((p) => p.code);
    return vis;
  }, [products, visibleCodes, modalCode]);

  const step = (d) => {
    const i = order.indexOf(modalCode);
    if (i === -1 || !order.length) return;
    setModalCode(order[(i + d + order.length) % order.length]);
  };

  const modalProduct = modalCode ? products.find((p) => p.code === modalCode) : null;

  return (
    <div className={showTrade ? '' : 'hide-trade'}>
      <nav className="topbar" aria-label="Ranges">
        {RANGES.map((rm) => {
          const cls = [
            activeRange === rm.name ? 'active' : '',
            (rangeVisCounts[rm.name] || 0) === 0 ? 'dimmed' : '',
          ].filter(Boolean).join(' ');
          return <a key={rm.name} href={`#r-${rm.name}`} className={cls || undefined}>{rm.name}</a>;
        })}
      </nav>

      <div className="shell" id="collection">
        <Rail
          ranges={RANGES}
          rangeVisCounts={rangeVisCounts}
          activeRange={activeRange}
          q={q} onQ={setQ}
          styleF={styleF} onStyle={setStyleF}
          colourF={colourF} onColour={setColourF}
          imgOnly={imgOnly} onImgOnly={setImgOnly}
          showTrade={showTrade} onShowTrade={setShowTrade}
          selOnly={selOnly} onSelOnly={setSelOnly}
          selectedCount={selected.size}
          shown={visibleCodes.size}
          total={products.length}
          onClearFilters={clearFilters}
          onClearSelection={() => setSelected(new Set())}
          onExport={() => exportSelectionCsv(products, selected)}
        />

        <main>
          <div className="intro">
            <p className="eyebrow">New for 2026</p>
            <h2>For every home,<br />a fresh new collection</h2>
            <p>
              Browse the full 2026 launch by range, style, design and colour. Select any product to view
              its colourways, available sizes and pricing. Imagery is being added as ranges are
              photographed: products marked &quot;image to follow&quot; will be updated shortly.
            </p>
          </div>
          {RANGES.map((rm) => (
            <RangeSection
              key={rm.name}
              rm={rm}
              products={products.filter((p) => p.range === rm.name)}
              visibleCodes={visibleCodes}
              selected={selected}
              design={designSel[rm.name] || ''}
              onDesign={onDesign}
              onToggleRangeSelect={toggleRangeSelect}
              onOpen={setModalCode}
              onTogglePick={toggleSelect}
            />
          ))}
        </main>
      </div>

      <ProductModal
        p={modalProduct}
        isSelected={modalProduct ? selected.has(modalProduct.code) : false}
        onTogglePick={toggleSelect}
        onStep={step}
        onClose={() => setModalCode(null)}
      />
    </div>
  );
}
