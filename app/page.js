import fs from 'fs';
import path from 'path';
import Catalogue from '@/components/Catalogue';
import { TOTALS } from '@/lib/catalogue';

// Build-time image manifest: which colourways have a cutout and a lifestyle shot.
// In dev this re-reads on request, so newly imported images appear on refresh.
// In a production static export it is baked in at build time.
function listCodes(dir) {
  try {
    return fs.readdirSync(path.join(process.cwd(), 'public', 'images', dir))
      .filter((f) => f.toLowerCase().endsWith('.jpg'))
      .map((f) => f.replace(/\.jpg$/i, ''));
  } catch {
    return [];
  }
}

export default function Page() {
  const manifest = { cutout: listCodes('cutout'), lifestyle: listCodes('lifestyle') };

  return (
    <>
      <section className="cover" id="top">
        <img className="logo" src="/images/logo.jpg" alt="Think Rugs, for every home" />
        <p className="eyebrow">Trade Presentation</p>
        <h1>New Products 2026<span>Our newest ranges, designs and colourways</span></h1>
        <div className="stats">
          <div className="stat"><b>{TOTALS.ranges}</b><small>New Ranges</small></div>
          <div className="stat"><b>{TOTALS.colourways}</b><small>Colourways</small></div>
          <div className="stat"><b>{TOTALS.options}</b><small>Product Options</small></div>
        </div>
        <a className="enter" href="#collection">Explore the collection</a>
        <span className="hint">For every home</span>
      </section>

      <Catalogue manifest={manifest} />

      <footer>
        <img className="logo" src="/images/logo.jpg" alt="Think Rugs, for every home" />
        <p><a href="https://www.thinkrugs.co.uk">thinkrugs.co.uk</a></p>
        <p className="dlfoot">
          <a href="/downloads/Think_Rugs_Product_Info_2026.xlsx" download>
            Download the full product info file (Excel)
          </a>
        </p>
        <p>New Products 2026 trade presentation. Prices shown in GBP. Specifications subject to confirmation.</p>
      </footer>
    </>
  );
}
