// ─────────────────────────────────────────────────────────────────────────
// MASTER CATALOG — structure only (no display text).
// Display text lives in the i18n dictionary (`src/i18n/locales/catalog-en.ts`),
// keyed by the same slug/id, so one ProductTemplate renders every product and
// all copy is translatable. Spec *values* (numbers/units) are language-neutral
// and live here; spec *labels* are translated.
// ─────────────────────────────────────────────────────────────────────────

export type ProductCategory = "woven-bags" | "flexible-packaging" | "add-ons";

export type SpecRow = { id: string; value: string }; // label → locale, value here
export type TabBlock = { id: string }; // heading + body → locale by id

export type ProductTab =
  | { id: string; kind: "richtext"; blocks: TabBlock[] }
  | { id: string; kind: "spectable"; rows: SpecRow[] };

export type Product = {
  slug: string;
  category: ProductCategory;
  /** Image-manifest keys; images[0] is the main image. */
  images: string[];
  /** Highlight as a key selling point in the mega-menu (e.g. Zipper Closures). */
  featured?: boolean;
  /** i18n key ids → Features checklist. */
  features: string[];
  /** i18n key ids → Benefits checklist. */
  benefits: string[];
  tabs: ProductTab[];
  /** Related industries (slugs) this product serves. */
  industrySlugs?: string[];
};

// ---- Display-text shapes (the locale files implement these) ----
export type TabText =
  | { label: string; blocks: Record<string, { heading: string; body: string }> }
  | { label: string; rows: Record<string, string> };

export type ProductText = {
  name: string;
  tagline: string;
  introduction: string;
  features: Record<string, string>;
  benefits: Record<string, string>;
  tabs: Record<string, TabText>;
};

export type IndustryText = {
  name: string;
  tagline: string;
  introduction: string;
  challenges: Record<string, string>;
  features: Record<string, string>;
  benefits: Record<string, string>;
  tabs: Record<string, TabText>;
};

export type CatalogText = {
  products: Record<string, ProductText>;
  industries: Record<string, IndustryText>;
};

// ---- Industry entries (structure only — copy lives in i18n) ----
export type Industry = {
  slug: string;
  id: string;
  /**
   * Featured photo URLs/paths (e.g. files in /public). images[0] is the main
   * featured photo on the detail page; any extras render as thumbnails. Leave
   * empty to show the placeholder frame. Example:
   *   images: ["/assets/images/industries/chemicals-industrial.jpg"]
   */
  images: string[];
  /** i18n key ids → Features checklist. */
  features: string[];
  /** i18n key ids → Benefits checklist. */
  benefits: string[];
  tabs: ProductTab[];
};

