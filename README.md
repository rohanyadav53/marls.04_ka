# MARLSBORO Group — Website

A multi-page, multilingual marketing site for MARLSBORO Group — manufacturer of
BOPP woven bags, PP woven sacks, and flexible packaging (Velcon Flexible).

## Quick start
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build → dist/
npm run preview
```

## What's here
- **25 routes**, one per nav/footer link (see `src/routes.tsx`).
- **Mega-menu header** (hover + keyboard) with a mobile drawer.
- **17 languages via Google Website Translator** — free, no API key. English is
  the only authored copy (`src/i18n/locales/en.ts`); other languages are
  machine-translated in the browser (`src/i18n/translate.ts`).
- **Lead-capture popup** (Request a Quote) + a contact-page enquiry form, both
  wired to the lead API.
- **Admin portal** at `/admin/` — a second Vite entry, built separately so the
  public site ships none of it.
- Brochure-verified stats; official logo; no client logos; packaging-only imagery.

## Photo slots (drop real photos here)
Every `<ImagePlaceholder>` marks where a real **packaging-industry** photo belongs
(plant, machines, woven fabric, bags, packaging in use — nothing unrelated). To
wire a real image, replace the placeholder with an `<img loading="lazy" alt=…>`
(give `alt` a translatable key). Current slots:

The **homepage is already wired to real photography** — see `src/data/photos.ts`
for the manifest (each entry names the raw shoot file it was cut from) and
`public/photos/` for the web-ready JPEGs. Remaining slots:

| Page | Slot |
|------|------|
| About Us | Story photo |
| About / Vision 2025 | Vision photo |
| Products / Up to 4-Layer | Product photo (see note below) |

### Product & industry photography
Every product and industry page, and both listing pages, read their photo from
`images[0]` in `src/data/catalog.ts`:

- `public/products/<product-slug>.jpg` — 15 products (woven + flexible)
- `public/industries/<industry-slug>.jpg` — all 8 industries

**House standard — hold new shots to it so the set stays cohesive:** studio
render on a *pure white* ground, subject centred with ~6% margin, exported at
**1600×1200 (4:3)**, JPEG ~85. Both page templates render at 4:3 and the
listing cards use `object-contain` on white, so nothing is ever cropped — a
photo that is not on true white will show as a grey box inside a white card.

The September set arrived as PNGs in mixed ratios with off-white / warm-grey
grounds (Zipper, Side-Seal, Spout, D-Cut, Multilayer Rolls). They were
flat-fielded to white, cropped to the subject and re-framed on the common 4:3
canvas. Originals are kept in `marls updated photo sept./` (not deployed).

> **Up to 4-Layer has no photo yet.** `Up to 4-Layer.png` in the September set
> is a printed-circuit-board stack-up diagram (FR4 / prepreg / copper foil), not
> packaging, so it was withheld. The card shows the standard placeholder until a
> real laminate-structure image arrives at `public/products/up-to-4-layer.jpg`
> (then set `images` for that slug in `catalog.ts`).

### Awaiting files — wired, but the asset is not in `public/` yet
These slots are coded and will fill themselves the moment the file lands at the
exact path below. Until then each degrades gracefully (a captioned green plate
for photos, the standard's code in mono for badges) — never a broken-image glyph.

| Path | Used by | Ratio / notes |
|------|---------|---------------|
| `public/iso-9001-badge.jpg` | Certifications cards + footer | square, badge mark |
| `public/iso-14001-badge.jpg` | Certifications cards + footer | square, badge mark |
| `public/iso-45001-badge.jpg` | Certifications cards + footer | square, badge mark |
| `public/iso-22000-badge.jpg` | Certifications cards + footer | square, badge mark |
| `public/brcgs-badge.jpg` | Certifications cards + footer | wordmark, trim whitespace |
| `public/photos/sorting-line.jpg` | I AM RECYCLABLE — rebirth process | 16:9 @ 1600w |
| `public/photos/recycled-granules.jpg` | I AM RECYCLABLE — rPP explainer | 3:2 @ 1400w |
| `public/photos/finished-goods-warehouse.jpg` | I AM RECYCLABLE — full-bleed band | 16:9 @ 1920w, keep the left third quiet (text sits over it) |

Badge artwork can be a transparent PNG or a JPEG on white — either works. Every
badge renders inside a true-white circular coin (certifications cards) or tile
(footer), so a white-ground JPEG has no visible seam and a transparent PNG
renders crisp; neither needs a blend-mode trick. **Match the file extension in
the table exactly** — a `.jpeg` saved where the code expects `.jpg` (or vice
versa) 404s silently and the slot just falls back to its placeholder.

## Before launch — open items
1. **SSG pre-render** — add `vite-react-ssg` so each route ships static HTML
   (the app is structured as a plain route array to make this a small change).
2. **Favicons** — `favicon.svg` is wired; generate PNG fallbacks
   (`favicon-32/16`, `apple-touch-icon` 180×180) + `site.webmanifest` from the mark.
3. ~~**Enquiry form endpoint**~~ — done. The form posts to the in-house PHP
   lead API; see "Lead management" below.
4. ~~**Google Map**~~ — done. `SITE.mapEmbedUrl` embeds the Google Business
   listing (MARLSBORO INDUSTRIES LLP (UNIT II)) by its CID, so the map shows
   the business card rather than a bare coordinate pin. Share link for humans
   is `SITE.mapLink`.
5. **Certifications** — currently shown as "to be confirmed" placeholders; replace
   with the certificates the client actually holds (and badge art).
6. **Translations** — machine translation only. Skim the key pages (Home,
   Products, Contact) in Hindi and one European language: brand/technical terms in
   running text can be rewritten. English is labelled "authoritative" in the menu.

## Lead management

Enquiries are stored in MySQL, emailed to the sales inbox immediately, and
summarised in a weekly Friday report. The backend is plain PHP 8 + PDO so it
runs on the existing CWP hosting — no Node process, no Composer.

```
EnquiryForm / LeadPopup  →  POST /api/leads.php  →  MySQL
                                                 →  SMTP notification
                                    /admin/  ←  session-authenticated API
                                    Friday cron  →  weekly report + CSV/XLSX
```

- `backend/` — the PHP API, schema, email templates, cron and setup scripts.
  Start with [backend/README.md](backend/README.md).
- `src/admin/` — the admin portal (React, separate `admin/index.html` entry →
  `dist/admin/`).
- `src/lib/api.ts` — the public site's only backend contact point.
- [CWP_DEPLOYMENT.md](CWP_DEPLOYMENT.md) — step-by-step server setup.
- [TESTING.md](TESTING.md) — the test matrix and what has been verified.

`npm run build` produces both apps: `dist/index.html` (site) and
`dist/admin/index.html` (portal).

Secrets never live in this repository or in the frontend — the database and SMTP
credentials sit in a PHP file outside `public_html`. See `.env.example` for the
one frontend variable (`VITE_API_BASE_URL`), which is only needed locally.

See [CLAUDE.md](CLAUDE.md) for architecture and the non-negotiable content rules.
