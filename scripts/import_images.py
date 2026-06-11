"""
import_images.py

Routine job: add new product imagery to the brochure site.
Drop new JPGs in a folder, run this, and the images land in public/images/
already resized. In dev they appear on refresh; for production run
`npm run build` to bake the updated image manifest into the static export.

Naming convention (must match exactly, case sensitive):
  {PRODUCT_CODE}_CO1.jpg   cutout / pack shot   (shown first in the gallery)
  {PRODUCT_CODE}_L2.jpg    lifestyle room shot  (shown second in the gallery)

PRODUCT_CODE is the colourway level code (no size suffix), e.g. APOLK406CRMBGE.

Usage:
  python3 scripts/import_images.py /path/to/folder/of/jpgs
  python3 scripts/import_images.py /path/to/folder --force   (overwrite existing)

If no folder is given it defaults to ./incoming_images.
Existing images are skipped unless --force is passed, so it is safe to re run.
Codes are checked against data/product_data.json and any that do not match are
flagged (they will not appear until the data is updated to include them).

Requires Pillow: pip install pillow
"""

import sys, os, glob, json
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUTOUT_DIR = os.path.join(ROOT, 'public', 'images', 'cutout')
LIFESTYLE_DIR = os.path.join(ROOT, 'public', 'images', 'lifestyle')
PRODUCT_DATA = os.path.join(ROOT, 'data', 'product_data.json')

# Resize settings, kept identical to the original brochure so sizing stays consistent.
CUTOUT_MAX = (640, 920)    # portrait pack shot
LIFESTYLE_MAX = (760, 760)
QUALITY = 68

def convert(src, dest, max_size):
    im = Image.open(src).convert('RGB')
    im.thumbnail(max_size)
    im.save(dest, 'JPEG', quality=QUALITY, optimize=True)
    return os.path.getsize(dest)

def main():
    args = [a for a in sys.argv[1:] if a != '--force']
    force = '--force' in sys.argv
    folder = args[0] if args else os.path.join(ROOT, 'incoming_images')
    if not os.path.isdir(folder):
        print('Folder not found:', folder)
        print('Create it and add your JPGs, or pass a path: python3 scripts/import_images.py /path/to/jpgs')
        return

    os.makedirs(CUTOUT_DIR, exist_ok=True)
    os.makedirs(LIFESTYLE_DIR, exist_ok=True)
    valid = {p['code'] for p in json.load(open(PRODUCT_DATA))['products']}

    added = skipped = 0
    unmatched = []

    for suffix, dest_dir, max_size, tag in (
        ('_CO1.jpg', CUTOUT_DIR, CUTOUT_MAX, 'CO1'),
        ('_L2.jpg', LIFESTYLE_DIR, LIFESTYLE_MAX, 'L2 '),
    ):
        for f in sorted(glob.glob(os.path.join(folder, '*' + suffix))):
            code = os.path.basename(f).replace(suffix, '')
            dest = os.path.join(dest_dir, code + '.jpg')
            if os.path.exists(dest) and not force:
                skipped += 1
                continue
            nbytes = convert(f, dest, max_size)
            added += 1
            flag = '' if code in valid else '  <-- NOT IN PRODUCT DATA'
            if code not in valid:
                unmatched.append(code)
            print(f'{tag}  {code}  {nbytes // 1024} KB{flag}')

    co = len(glob.glob(os.path.join(CUTOUT_DIR, '*.jpg')))
    l2 = len(glob.glob(os.path.join(LIFESTYLE_DIR, '*.jpg')))
    print()
    print(f'Added {added}. Skipped {skipped} already present (pass --force to overwrite).')
    print(f'Totals now: {co} cutouts, {l2} lifestyles, {len(valid)} colourways in data.')
    if unmatched:
        print('Codes with no matching product (will not show until data is updated):')
        for c in sorted(set(unmatched)):
            print('  ', c)
    print('Next step: refresh the dev server, or npm run build for production.')

if __name__ == '__main__':
    main()