export const industries: Industry[] = [
  {
    slug: "food-agriculture",
    id: "food-agriculture",
    images: ["/industries/food-agriculture.jpg"],
    features: ["hygienic", "pestResistant", "printedBranding", "bulkAndRetail"],
    benefits: ["freshness", "compliance", "shelfAppeal"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "rice", value: "BOPP-laminated woven bags with high-clarity print" },
          { id: "flour", value: "BOPP-laminated woven bags" },
          { id: "sugar", value: "PP Woven Bags, food-grade" },
          { id: "pulses", value: "Breathable PP Woven Bags" },
        ],
      },
    ],
  },
  {
    slug: "animal-pet-nutrition",
    id: "animal-pet",
    images: ["/industries/animal-pet-nutrition.jpg"],
    features: ["odourNeutral", "moistureControl", "printReady", "bulkOrRetail"],
    benefits: ["freshness", "brandAppeal", "handlingEase"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "petFood", value: "Multilayer Pouches with barrier film" },
          { id: "cattleFeed", value: "PP Woven Bags, 25 – 50 kg" },
          { id: "aquaFeed", value: "BOPP-laminated woven bags, moisture-resistant" },
        ],
      },
    ],
  },
  {
    slug: "agriculture-crop-protection",
    id: "agri-crop",
    images: ["/industries/agriculture-crop-protection.jpg"],
    features: ["uvStable", "chemicalResistant", "tamperEvident", "bulkSizes"],
    benefits: ["fieldDurability", "storageLife", "safeHandling"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "fertiliser", value: "PLWPP Block Bottom Bags, high load" },
          { id: "seeds", value: "BOPP-laminated woven bags, gusseted" },
          { id: "agrochemicals", value: "Multilayer Pouches, high-barrier" },
        ],
      },
    ],
  },
  {
    slug: "chemicals-industrial",
    id: "chemicals-industrial",
    images: ["/industries/chemicals-industrial.jpg"],
    features: ["dustProof", "chemicalGrade", "highLoad", "custom"],
    benefits: ["containmentIntegrity", "regulatoryReady", "safeTransport"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "powders", value: "PP Woven Bags with PE Liner" },
          { id: "granules", value: "PLWPP Block Bottom Bags" },
          { id: "resins", value: "Coated / Uncoated Fabrics, moisture-barrier" },
          { id: "additives", value: "Multilayer Pouches, high-barrier lamination" },
        ],
      },
    ],
  },
  {
    slug: "home-care",
    id: "home-care",
    images: ["/industries/home-care.jpg"],
    features: ["highBarrier", "vividPrint", "spillResistant", "custom"],
    benefits: ["shelfStandout", "productProtection", "consumerConvenience"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "detergentPowder", value: "PP Woven Bags, printed" },
          { id: "liquidCleaner", value: "Spout Pouches with tamper-evident cap" },
          { id: "fabricCare", value: "Stand-Up Pouches with Zipper Closures" },
        ],
      },
    ],
  },
  {
    slug: "construction-building",
    id: "construction-building",
    images: ["/industries/construction-building.jpg"],
    features: ["highGsm", "dustProof", "packerCompatible", "heavyLoad"],
    benefits: ["reducedLoss", "stackable", "roughHandling"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "cement", value: "PLWPP Block Bottom Bags, valve-type" },
          { id: "tileAdhesive", value: "PP Woven Bags, high-GSM" },
          { id: "aggregates", value: "PP Woven Bags, coated for moisture" },
        ],
      },
    ],
  },
  {
    slug: "mining-energy",
    id: "mining-energy",
    images: ["/industries/mining-energy.jpg"],
    features: ["punctureResistant", "highLoad", "weatherResistant", "custom"],
    benefits: ["bulkEfficiency", "durability", "safeStacking"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "minerals", value: "PP Woven Bags, heavy-duty" },
          { id: "ores", value: "PLWPP Block Bottom Bags" },
          { id: "byProducts", value: "Coated / Uncoated Fabrics, moisture-resistant" },
        ],
      },
    ],
  },
  {
    slug: "retail-packaging",
    id: "retail-packaging",
    images: ["/industries/retail-packaging.jpg"],
    features: ["premiumPrint", "customHandles", "reusable", "brandDifferentiation"],
    benefits: ["pointOfSale", "brandRecall", "consumerConvenience"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "considerations" }] },
      {
        id: "matrix",
        kind: "spectable",
        rows: [
          { id: "carryBags", value: "PLWPP Carry Bags with D-Cut Handles" },
          { id: "promoBags", value: "BOPP-laminated woven bags, HD print" },
          { id: "retailPacks", value: "Zipper Pouches, reclosable" },
        ],
      },
    ],
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);

