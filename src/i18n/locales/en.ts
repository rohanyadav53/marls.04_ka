// English — the source of truth. Every page reads from this shape.
// Brand names (MARLSBORO Group, Marlsboro Velcon, Velcon Flexible) and technical
// codes (BOPP, PP, HDPE, PLWPP, FIBC, ISO, BRCGS) are kept literal everywhere.
import { catalogEn } from "./catalog-en";

export const en = {
  meta: {
    titleTemplate: "%s — MARLSBORO Group",
    homeTitle: "MARLSBORO Group — Woven Bags & Flexible Packaging Manufacturer",
    description:
      "Manufacturer of BOPP woven bags, PP woven sacks, and flexible packaging. Quality-driven and innovation-led, producing over 84 million bags a year.",
  },

  nav: {
    home: "Home",
    about: "About",
    products: "Products",
    industries: "Industry Solutions",
    sustainability: "Sustainability",
    recyclable: "I AM RECYCLABLE",
    packagingSecurity: "Packaging Security",
    certifications: "Certifications",
    careers: "Careers",
    contact: "Contact",
    faqs: "FAQs",
  },

  navGroups: {
    about: {
      aboutUs: "About Us",
      journey: "Our Journey",
      infrastructure: "Infrastructure",
      values: "Organisation Values",
      process: "Our Process",
      founder: "Founder's Note",
      vision: "Our Vision",
    },
    aboutDesc: {
      aboutUs: "Who we are and how we began",
      journey: "From 2014 to today, milestone by milestone",
      infrastructure: "The integrated plant behind every order",
      values: "The commitments we hold on every order",
      process: "Five steps from order to dispatch",
      founder: "A word from our founder",
      vision: "Where we are headed",
    },
    aboutFeature: {
      eyebrow: "Inside the plant",
      title: "Polymer to finished pack, under one roof",
      body: "Extrusion, weaving, coating, printing and conversion in one connected facility near Jaipur.",
      cta: "Explore our infrastructure",
    },
    productCols: {
      woven: "Woven Bags (PP/BOPP)",
      flexible: "Flexible Packaging",
      addons: "Add-ons & Customisations",
      security: "Security Features",
    },
  },

  cta: {
    explore: "Explore Products",
    quote: "Request a Quote",
    brochure: "Download Brochure",
    learnMore: "Learn More",
    getInTouch: "Get in Touch",
    viewAll: "View All",
    allProducts: "All Products",
    allIndustries: "All Industries",
    sendEnquiry: "Send Enquiry",
    apply: "Send Your Resume",
    backHome: "Back to Home",
  },

  common: {
    breadcrumbHome: "Home",
    toBeConfirmed: "To be confirmed",
    photoCaption: "Plant / product photo — to be supplied",
    menu: "Menu",
    close: "Close",
  },

  hero: {
    eyebrow: "Manufacturers of PP Bags & Flexible Laminates",
    heading: "Empowering the Packaging Industry with Innovation",
    intro:
      "MARLSBORO Group is a leading and trusted manufacturer of BOPP woven bags, PP woven sacks, and flexible packaging solutions. Driven by quality, innovation, and customer satisfaction, we combine advanced manufacturing with stringent quality standards to deliver packaging that protects products, strengthens brands, and builds lasting partnerships.",
    ctaProducts: "Explore Products",
    ctaQuote: "Request a Quote",
  },

  stats: {
    experience: "Years of Experience",
    capacity: "Tailored Bags / Annum",
    production: "Sacks / Year",
  },

  home: {
    /* ---- hero slider ---- */
    slider: {
      label: "MARLSBORO Group highlights",
      prev: "Previous slide",
      next: "Next slide",
      goTo: "Go to slide",
    },
    slides: [
      {
        eyebrow: "Manufacturers of PP Bags & Flexible Laminates",
        heading: "Empowering the Packaging Industry with Innovation",
        body: "BOPP woven bags, PP woven sacks and flexible laminates — engineered for reliability, consistency, and large-scale manufacturing.",
        cta: "Know More",
      },
      {
        eyebrow: "Production Capacity",
        heading: "Flagship Capacity: 84 Million Bags Annually",
        body: "Two specialised business units, with integrated print, lamination and conversion lines under one roof.",
        cta: "Know More",
      },
      {
        eyebrow: "Infrastructure",
        heading: "World-Class Manufacturing: Built for Scale, Trusted Worldwide",
        body: "A modern plant near Jaipur, India — advanced machinery, stringent quality gates, and delivery dates treated as contractual.",
        cta: "Know More",
      },
    ],

    /* ---- executive summary ---- */
    summary: {
      eyebrow: "Executive Summary",
      heading: "Engineered for Performance. Built for Scale.",
      body: "Marlsboro Group delivers high-performance industrial packaging solutions engineered for reliability, consistency, and large-scale manufacturing. Through its two specialised business units — Marlsboro Industries LLP and Velcon Flexible LLP — the Group produces over 84 million bags annually.",
      statValue: "84M",
      statLabel: "Tailored bags produced annually",
      units: {
        woven: {
          tag: "Woven",
          desc: "WPP & BOPP woven sacks — extrusion coating, flexographic print and roll-to-bag conversion.",
        },
        flexible: {
          tag: "Flexible",
          desc: "Multilayer laminates, pouches and rolls — solventless lamination and pouch converting.",
        },
      },
    },

    /* ---- organisation values ---- */
    values: {
      eyebrow: "Organisation Values",
      heading: "The Standards We Hold Ourselves To",
      sub: "A fixed set of commitments that do not flex with volume, season, or price pressure.",
      items: [
        { name: "Authentic & Consistent Quality", desc: "Specification held constant from the first bag to the last." },
        { name: "Accountability", desc: "One named team owns your order end to end." },
        { name: "Timely Deliveries", desc: "Committed dates treated as contractual, not aspirational." },
        { name: "Hygienic Practices", desc: "Controlled handling for food, feed and agri-grade packaging." },
        { name: "Customer Centricity", desc: "Solutions engineered to your application, not our convenience." },
      ],
    },

    /* ---- five-step manufacturing process ---- */
    workflow: {
      eyebrow: "Our Process",
      heading: "Five Steps. One Commitment to Quality.",
      sub: "Every order follows the same streamlined route — technical review, stringent inspection, and delivery on schedule.",
      steps: [
        { name: "Order Confirmation", desc: "Requirements reviewed and confirmed for complete clarity before production." },
        { name: "Technical Approval", desc: "Specifications and artwork finalised with your approval before manufacturing." },
        { name: "Production & Manufacturing", desc: "Produced on advanced machinery with precision and consistency." },
        { name: "Quality Inspection", desc: "Stringent stage-by-stage checks maintain the highest standards." },
        { name: "Final Inspection & Dispatch", desc: "Inspected, securely packed, and dispatched on schedule." },
      ],
    },

    /* ---- plant / infrastructure ---- */
    facility: {
      eyebrow: "Infrastructure",
      heading: "World-Class Manufacturing Facility",
      body: "Advanced machinery and integrated production systems deliver precision and consistency at every stage — from tape extrusion and weaving through to print, lamination, and conversion.",
      tiles: [
        { name: "Extrusion Coating Laminator", desc: "Moisture-barrier and BOPP lamination applied under controlled tension." },
        { name: "Flexographic Printing", desc: "High-definition line and process print, registered across the full web width." },
        { name: "Automatic Bag Conversion", desc: "Cutting, stitching and bottom sealing at line speed, with in-line reject control." },
      ],
    },

    /* ---- sustainability ---- */
    green: {
      eyebrow: "Sustainability in Action",
      heading: "Powered by 1 MW of Solar",
      body: "Sustainability is embedded in the way we manufacture. Renewable energy, resource-efficient processes, and recyclable material choices reduce the footprint of every order we ship.",
      statValue: "1 MW",
      statLabel: "Rooftop solar plant",
      pillars: [
        { name: "1 MW Solar Power Plant", desc: "Renewable energy powering sustainable operations." },
        { name: "Recyclable Packaging", desc: "WPP woven sacks designed for responsible material recovery." },
        { name: "Waste Minimisation", desc: "Production scrap recovered and reused wherever possible." },
        { name: "Resource Efficiency", desc: "Optimised processes that reduce waste and improve operational efficiency." },
      ],
    },

    /* ---- founder's note ---- */
    founderNote: {
      eyebrow: "A Word From the Founder",
      quote:
        "At MARLSBORO, we believe that every package we deliver carries our commitment to quality, reliability, and trust. These values have guided every decision we make… We believe transparency is the foundation of every successful partnership.",
      role: "Founder",
    },

    about: {
      eyebrow: "About Us",
      heading: "Engineering Excellence in Every Bag",
      body: "From a polymer business founded in 2014 to a modern manufacturing operation, MARLSBORO Group pairs advanced machinery with a people-first culture — producing packaging trusted across India and beyond.",
    },
    products: {
      eyebrow: "What We Make",
      heading: "A Complete Packaging Range",
      body: "Woven and flexible packaging engineered for performance, protection, and brand impact.",
    },
    industries: {
      eyebrow: "Industries We Serve",
      heading: "Trusted Across Every Sector",
      body: "Precision packaging for the industries that keep the world moving.",
    },
    process: {
      eyebrow: "How We Work",
      heading: "From Enquiry to Dispatch",
      body: "A disciplined, quality-gated workflow behind every order.",
    },
    sustainability: {
      eyebrow: "Sustainability",
      heading: "Packaging with a Purpose",
      body: "Recyclable materials and responsible manufacturing, built into every layer of what we do.",
    },
    certifications: {
      eyebrow: "Quality & Compliance",
      heading: "Built on Standards You Can Trust",
    },
    finalCta: {
      heading: "Let's build packaging that protects your product and your brand.",
      body: "Tell us your requirement and our team will respond within one business day.",
    },
  },

  about: {
    hero: {
      eyebrow: "About Us",
      heading: "Built on Quality, Driven by Innovation",
      sub: "The story, values, and people behind MARLSBORO Group.",
    },
    story: {
      eyebrow: "Our Story",
      heading: "From a polymer start-up to a two-unit packaging group",
      paras: [
        "MARLSBORO's foundation dates to 2014, when the company entered the polymer business with a commitment to quality and growth.",
        "In 2016, Marlsboro Industries LLP was established to manufacture high-quality polypropylene (PP) and biaxially oriented polypropylene (BOPP) woven sacks. Operations began that year with a yearly capacity of 20 million bags.",
        "In 2021, our subsidiary Velcon Flexible LLP was established to offer flexible packaging — multilayer pouches, rolls and zippers. Together, the two units now produce over 84 million bags a year.",
      ],
      photoAlt: "The MARLSBORO Group manufacturing facility near Jaipur, Rajasthan",
    },
    journey: {
      eyebrow: "Our Journey",
      heading: "Twelve years of steady growth",
      sub: "The milestones that built MARLSBORO Group — from a polymer start-up to an integrated, two-unit packaging manufacturer.",
      items: [
        {
          year: "2014",
          title: "The foundation",
          desc: "MARLSBORO enters the polymer business, built on a commitment to quality and growth.",
          metric: "Founded",
        },
        {
          year: "2016",
          title: "Marlsboro Industries LLP",
          desc: "Established to manufacture high-quality PP and BOPP woven sacks. Operations commence with a yearly capacity of 20 million bags.",
          metric: "20M bags / year",
        },
        {
          year: "2021",
          title: "Velcon Flexible LLP",
          desc: "Our subsidiary is established to extend the Group into flexible packaging — multilayer pouches, rolls and zippers, customisable for every sector.",
          metric: "Second business unit",
        },
        {
          year: "Today",
          title: "Two units, one standard",
          desc: "The Group produces over 84 million tailored bags a year, runs ISO-certified management systems, and is partly powered by a 1 MW rooftop solar plant.",
          metric: "84M bags / year",
        },
        {
          year: "Ahead",
          title: "A trusted global packaging partner",
          desc: "Exceptional products, the highest standards of quality and manufacturing excellence, and lasting relationships built on transparency.",
          metric: "Our vision",
        },
      ],
    },
    units: {
      eyebrow: "Two Specialised Business Units",
      heading: "One group. Two focused manufacturers.",
      sub: "Each unit is built around its own product family and process — and both run from the same integrated plant.",
      items: [
        {
          tag: "Woven",
          name: "Marlsboro Industries LLP",
          est: "Established 2016",
          desc: "PP and BOPP woven sacks, built for tensile strength, bulk-commodity protection and high-definition retail print — from extrusion and weaving through coating, printing and conversion.",
          cta: "Explore woven bags",
        },
        {
          tag: "Flexible",
          name: "Velcon Flexible LLP",
          est: "Established 2021",
          desc: "Multilayer laminates, rolls and pouches engineered for barrier protection and shelf appeal — printing, solventless lamination, slitting and pouch conversion in one line of sight.",
          cta: "Explore flexible packaging",
        },
      ],
      infraLink: "See the plant behind both units",
    },
    pillars: {
      eyebrow: "Why MARLSBORO",
      heading: "What it is like to work with us",
      items: [
        { name: "Integrated production", desc: "Extrusion, weaving, lamination and printing under one roof — tighter control, faster turnaround, one accountable partner." },
        { name: "Certified systems", desc: "ISO 9001, 14001, 45001 and 22000 management systems, with BRCGS packaging safety under implementation." },
        { name: "Built for every sector", desc: "From sugar and agri commodities to fertiliser, feed, cement and industrial chemicals — customised to the application." },
        { name: "Delivery as a commitment", desc: "Committed dates are treated as contractual, not aspirational, with one named team owning your order." },
      ],
    },
    founderTeaser: {
      eyebrow: "A Word From the Founder",
      quote: "We believe transparency is the foundation of every successful partnership.",
      cta: "Read the founder's note",
    },
    overview: {
      heading: "Our Story",
      body1:
        "MARLSBORO's foundation dates to 2014, when the company entered the polymer business with a commitment to quality and growth. In 2016, Marlsboro Industries LLP was established to manufacture high-quality polypropylene (PP) and BOPP woven sacks.",
      body2:
        "We commenced operations in 2016 with a yearly capacity of 20 million bags and have grown steadily since — the Group now produces over 84 million bags a year across both units. In 2021, our subsidiary Velcon Flexible LLP was established to offer an extensive range of flexible packaging — multilayer pouches, rolls, and zippers — customisable for every sector.",
      sectorsLabel: "Sectors we serve",
      sectors: "Sugar · Agri commodities · Fertiliser · Animal feed · Cement · Industrial chemicals",
    },
    values: {
      eyebrow: "Organisation Values",
      heading: "The Standards We Hold Ourselves To",
      sub: "A fixed set of commitments that do not flex with volume, season, or price pressure.",
      intro:
        "We produce a comprehensive range of packaging materials suited to varied functional requirements — and we deliver them against a fixed set of commitments that hold on every order.",
      items: [
        { name: "Authentic & Consistent Quality", desc: "Specification held constant from the first bag to the last." },
        { name: "Accountability", desc: "One named team owns your order end to end." },
        { name: "Customer Centricity", desc: "Solutions engineered to your application, not our convenience." },
        { name: "Timely Deliveries", desc: "Committed dates treated as contractual, not aspirational." },
        { name: "Hygienic Practices", desc: "Controlled handling for food, feed and agri-grade packaging." },
      ],
    },
    process: {
      eyebrow: "Our Process",
      heading: "Five Steps. One Commitment to Quality.",
      sub: "Every order follows a streamlined route backed by technical expertise, stringent quality inspection, and timely delivery.",
      steps: [
        { name: "Order Confirmation", desc: "Your requirements are reviewed and confirmed to ensure complete clarity before production." },
        { name: "Technical Approval", desc: "Technical specifications and artwork are finalised with your approval before manufacturing begins." },
        { name: "Production & Manufacturing", desc: "Production is carried out using advanced technology with precision and consistency." },
        { name: "Quality Inspection", desc: "Every stage undergoes stringent quality checks to maintain the highest standards." },
        { name: "Final Inspection & Dispatch", desc: "Products are inspected, securely packed, and dispatched on schedule." },
      ],
    },
    founder: {
      eyebrow: "A Word From the Founder",
      heading: "Founder's Note",
      greeting: "Welcome to MARLSBORO.",
      paras: [
        "At MARLSBORO, we believe that every package we deliver carries our commitment to quality, reliability, and trust. These values have guided every decision we make and continue to define who we are.",
        "We believe transparency is the foundation of every successful partnership. Through honest communication, clear commitments, and complete accountability, we ensure our customers can rely on us with confidence at every stage.",
        "Our vision is simple — to be a trusted global packaging partner by delivering exceptional products, maintaining the highest standards of quality and manufacturing excellence, and building lasting relationships with our customers. As we grow, our dedication to innovation, integrity, timely deliveries, and customer satisfaction remains unwavering.",
      ],
      closing: "Thank you for your trust. We look forward to growing together.",
      role: "Founder",
      body: "At MARLSBORO, we believe that every package we deliver carries our commitment to quality, reliability, and trust. These values have guided every decision we make and continue to define who we are.",
      thanks: "Thank you,",
      cite: "Founder, MARLSBORO Group",
    },
    vision: {
      eyebrow: "Our Vision",
      heading: "A Trusted Global Packaging Partner",
      body: "Our vision is simple — to be a trusted global packaging partner by delivering exceptional products, maintaining the highest standards of quality and manufacturing excellence, and building lasting relationships with our customers. As we grow, our dedication to innovation, integrity, timely deliveries, and customer satisfaction remains unwavering.",
      points: [
        "Deliver exceptional products to a consistent standard, order after order",
        "Hold the highest standards of quality and manufacturing excellence",
        "Build lasting relationships on transparency and accountability",
        "Keep innovation, integrity and on-time delivery central as we grow",
      ],
    },
  },

  infrastructure: {
    hero: {
      eyebrow: "Infrastructure",
      heading: "Integrated Manufacturing, Under One Roof",
      sub: "From polymer granule to finished, dispatch-ready pack — extrusion, weaving, coating, printing and conversion in one connected plant near Jaipur.",
    },
    facts: [
      { value: "84M", label: "Tailored bags a year" },
      { value: "2", label: "Specialised business units" },
      { value: "4", label: "ISO-certified systems" },
      { value: "1 MW", label: "Rooftop solar on site" },
    ],
    plant: {
      eyebrow: "The Plant",
      heading: "One connected facility, start to finish",
      body: [
        "MARLSBORO Group manufactures from a modern facility at Vill. Jahota on the Rampura–Raithal Road (SH-19), in Jaipur Rural, Rajasthan.",
        "Keeping every stage — from polymer to finished pack — inside one connected flow shortens lead times, tightens quality control, and puts a single accountable team behind your order.",
      ],
      photoAlt: "The MARLSBORO Group plant at dusk",
      locationLabel: "Plant location",
      directions: "Get directions",
    },
    flow: {
      eyebrow: "The Production Flow",
      heading: "From granule to finished pack",
      sub: "Two product families, each with its own line — and one shared standard of inspection.",
      lanes: [
        {
          tag: "Woven",
          name: "Marlsboro Industries LLP",
          sub: "PP & BOPP woven sacks",
          steps: [
            { name: "Tape extrusion", desc: "Polypropylene granules are melted and extruded into tapes, drawn and stretched for tensile strength." },
            { name: "Weaving", desc: "Tapes are woven on circular looms into tubular fabric to the specified mesh and GSM." },
            { name: "Coating & lamination", desc: "Extrusion-coating lamination, with optional BOPP lamination for vivid, high-definition print." },
            { name: "Printing", desc: "Flexographic and bag-to-bag printing for branded packs and variable data." },
            { name: "Conversion & finishing", desc: "Cutting, hemming and stitching or roll-to-bag conversion, with liners, gussets, perforation and back-seam add-ons." },
            { name: "Inspection & dispatch", desc: "Every lot is inspected, securely packed and dispatched on the committed date." },
          ],
        },
        {
          tag: "Flexible",
          name: "Velcon Flexible LLP",
          sub: "Laminates, rolls & pouches",
          steps: [
            { name: "Multilayer film", desc: "Films for the structure are prepared in-house on a multilayer plant." },
            { name: "Rotogravure printing", desc: "High-definition, multi-colour rotogravure print registered to the design." },
            { name: "Solventless lamination", desc: "Films are bonded into multilayer structures — up to four layers — without solvents." },
            { name: "Slitting", desc: "High-speed slitting to the specified web width, rewound onto cores sized for the customer's machine." },
            { name: "Pouch conversion", desc: "Online gusseting and pouch converting: stand-up, spout, side-seal, 4-side-seal, D-cut and zipper formats." },
            { name: "Inspection & dispatch", desc: "Finished rolls and pouches are inspected, packed and dispatched on schedule." },
          ],
        },
      ],
    },
    stages: {
      eyebrow: "Inside the Plant",
      heading: "Where the work happens",
      items: [
        {
          name: "Extrusion & tape drawing",
          lead: "Every bag starts as polymer. Extrusion is done in-house, so the strength of the finished sack is set at the source.",
          points: [
            "In-house tape extrusion from polypropylene granules",
            "Tapes drawn and stretched for tensile strength",
            "Consistent tape quality feeding the weaving hall",
          ],
          alt: "Tape extrusion line at the MARLSBORO Group plant",
        },
        {
          name: "Weaving hall",
          lead: "Rows of circular looms turn tape into tubular fabric. Consistent fabric weight and weave density, batch after batch, is the difference between a bag that holds and one that fails at the seam.",
          points: [
            "Circular looms weaving to the specified mesh and GSM",
            "Every roll checked for GSM, tensile strength and print registration before conversion",
            "Rolls staged in-line, ready for coating and printing",
          ],
          alt: "Circular weaving hall at the MARLSBORO Group plant",
        },
        {
          name: "Coating & lamination",
          lead: "Extrusion coating adds moisture resistance and a print-ready surface; BOPP lamination adds the high-definition finish retail brands want.",
          points: [
            "Extrusion-coating laminator for coated woven fabric",
            "Optional BOPP lamination for vivid, high-definition print",
            "Solventless lamination for flexible multilayer structures",
          ],
          alt: "Extrusion coating and lamination line",
        },
        {
          name: "Finished goods & dispatch",
          lead: "Finished packs are inspected, counted and staged for dispatch — packed securely, and shipped on the date committed at order confirmation.",
          points: [
            "Final inspection before every dispatch",
            "Securely packed for transit, with palletised options",
            "Committed delivery dates treated as contractual",
          ],
          alt: "Finished MARLSBORO sacks staged in the warehouse",
        },
      ],
    },
    band: {
      eyebrow: "Precision at scale",
      heading: "One standard, from the first metre of fabric to the last bag.",
      alt: "Circular loom weaving fabric at the MARLSBORO Group plant",
    },
    quality: {
      eyebrow: "Quality Assurance",
      heading: "Inspected at every gate",
      sub: "Quality is not a final check — it is built into the order's route through the plant.",
      steps: [
        { name: "Order reviewed", desc: "Requirements are confirmed so production starts from complete clarity." },
        { name: "Technical data sheet", desc: "Specifications and artwork are presented and approved before manufacturing." },
        { name: "Production initiated after a quality check", desc: "Manufacturing begins only once the order has passed its quality check." },
        { name: "Multiple in-process checkpoints", desc: "GSM, tensile strength and print registration are checked as the order moves through the plant." },
        { name: "Final inspection & dispatch", desc: "Finished goods are inspected, securely packed and released on schedule." },
      ],
      hygiene: "Controlled handling for food, feed and agri-grade packaging.",
      certsHeading: "Certified management systems",
      certsCta: "View all certifications",
    },
    energy: {
      eyebrow: "Energy & Environment",
      heading: "Powered in part by the sun",
      body: "A 1 MW rooftop solar plant feeds the facility directly, so a meaningful share of production runs on renewable energy rather than grid power.",
      points: [
        "1 MW of rooftop solar generation on site",
        "Trim, offcuts and start-up scrap reground and fed back into production",
        "Recyclable PP mono-material sacks, designed for recovery",
      ],
      cta: "See our sustainability commitments",
      alt: "Rooftop solar array over the MARLSBORO Group plant",
    },
  },

  products: {
    hero: {
      eyebrow: "Our Products",
      heading: "Packaging Engineered for Performance",
      sub: "A complete range of woven bags and flexible packaging, customisable for every sector.",
    },
    overviewHeading: "Product Categories",
    categories: {
      "woven-bags": {
        name: "PP / BOPP Woven Bags",
        tagline: "Strength and high-definition print, woven in.",
        desc: "High-strength polypropylene woven bags with optional BOPP lamination for premium, photographic-quality printing and moisture protection.",
      },
      "flexible-packaging": {
        name: "Flexible Packaging",
        tagline: "Multilayer films and pouches by Velcon Flexible.",
        desc: "Multilayer rolls, pouches, and zippers engineered for food, FMCG, liquids, and industrial applications requiring barrier and seal integrity.",
      },
      "add-ons": {
        name: "Add-ons & Customisations",
        tagline: "Tailor every bag to your line.",
        desc: "From liners and windows to holography and pallet packaging — finish your packaging exactly the way your product needs.",
      },
      "security-features": {
        name: "Security & Anti-Counterfeiting",
        tagline: "Protect your brand at the packaging level.",
        desc: "Holographic film, QR codes, barcodes, and authentication built into the bag, so genuine product is verifiable through the supply chain.",
      },
    },
    woven: {
      hero: { eyebrow: "Products", heading: "PP / BOPP Woven Bags" },
      intro:
        "Our woven bags pair high tensile strength with optional BOPP lamination for vivid, high-definition print. Manufactured with extrusion-coating lamination, they suit everything from staple commodities to premium retail branding.",
      linesHeading: "Our Woven Bag Lines",
      lines: [
        { name: "PP Woven Bags", desc: "Workhorse sacks for staples and industrial goods." },
        { name: "Coated / Uncoated Fabrics", desc: "Woven PP fabric to your coating and width spec." },
        { name: "BOPP EZ-Open Bags", desc: "Easy-open convenience for retail and trade packs." },
        { name: "BOPP Pinch Bottom Bags", desc: "Clean shelf presentation with a flat, glued base." },
        { name: "PLWPP Block Bottom Bags", desc: "Stable, brick-shaped bags that stack and palletise well." },
        { name: "PLWPP Carry Bags", desc: "Durable woven carry bags with custom branding." },
      ],
    },
    flexible: {
      hero: { eyebrow: "Products", heading: "Flexible Packaging" },
      intro:
        "Through Velcon Flexible LLP (est. 2021), we produce multilayer rolls and pouches on rotogravure printing, solventless lamination, and high-speed slitting lines — for food, liquids, FMCG, and industrial products.",
      linesHeading: "Our Flexible Packaging Lines",
      lines: [
        { name: "Multilayer Rolls", desc: "Printed laminate rollstock for automated filling lines." },
        { name: "Multilayer Pouches", desc: "Barrier pouches in a range of formats and structures." },
        { name: "Liquid Packaging Pouches", desc: "Leak-resistant pouches engineered for liquids." },
        { name: "Spout Pouches", desc: "Re-closable spouted pouches for pourable products." },
        { name: "Side-Seal & 4-Side-Seal Pouches", desc: "Clean-sealed formats for samples to retail packs." },
        { name: "Stand-Up Pouches (with / without zipper)", desc: "Shelf-ready pouches with optional re-seal zipper." },
        { name: "Up to 4-Layer Structures", desc: "Tuned barrier builds for shelf-life and protection." },
      ],
    },
    addOns: {
      hero: { eyebrow: "Products", heading: "Add-ons & Customisations" },
      intro:
        "Finish your packaging to spec. Combine any of the following add-ons across our woven and flexible ranges.",
      itemsHeading: "Available Add-ons",
      items: [
        "Perforation",
        "Liner",
        "Window View",
        "Multilayer BOPP",
        "Holography",
        "Gusset",
        "Customisable Pallet Packaging",
        "Backseam",
      ],
    },
    security: {
      hero: { eyebrow: "Products", heading: "Security & Anti-Counterfeiting" },
      intro:
        "Counterfeiting erodes trust and revenue. We build authentication directly into your packaging so genuine product is verifiable from factory to shelf.",
      itemsHeading: "Security Features",
      items: [
        { name: "Holographic Film", desc: "Tamper-evident holography integrated into the bag surface." },
        { name: "QR Codes", desc: "Scannable codes linking to authentication and product pages." },
        { name: "Barcodes", desc: "Standardised coding for traceability across the supply chain." },
        { name: "Product Authentication", desc: "Layered features that make genuine product easy to verify." },
        { name: "Brand Protection", desc: "A combined approach that deters imitation and protects equity." },
      ],
    },
  },

  industries: {
    hero: {
      eyebrow: "Industries",
      heading: "Trusted Across Every Sector",
      sub: "Precision packaging solutions for the industries that keep the world moving.",
    },
    overviewHeading: "Industries We Serve",
    backToAll: "All Industries",
    appliesHeading: "Typical applications",
    productsHeading: "Recommended packaging",
    items: {
      "food-agriculture": {
        name: "Food & Agricultural Commodities",
        lead: "Hygienic, strong packaging for staple foods and farm produce.",
        body: "Food-grade, pest-resistant woven bags for rice, flour, sugar, pulses, and other staples — engineered for hygiene, strength, and clean branding.",
        applications: ["Rice & flour", "Sugar", "Pulses & grains", "Spices"],
      },
      "animal-pet": {
        name: "Animal & Pet Nutrition",
        lead: "Odour-neutral, retail-ready packs for feed and nutrition.",
        body: "Compliant, odour-neutral packaging for animal feed, aqua feed, and pet nutrition, with high-definition print for shelf appeal.",
        applications: ["Cattle & poultry feed", "Aqua feed", "Pet food", "Supplements"],
      },
      "agri-crop": {
        name: "Agriculture & Crop Protection",
        lead: "UV-stable, chemical-resistant bags for inputs.",
        body: "Durable, UV-stabilised bags for fertilisers, seeds, and crop-protection products that hold up in field and storage conditions.",
        applications: ["Fertilisers", "Seeds", "Agrochemicals", "Soil additives"],
      },
      "chemicals-industrial": {
        name: "Chemicals & Industrial Products",
        lead: "Safe containment for powders and granules.",
        body: "Moisture-proof, robust packaging engineered for the safe transport of powders, granules, and industrial chemicals.",
        applications: ["Industrial chemicals", "Powders & granules", "Resins", "Additives"],
      },
      "home-care": {
        name: "Home Care Products",
        lead: "Vivid, high-barrier packs for household goods.",
        body: "Brand-forward, high-barrier packaging for detergents and household products, with vibrant multi-colour printing.",
        applications: ["Detergents", "Cleaning powders", "Household care"],
      },
      "construction-building": {
        name: "Construction & Building Materials",
        lead: "Heavy-duty bags built for rough handling.",
        body: "Tough woven sacks for cement, tile adhesives, wall finishes, and aggregates — engineered for load and rough handling.",
        applications: ["Cement", "Tile adhesives", "Wall finishes", "Aggregates"],
      },
      "mining-energy": {
        name: "Mining & Energy",
        lead: "Industrial-strength bulk packaging.",
        body: "Puncture- and tear-resistant bulk packaging for minerals, ores, and energy by-products.",
        applications: ["Minerals & ores", "Charcoal", "Mineral bags", "By-products"],
      },
      "retail-packaging": {
        name: "Retail & Packaging Solutions",
        lead: "Premium woven carry bags and retail packs.",
        body: "Custom-printed woven carry bags and promotional packaging with premium finishes for brand differentiation at the point of sale.",
        applications: ["Carry bags", "Promotional bags", "Shopping bags", "Retail packs"],
      },
    },
  },

  sustainability: {
    hero: {
      eyebrow: "Sustainability",
      heading: "Packaging with a Purpose",
      sub: "Responsible manufacturing for a better tomorrow — without compromising performance.",
    },
    intro:
      "Sustainability is built into every layer of our operations. We believe excellent packaging and environmental responsibility reinforce each other — protecting goods today without compromising the world our children inherit.",
    pillars: [
      { name: "Recyclable Materials", desc: "Our PP and BOPP-based products are recyclable, supporting a circular approach to packaging." },
      { name: "Waste Reduction", desc: "Trim recovery and disciplined planning cut raw-material waste across the line." },
      { name: "Energy Efficiency", desc: "We invest in efficient machinery and monitor consumption to reduce our footprint." },
      { name: "Responsible Sourcing", desc: "We work with suppliers who meet our environmental and social standards." },
      { name: "Hygienic, Low-Impact Process", desc: "Clean manufacturing reduces contamination risk and environmental impact." },
      { name: "Compliance", desc: "We operate in line with applicable environmental regulations and good practice." },
    ],
  },

  certifications: {
    hero: {
      eyebrow: "Certifications",
      heading: "Quality You Can Verify",
      sub: "Independent standards underpin how we manufacture.",
    },
    intro: {
      eyebrow: "Accredited standards",
      heading: "Audited, Certified, Verifiable",
      sub: "Every standard below is externally audited — governing how the material is chosen, how the line is run, and how the finished bag is released.",
    },
    /* `status` drives the pill on each card: "certified" reads green,
       "inProgress" amber. Badge artwork is matched by `code` in site.ts. */
    statusLabels: { certified: "Certified", inProgress: "Under Implementation" },
    items: [
      {
        code: "ISO 9001",
        label: "Quality Management",
        status: "certified",
        desc: "Our foundational commitment to excellence. ISO 9001 certification ensures that our manufacturing processes, quality control, and customer service protocols adhere to rigorous international standards. This framework guarantees consistent, defect-free packaging solutions and a continuous drive for operational improvement.",
      },
      {
        code: "ISO 14001",
        label: "Environmental Management",
        status: "certified",
        desc: "Dedicated to minimizing our ecological footprint. This standard governs our approach to resource efficiency, waste reduction, and sustainable manufacturing practices, ensuring that our production facilities operate in harmony with environmental conservation goals.",
      },
      {
        code: "ISO 45001",
        label: "Health & Safety",
        status: "certified",
        desc: "Safety is built into our culture. ISO 45001 certification reflects our uncompromising dedication to occupational health and safety. We maintain a secure, risk-managed environment for our workforce, which translates into stable, uninterrupted production for our clients.",
      },
      {
        code: "ISO 22000:2018",
        label: "Food Safety Management System",
        status: "certified",
        desc: "Engineered for the food and agricultural sectors. ISO 22000:2018 integrates the principles of the Hazard Analysis and Critical Control Point (HACCP) system. This ensures that all packaging materials produced for human or animal consumption are manufactured under strict hygienic controls, preventing contamination and ensuring absolute food safety compliance.",
      },
      {
        code: "BRCGS",
        label: "Packaging Safety",
        status: "inProgress",
        desc: "We are currently in the advanced stages of implementing the BRCGS Global Standard for Packaging Materials. This globally recognized framework will further validate our commitment to product safety, quality, and operational criteria required by leading retail and food service brands.",
      },
    ],
  },

  careers: {
    hero: {
      eyebrow: "Careers",
      heading: "Build Something That Matters",
      sub: "Grow with a team that values ideas, integrity, and impact.",
    },
    intro:
      "Our people are our greatest asset. We foster an environment where ideas are valued, growth is encouraged, and every team member contributes to something meaningful — whether you're an engineer, a business-development professional, or just starting out.",
    perksHeading: "What We Offer",
    perks: [
      "Competitive compensation",
      "Learning & development",
      "Health & insurance cover",
      "Modern, safety-first facility",
      "A culture of accountability",
      "Room to grow quickly",
    ],
    openingsHeading: "Current Openings",
    openingsNote: "No open positions right now — but we're always glad to meet great people. Send us your resume and we'll be in touch.",
  },

  contact: {
    hero: {
      eyebrow: "Contact",
      heading: "Let's Talk Packaging",
      sub: "Send us a message and our team will respond within one business day.",
    },
    detailsHeading: "Reach Us Directly",
    mapHeading: "Find Us",
    labels: {
      address: "Address",
      phone: "Phone",
      email: "Email",
      exportEmail: "Export Enquiries",
      website: "Website",
      linkedin: "LinkedIn",
    },
    form: {
      heading: "Send an Enquiry",
      name: "Full Name",
      namePlaceholder: "Your full name",
      company: "Company / Organisation",
      companyPlaceholder: "Your company name",
      email: "Email Address",
      emailPlaceholder: "you@company.com",
      phone: "Phone Number",
      phonePlaceholder: "+91 00000 00000",
      type: "Inquiry Type",
      types: ["General Query", "Product Enquiry", "Request a Quote", "Careers", "Other"],
      subject: "Subject",
      subjectPlaceholder: "How can we help?",
      message: "Message",
      messagePlaceholder: "Tell us about your requirement — quantities, specifications, timeline…",
      submit: "Submit Enquiry",
      success: "Thank you! Your enquiry has been received. We'll get back to you within one business day.",
      again: "Send another enquiry",
      error: "Please complete the required fields.",
      sending: "Sending…",
      failure: "We couldn't submit your enquiry right now. Please try again, or email us directly.",
    },
  },

  faqs: {
    hero: { eyebrow: "FAQs", heading: "Frequently Asked Questions", sub: "Answers to the questions we hear most." },
    items: [
      { q: "What types of bags does MARLSBORO Group manufacture?", a: "We manufacture PP and BOPP woven bags (tube, EZ-open, pinch-bottom, block-bottom, carry bags), woven fabrics, and — through Velcon Flexible — multilayer rolls and pouches." },
      { q: "What is your production capacity?", a: "Our flagship capacity is 84 million tailored bags per annum across both business units, with an average output of around 30 million woven sacks per year." },
      { q: "Do you offer flexible packaging?", a: "Yes. Velcon Flexible LLP (est. 2021) produces multilayer rolls, pouches, spout pouches, stand-up pouches, and zippers for food, liquids, FMCG, and industrial use." },
      { q: "Can you customise printing and add-ons?", a: "Absolutely — BOPP lamination, holography, windows, liners, perforation, gussets, pallet packaging, and more, with high-definition multi-colour printing." },
      { q: "Which sectors do you serve?", a: "Sugar, agri commodities, fertiliser, animal feed, cement, and industrial chemicals — among others across food, agriculture, construction, and retail." },
      { q: "How do I request a quote?", a: "Use the Request a Quote button or the contact form with your specification, quantity, and timeline. Our team responds within one business day." },
    ],
  },

  legal: {
    privacy: {
      title: "Privacy Policy",
      updated: "This is placeholder copy for client and legal review.",
      body: [
        "MARLSBORO Group respects your privacy. This policy explains, in general terms, how information submitted through this website — such as via the enquiry form — is used to respond to your request.",
        "We use the details you provide solely to respond to enquiries and to provide the products and information you ask for. We do not sell your personal information.",
        "For any questions about this policy or your data, contact us at info@marlsboro.com.",
      ],
    },
    terms: {
      title: "Terms of Use",
      updated: "This is placeholder copy for client and legal review.",
      body: [
        "By using this website you agree to use it for lawful purposes only and not in any way that infringes the rights of others.",
        "Content on this site is provided for general information about MARLSBORO Group and its products, and may be updated at any time without notice.",
        "All brand names, logos, and product marks are the property of their respective owners.",
      ],
    },
  },

  footer: {
    tagline: "Manufacturer of BOPP woven bags, PP woven sacks, and flexible packaging solutions.",
    quickLinks: "Quick Links",
    explore: "Explore",
    getInTouch: "Get in Touch",
    rights: "All rights reserved.",
    links: {
      brochure: "Download Brochure",
      careers: "Careers",
      certifications: "Certifications",
      sustainability: "Sustainability",
      faqs: "FAQs",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },
  },

  product: {
    introduction: "Introduction",
    features: "Features",
    benefits: "Benefits",
    relatedIndustries: "Industries We Serve",
  },

  industry: {
    introduction: "Introduction",
    features: "Features",
    benefits: "Benefits",
    relatedProducts: "Related Products",
  },

  notFound: {
    title: "Page Not Found",
    body: "The page you're looking for doesn't exist or has moved.",
  },

  catalog: catalogEn,
};

export type Dict = typeof en;
