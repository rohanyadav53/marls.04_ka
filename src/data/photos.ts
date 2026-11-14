/* Site photography (client's ENHANCED shoot, July 2026).
 *
 * Files live in `public/photos/` and are served from `/photos/…`, so a path here
 * is a plain URL — no import, no bundler hashing. Each entry records the raw
 * file it was cut from (`drive-download-20260728T122957Z-1-001/`) so a
 * replacement can be re-cut from the same original.
 *
 * Client rule: imagery is packaging-industry only, and no named client brands.
 * `flexoPress` and `bagConversion` still show faint UltraTech-printed fabric —
 * cropped as tightly as the frames allow, illegible at tile size, but flagged.
 */

export const PHOTOS = {
  /** Loom hall, wide — hero 1 + facility lead.  raw: `3 copy Enhanced (LOOMS).png` */
  weavingHall: "/photos/weaving-hall.jpg",
  /** Circular loom, tape cone — hero 2.         raw: `2 copy enhanced.JPG` */
  circularLoom: "/photos/circular-loom.jpg",
  /** Plant exterior at dusk — hero 3.           raw: `Marlsboro Factory Scene.png` */
  facilityExterior: "/photos/facility-exterior.jpg",
  /** Tape extrusion line (portrait) — about.    raw: `TAPE LINE ENHANCE.png` */
  tapeLine: "/photos/tape-line.jpg",
  /** Extrusion coating laminator — tile.        raw: `2 ENHANCED.png` */
  laminationLine: "/photos/lamination-line.jpg",
  /** Flexographic press — tile.                 raw: `1 enhanced.png` */
  flexoPress: "/photos/flexo-press.jpg",
  /** Automatic bag conversion — tile.           raw: `4 enhanced.png` */
  bagConversion: "/photos/bag-conversion.jpg",
  /** 1 MW rooftop solar, 4:3 — homepage.        raw: `solar panels enhanced.png` */
  solarPlant: "/photos/solar-plant.jpg",
  /** Same frame, 3:2 — I AM RECYCLABLE hero.    raw: `solar panels enhanced.png` */
  solarPlantWide: "/photos/solar-plant-wide.jpg",

  /* ---- I AM RECYCLABLE set (client supplied, Aug 2026) ----
   * These three are NOT in `public/photos/` yet — drop them in at these exact
   * names and every slot below fills itself. Until then each one degrades to a
   * captioned green plate rather than a broken-image glyph. */

  /** MRF conveyor, operators splitting PP woven from flexible film — 16:9.
   *  Leads "the rebirth process"; it literally shows step one. */
  sortingLine: "/photos/sorting-line.jpg",
  /** Reprocessed granules spilling from a woven sack — 3:2.
   *  The rPP explainer visual. */
  recycledGranules: "/photos/recycled-granules.jpg",
  /** Finished-goods warehouse, own-brand sacks with the recycle mark — 16:9.
   *  Full-bleed statement band; wants headroom, the text sits over its left third. */
  finishedGoods: "/photos/finished-goods-warehouse.jpg",
} as const;

/* Re-cutting an image: originals are in `drive-download-20260728T122957Z-1-001/`.
 * Crop to the ratio below, resize to the width below, save progressive JPEG q82.
 *   hero slides ....... 16/9 @ 1920w  (loom hall is 1264w native — not upscaled)
 *   about portrait .... 4/5  @ 1085w
 *   facility lead ..... 16/9 @ 1400w
 *   facility tiles .... 4/3  @ 1000w
 *   solar ............. 4/3 @ 1400w  and  3/2 @ 1448w
 */
