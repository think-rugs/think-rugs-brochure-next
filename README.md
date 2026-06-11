# Think Rugs New Products Brochure (Next.js)

The Think Rugs trade brochure as a Next.js site. This replaces the single file
HTML build for hosted use: images are served as separate files and loaded on
demand, so the page loads fast and the project scales to the full catalogue.
The previous single file generator still exists in the old project and remains
the right tool for emailable, fully offline copies.

## What it serves

A single page brochure with:

- a full screen brand cover with launch stats
- a left rail with search, style and colour filters, a "Photographed only" toggle (the default view), a "Show trade prices" toggle, a "My selection only" filter, and live range navigation with counts
- one section per range with meta line, feature chips, per range design filter chips, a Select all button, and a grid of product cards
- a product detail modal with an image gallery (cutout then lifestyle), full spec, and a size and pricing table
- a retailer selection tool: tick products on cards or in the modal, selection persists in the browser, with CSV export (one row per size, including variant code and description)
- a download link for the full product info Excel file
- branded "image to follow" placeholders for products not yet photographed

## Setup

Node 18.18 or newer is required (any current LTS is fine).

```
npm install
npm run dev        development server at http://localhost:3000
```

For production:

```
npm run build      writes a fully static site to out/
npm run preview    serve out/ locally to check it
```

The `out/` folder is a plain static site: host it on Vercel, Netlify, S3, or
any web server. No Node server is needed in production. (If server features
are ever wanted, API routes, incremental updates, a CMS, remove the
`output: 'export'` line in `next.config.mjs` and deploy as a normal Next app.)

## Folder layout

```
app/                    layout, page, global stylesheet
components/             Catalogue (state), Rail, RangeSection, ProductCard, ProductModal, icons
lib/                    catalogue data helpers, CSV export
data/product_data.json  the product catalogue (maintained, same shape as before)
public/
  images/cutout/        {CODE}.jpg pack shots, 640 x 920 max
  images/lifestyle/     {CODE}.jpg room shots, 760 max
  images/logo.jpg       the brand logo lockup
  downloads/            the full product info Excel file offered for download
scripts/
  import_images.py      routine job: resize new JPGs into public/images
  extract_data.py       refresh job: rebuild product_data.json from the xlsx
source/                 the source spreadsheet for data refreshes
incoming_images/        drop new JPGs here for import_images.py
```

Image availability is detected automatically: the page checks which codes have
files in `public/images` at build time (and per request in dev). There is no
image cache file to maintain any more.

## Routine job 1: adding imagery

1. Name files by Product Code (colourway level, no size suffix), case sensitive:
   `{CODE}_CO1.jpg` for the cutout, `{CODE}_L2.jpg` for the lifestyle shot.
2. Drop them in `incoming_images/` (or any folder).
3. Run:
   ```
   python3 scripts/import_images.py incoming_images
   ```
   It resizes into `public/images` (same settings as before: cutouts fit
   640 x 920, lifestyles 760, JPEG quality 68), skips existing files unless you
   pass `--force`, and flags codes not present in the product data.
4. In dev, just refresh. For production, `npm run build` and redeploy.

Requires Pillow: `pip install pillow`.

## Routine job 2: refreshing the product data

1. Put the new workbook in `source/` (or pass its path).
2. Run:
   ```
   python3 scripts/extract_data.py source/Think_Rugs_New_Products_XXXX.xlsx
   ```
   Same parsing rules as before: Range and Design parsed from the Description,
   variant code and description captured per size, "from" price is the lowest
   wholesale per range. Requires openpyxl.
3. Rebuild and redeploy.

The same caveat applies as before: if the spreadsheet has blank Material or
Construction cells for newer ranges, those blanks carry through. The shipped
`data/product_data.json` has them filled in, so eyeball the range meta lines
after any refresh.

Also update `public/downloads/` whenever a new product info file should be
offered to customers (keep the filename or update the links in
`components/Rail.js` and `app/page.js`).

## Brand and design reference

- Palette: sage `#749981`, deep sage `#587a66`, dark sage `#3f5c4b`, sage tint `#eef3ef`, ink `#2c332e`.
- Typeface: Poppins (loaded from Google Fonts).
- The wavy rug logo mark is an inline SVG traced from the real logo, used in the nav and image placeholders. The cover and footer use the real logo image.
- The product modal uses a fixed height so every product opens at the same size.
- Copy style: no em dashes or long hyphens anywhere, only commas, colons, parentheses, and full stops.

## Notes on the conversion

- The selection still persists in `localStorage` under `thinkrugs_selection_2026`. Selections are per browser and per site origin.
- The CSV export and Excel download behave exactly as in the single file version, except the Excel file is now a plain static download rather than embedded base64.
- All filtering, the design chips, select all per range, scrollspy, gallery swipe, and keyboard support carry over.
