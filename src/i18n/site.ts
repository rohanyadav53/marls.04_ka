// Non-translatable constants. Verified against the company brochure
// (Company Profile, 12 pp.) — these stay identical in every language.

export const SITE = {
  brand: "MARLSBORO Group",
  legalEntity: "Marlsboro Industries LLP",
  flexibleEntity: "Velcon Flexible LLP",

  founder: "Devesh Yadav",

  email: "info@marlsboro.com",
  exportEmail: "export@marlsboro.com",
  careersEmail: "careers@marlsboro.com",
  phone: "+91 98878 11121",
  phoneHref: "tel:+919887811121",
  website: "www.marlsboro.com",
  websiteUrl: "https://www.marlsboro.com",
  linkedin: "https://www.linkedin.com/in/devesh-yadav-91286a2a6/",
  linkedinHandle: "Devesh Yadav",

  // Registered address (brochure back cover)
  addressLines: [
    "Marlsboro Industries LLP",
    "Rampura-Raithal Road, State Highway 19",
    "Vill. Jahota, Dist. Jaipur Rural",
    "Rajasthan 303701, India",
  ],
  // The embed points at the Google Business listing itself — "MARLSBORO
  // INDUSTRIES LLP (UNIT II)" — via its CID, so the map shows the named
  // business card (photo, rating, hours, website) rather than a pin.
  //
  // `cid` is the place's own id, in decimal: 4993775734747952902 is
  // 0x454d7492959df706, read off the listing's Maps URL
  // (…!1s0x396c55e09e4a636f:0x454d7492959df706…). Two things that do NOT work
  // here and were tried first: a `q=<lat>,<lng>` query renders a bare
  // coordinate pin ("27°06'34.4\"N 75°41'01.7\"E") with no business details,
  // and a `q=<place name>` search drifts back to the Jahota village centroid.
  // If the listing is ever recreated, re-read the CID from its Maps URL.
  mapEmbedUrl: "https://www.google.com/maps?cid=4993775734747952902&output=embed",
  // Human-facing share link, for "open in Google Maps" / directions.
  mapLink: "https://maps.app.goo.gl/GknVFmBtXNXdjW3w7",

  brochurePath: "/brochure/Marlsboro-Company-Profile.pdf",
} as const;

// Headline stats — figures verified in the brochure. Three figures, so the
// band divides evenly into thirds (the 55-loom metric was retired at the
// client's request; the figure still stands in the facility prose).
//   12+   : polymer business since 2014 → 12+ years' experience (per client)
//   84M   : "the Group produces over 84 million bags annually" (Company Profile
//           FinalDRAFT, Executive Summary p.3 — supersedes the earlier 45M figure)
//   30M   : "average of 30 million woven sacks per year" (p.4) — the woven-sack
//           share of the group total, i.e. Marlsboro Industries LLP only.
export const STATS = [
  { value: 12, display: "12", prefix: "", suffix: "+", key: "experience" },
  { value: 84, display: "84", prefix: "", suffix: "M", key: "capacity" },
  { value: 30, display: "30", prefix: "", suffix: "M", key: "production" },
] as const;

export type StatKey = (typeof STATS)[number]["key"];

/* ---------------- Certification badge artwork ----------------
 * Artwork is not translated, so the file paths live here rather than in the
 * dictionaries, and are matched to `t.certifications.items` by `code`.
 *
 * Drop the files into `public/` at these exact names — extension included,
 * since a `.jpeg` file at a `.jpg` path 404s silently into the fallback
 * state. Every badge renders inside a true-white circular coin (see
 * `CertBadge` in blocks.tsx), so a transparent PNG or a white-ground JPEG
 * both sit on matching white with no seam.
 *
 * `fit` picks how the coin crops the source:
 *   "cover"   (default) — the coin fills edge to edge, cropping the source to
 *              a circle. Right for a round medallion (the four ISO badges):
 *              their "transparent" canvas has a checker-patterned square
 *              margin baked in around the circular mark (not real alpha), and
 *              only a circular crop removes that margin from the corners.
 *   "contain" — the source is letterboxed to fit, uncropped. Right for a
 *              logo that isn't circular (BRCGS is a wide wordmark, ~1.5:1) —
 *              `cover` would crop its edges into illegibility trying to fill
 *              a circle with a rectangle.
 */
export const CERT_BADGES: Record<string, { src: string; alt: string; fit?: "cover" | "contain" }> = {
  "ISO 9001": { src: "/iso-9001-badge.png", alt: "ISO 9001 Certification" },
  "ISO 14001": { src: "/iso-14001-badge.png", alt: "ISO 14001 Certification" },
  "ISO 45001": { src: "/iso-45001-badge.png", alt: "ISO 45001 Certification" },
  "ISO 22000:2018": { src: "/iso-22000-badge.png", alt: "ISO 22000:2018 Food Safety" },
  BRCGS: { src: "/brcgs-badge.jpg", alt: "BRCGS Packaging Safety", fit: "contain" },
};