// Standard spec ids reused across woven products (labels translated in locale).
export const products: Product[] = [
  // ═══════════════════════════════════════════════════
  // WOVEN BAGS (PP / BOPP)
  // ═══════════════════════════════════════════════════
  {
    slug: "pp-woven-bags",
    category: "woven-bags",
    images: ["/products/pp-woven-bags.jpg"],
    features: ["tensile", "lightweight", "customisable", "uvResistant", "breathable", "recyclable"],
    benefits: ["durable", "economical", "versatile"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "importance" }, { id: "process" }, { id: "material" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "PP (Polypropylene)" },
          { id: "gsm", value: "50 – 200 GSM" },
          { id: "size", value: "As per requirement" },
          { id: "denier", value: "600 – 1200" },
          { id: "mesh", value: "8×8 – 12×12" },
          { id: "print", value: "Flexo / Roto · up to 8 colours" },
          { id: "load", value: "5 – 50 kg" },
          { id: "closure", value: "Heat-cut / Stitched" },
        ],
      },
      { id: "speciality", kind: "richtext", blocks: [{ id: "quality" }, { id: "capacity" }, { id: "chooseUs" }] },
    ],
    industrySlugs: ["food-agriculture", "agriculture-crop-protection", "chemicals-industrial"],
  },
  {
    slug: "coated-uncoated-fabrics",
    category: "woven-bags",
    images: ["/products/coated-uncoated-fabrics.jpg"],
    features: ["moistureBarrier", "uvStable", "customWidth", "converterReady"],
    benefits: ["flexibility", "costEfficient", "consistentQuality"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "PP / BOPP woven fabric" },
          { id: "gsm", value: "60 – 150 GSM" },
          { id: "width", value: "40 – 200 cm, slit to order" },
          { id: "coating", value: "PE / acrylic coating optional, or supplied uncoated" },
        ],
      },
    ],
    industrySlugs: ["chemicals-industrial", "construction-building", "agriculture-crop-protection"],
  },
  {
    slug: "bopp-ez-open-bags",
    category: "woven-bags",
    images: ["/products/bopp-ez-open-bags.jpg"],
    features: ["easyTear", "cleanDispense", "tensile", "printReady"],
    benefits: ["consumerConvenience", "lessSpillage", "fastLineSpeed"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "BOPP-laminated woven PP" },
          { id: "gsm", value: "80 – 140 GSM" },
          { id: "size", value: "As per requirement" },
          { id: "print", value: "Reverse-printed · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "animal-pet"],
  },
  {
    slug: "bopp-pinch-bottom-bags",
    category: "woven-bags",
    images: ["/products/bopp-pinch-bottom-bags.jpg"],
    features: ["flatBase", "gluedSeam", "stackable", "printHd"],
    benefits: ["warehouseEfficiency", "shelfStability", "premiumLook"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "BOPP-laminated woven PP" },
          { id: "gsm", value: "80 – 150 GSM" },
          { id: "size", value: "As per requirement" },
          { id: "print", value: "Reverse-printed · up to 8 colours" },
          { id: "closure", value: "Pinch-bottom glued seam" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "chemicals-industrial"],
  },
  {
    slug: "plwpp-block-bottom-bags",
    category: "woven-bags",
    images: ["/products/plwpp-block-bottom-bags.jpg"],
    features: ["squareBase", "cartonLike", "highLoad", "dustProof"],
    benefits: ["palletEfficiency", "retailReady", "durable"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "PLWPP (PP-laminated woven fabric)" },
          { id: "gsm", value: "90 – 160 GSM" },
          { id: "size", value: "As per requirement" },
          { id: "print", value: "Flexo / Reverse-print · up to 6 colours" },
          { id: "load", value: "5 – 25 kg" },
        ],
      },
    ],
    industrySlugs: ["chemicals-industrial", "construction-building"],
  },
  {
    slug: "plwpp-carry-bags",
    category: "woven-bags",
    images: ["/products/plwpp-carry-bags.jpg"],
    features: ["reusable", "printedBranding", "comfortHandle", "lightweight"],
    benefits: ["brandVisibility", "sustainability", "consumerAppeal"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "material", value: "PLWPP (PP-laminated woven fabric)" },
          { id: "gsm", value: "70 – 120 GSM" },
          { id: "size", value: "As per requirement" },
          { id: "print", value: "Flexo / Reverse-print · up to 6 colours" },
          { id: "load", value: "Up to 10 kg" },
        ],
      },
    ],
    industrySlugs: ["retail-packaging", "food-agriculture"],
  },

  // ═══════════════════════════════════════════════════
  // FLEXIBLE PACKAGING
  // ═══════════════════════════════════════════════════
  {
    slug: "multilayer-rolls",
    category: "flexible-packaging",
    images: ["/products/multilayer-rolls.jpg"],
    features: ["printQuality", "sealIntegrity", "customStructure", "rollFormat"],
    benefits: ["lineCompatibility", "wasteReduction", "consistentRuns"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE, BOPP/CPP, PA/PE · 2–4 layers" },
          { id: "thickness", value: "40 – 150 micron" },
          { id: "width", value: "As per requirement, slit to order" },
          { id: "print", value: "Rotogravure · up to 9 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care"],
  },
  {
    slug: "multilayer-pouches",
    category: "flexible-packaging",
    images: ["/products/multilayer-pouches.jpg"],
    features: ["barrier", "hermetic", "printHd", "structures", "custom"],
    benefits: ["freshness", "branding", "convenience"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "structure" }, { id: "applications" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET / MET-PET / PE · up to 4 layers" },
          { id: "thickness", value: "80 – 150 micron" },
          { id: "format", value: "Stand-up / 3-side / Centre-seal" },
          { id: "print", value: "Rotogravure · up to 9 colours" },
          { id: "feature", value: "Zipper / Spout / Tear-notch (optional)" },
          { id: "barrier", value: "High moisture & oxygen barrier" },
        ],
      },
      { id: "speciality", kind: "richtext", blocks: [{ id: "quality" }, { id: "chooseUs" }] },
    ],
    industrySlugs: ["food-agriculture", "home-care", "animal-pet"],
  },
  {
    slug: "liquid-packaging-pouches",
    category: "flexible-packaging",
    images: ["/products/liquid-packaging-pouches.jpg"],
    features: ["leakResistant", "punctureResistant", "hermeticSeal", "custom"],
    benefits: ["transportSafety", "shelfLife", "lightweight"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE, Nylon/PE · high seal-strength laminate" },
          { id: "thickness", value: "90 – 150 micron" },
          { id: "format", value: "Side-gusset, spout or sachet" },
          { id: "print", value: "Rotogravure · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care", "chemicals-industrial"],
  },
  {
    slug: "spout-pouches",
    category: "flexible-packaging",
    images: ["/products/spout-pouches.jpg"],
    features: ["reseal", "easyPour", "standUp", "tamperEvidentCap"],
    benefits: ["onTheGo", "portionControl", "premiumShelf"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE or BOPP/PE · 2–3 layers" },
          { id: "thickness", value: "100 – 150 micron" },
          { id: "format", value: "Stand-up pouch, corner or centre spout" },
          { id: "spout", value: "8 – 15 mm, tamper-evident cap" },
          { id: "print", value: "Rotogravure · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care"],
  },
  {
    slug: "side-seal-pouches",
    category: "flexible-packaging",
    images: ["/products/side-seal-pouches.jpg"],
    features: ["lightweightSeal", "fastFill", "clearWindow", "costEfficient"],
    benefits: ["highSpeedLines", "economical", "versatileFill"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "BOPP/CPP or PET/PE · 2 layers" },
          { id: "thickness", value: "50 – 90 micron" },
          { id: "format", value: "Two-side (pillow) seal" },
          { id: "print", value: "Flexo / Rotogravure · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture"],
  },
  {
    slug: "4-side-seal-pouches",
    category: "flexible-packaging",
    images: ["/products/4-side-seal-pouches.jpg"],
    features: ["flatSachet", "portionPack", "tearNotch", "hermeticSeal"],
    benefits: ["singleServe", "hygienic", "costEffective"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE or foil laminate · 2–3 layers" },
          { id: "thickness", value: "60 – 100 micron" },
          { id: "format", value: "Flat sachet, sealed on all four edges" },
          { id: "print", value: "Flexo / Rotogravure · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care"],
  },
  {
    slug: "d-cut-pouches",
    category: "flexible-packaging",
    images: ["/products/d-cut-pouches.jpg"],
    features: ["integratedHandle", "easyCarry", "reinforced", "printSurface"],
    benefits: ["consumerConvenience", "retailAppeal", "noAddOnParts"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "BOPP/PE or PET/PE laminate" },
          { id: "thickness", value: "80 – 130 micron" },
          { id: "format", value: "Die-cut handle, centre or side-seal" },
          { id: "print", value: "Rotogravure · up to 8 colours" },
        ],
      },
    ],
    industrySlugs: ["retail-packaging", "food-agriculture"],
  },
  {
    slug: "stand-up-pouches",
    category: "flexible-packaging",
    images: ["/products/stand-up-pouches.jpg"],
    features: ["selfStanding", "gussetedBase", "shelfPresence", "custom"],
    benefits: ["shelfImpact", "spaceEfficient", "resealableOption"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE, BOPP/CPP · up to 4 layers" },
          { id: "thickness", value: "90 – 150 micron" },
          { id: "format", value: "Bottom-gusset, stands upright on shelf" },
          { id: "print", value: "Rotogravure · up to 9 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care", "animal-pet"],
  },
  {
    slug: "zipper-pouches",
    category: "flexible-packaging",
    images: ["/products/zipper-pouches.jpg"],
    features: ["recloseZip", "freshness", "easyOpenTear", "custom"],
    benefits: ["repeatUse", "consumerValue", "lessWaste"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET/PE or BOPP/PE laminate" },
          { id: "thickness", value: "90 – 140 micron" },
          { id: "format", value: "Stand-up or 3-side seal with zipper" },
          { id: "zipper", value: "Press-to-close / Slider" },
          { id: "print", value: "Rotogravure · up to 9 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care"],
  },
  {
    slug: "up-to-4-layer",
    category: "flexible-packaging",
    images: [],
    features: ["barrierCustom", "layerFlex", "printOuter", "sealInner"],
    benefits: ["tailoredBarrier", "costOptimised", "productProtection"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "process" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "structure", value: "PET / MET-PET / Nylon / PE combinations" },
          { id: "thickness", value: "50 – 150 micron" },
          { id: "layers", value: "2, 3 or 4-layer laminate" },
          { id: "print", value: "Rotogravure · up to 9 colours" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "chemicals-industrial"],
  },

  // ═══════════════════════════════════════════════════
  // ADD-ONS & CUSTOMISATIONS
  // ═══════════════════════════════════════════════════
  {
    slug: "perforation",
    category: "add-ons",
    images: [],
    features: ["ventilation", "microPerforation", "freshnessControl", "customPattern"],
    benefits: ["reducedCondensation", "extendedFreshness", "safeHandling"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Micro-perforation / Tear-perforation" },
          { id: "application", value: "Woven bags & flexible pouches" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "agriculture-crop-protection"],
  },
  {
    slug: "liner",
    category: "add-ons",
    images: [],
    features: ["moistureBarrier", "contamProtection", "easyFit", "custom"],
    benefits: ["productProtection", "shelfLife", "cleanHandling"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Loose-fit / Form-fit / Valve liner" },
          { id: "material", value: "PE / PP film" },
          { id: "application", value: "Woven bags carrying fine or hygroscopic content" },
        ],
      },
    ],
    industrySlugs: ["chemicals-industrial", "construction-building"],
  },
  {
    slug: "window-view",
    category: "add-ons",
    images: [],
    features: ["clearPanel", "productVisibility", "customShape", "secureSeal"],
    benefits: ["consumerTrust", "shelfAppeal", "qualityCheck"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Die-cut window / Full-panel window" },
          { id: "material", value: "BOPP / PET clear film" },
          { id: "application", value: "Retail bags & pouches for visual product inspection" },
        ],
      },
    ],
    industrySlugs: ["retail-packaging", "food-agriculture"],
  },
  {
    slug: "holography",
    category: "add-ons",
    images: [],
    features: ["shelfShine", "brandDifferentiation", "antiCounterfeit", "customDesign"],
    benefits: ["premiumPerception", "brandProtection", "standOut"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Registered hologram / Metallised holographic film" },
          { id: "application", value: "Retail bags, pouches & security-sensitive packs" },
        ],
      },
    ],
    industrySlugs: ["retail-packaging"],
  },
  {
    slug: "gusset",
    category: "add-ons",
    images: [],
    features: ["sideGusset", "bottomGusset", "capacityBoost", "customSize"],
    benefits: ["moreVolume", "stability", "flexibleFormat"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Side-gusset / Bottom-gusset" },
          { id: "size", value: "As per requirement" },
          { id: "application", value: "Pouches & bags needing extra fill volume" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "home-care"],
  },
  {
    slug: "pallet-packaging",
    category: "add-ons",
    images: [],
    features: ["heavyDuty", "palletWrap", "loadStability", "custom"],
    benefits: ["transportSafety", "warehouseEfficiency", "damageReduction"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Pallet cover / Pallet wrap bag" },
          { id: "material", value: "PP woven / PE film" },
          { id: "application", value: "Palletised bulk loads for transport & storage" },
        ],
      },
    ],
    industrySlugs: ["construction-building", "mining-energy", "chemicals-industrial"],
  },
  {
    slug: "backseam",
    category: "add-ons",
    images: [],
    features: ["cleanTube", "seamStrength", "minimalOverlap", "custom"],
    benefits: ["tidyAppearance", "structuralIntegrity", "printClarity"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Centre-fold back seam / Lap seam" },
          { id: "application", value: "Tubular bags requiring a clean, strong closure" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "chemicals-industrial"],
  },
  {
    slug: "zipper-closures",
    category: "add-ons",
    featured: true,
    images: ["products/zipper-closures-01", "products/zipper-closures-02"],
    features: ["reclose", "freshness", "tamper", "easyOpen"],
    benefits: ["consumerValue", "premium", "lessWaste"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Press-to-close / Slider / Pocket-zipper" },
          { id: "material", value: "PP / PE" },
          { id: "application", value: "Woven bags & flexible pouches" },
          { id: "reusability", value: "Multi-cycle reclose" },
        ],
      },
    ],
    industrySlugs: ["food-agriculture", "retail-packaging"],
  },
  {
    slug: "d-cut-handles",
    category: "add-ons",
    featured: true,
    images: ["products/d-cut-handles-01", "products/d-cut-handles-02"],
    features: ["carry", "strength", "clean", "custom"],
    benefits: ["convenience", "retail", "branding"],
    tabs: [
      { id: "details", kind: "richtext", blocks: [{ id: "overview" }, { id: "options" }] },
      {
        id: "spec",
        kind: "spectable",
        rows: [
          { id: "type", value: "Die-cut / Patch handle" },
          { id: "material", value: "Woven PP (self-material)" },
          { id: "application", value: "Carry bags & retail packs" },
          { id: "load", value: "Up to 10 kg" },
        ],
      },
    ],
    industrySlugs: ["retail-packaging", "food-agriculture"],
  },

];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const productsByCategory = (category: ProductCategory) =>
  products.filter((p) => p.category === category);
