import type { CatalogText } from "../../data/catalog";

// English catalog copy — authored as the source of truth. Real, industry-accurate
// B2B content (other languages may translate a subset and fall back to English).
export const catalogEn: CatalogText = {
  products: {
    "pp-woven-bags": {
      name: "PP Woven Bags",
      tagline: "High-strength woven polypropylene sacks for bulk packaging",
      introduction:
        "PP woven bags are the workhorse of industrial and agricultural packaging — woven from high-tenacity polypropylene tapes into a fabric that is exceptionally strong yet light. Engineered to carry 5 to 50 kg of grains, fertilisers, chemicals, minerals and building materials, they protect the contents through filling, stacking, transport and storage while keeping cost per bag low.",
      features: {
        tensile: "High tensile & tear strength",
        lightweight: "Light in weight, easy to handle",
        customisable: "Fully customisable size & print",
        uvResistant: "UV-stabilised option for outdoor storage",
        breathable: "Breathable or laminated as required",
        recyclable: "Recyclable mono-material (PP)",
      },
      benefits: {
        durable: "Higher durability & reliability in transit",
        economical: "Cost-effective at scale",
        versatile: "Meets diverse load & content needs",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            importance: {
              heading: "Importance of Woven Packaging",
              body: "Woven packaging is to bulk goods what a foundation is to a building. A well-engineered woven bag holds its shape under load, resists punctures during rough handling, and shields the product from moisture and contamination — protecting both the goods and the brand that ships them.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Polypropylene granules are extruded into tapes, stretched for strength, then woven on circular looms into tubular fabric. The fabric is cut, optionally laminated and printed, and finally stitched or heat-cut and hemmed to the required bag specification.",
            },
            material: {
              heading: "Material Combination",
              body: "We select virgin and food-grade PP resins matched to the application, with masterbatch for colour and UV stabilisers where outdoor exposure is expected. Fabric weight, denier and mesh are tuned to the load the bag must carry.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: {
            material: "Material",
            gsm: "Fabric Weight",
            size: "Bag Size (W × L)",
            denier: "Denier",
            mesh: "Mesh",
            print: "Printing",
            load: "Loading Capacity",
            closure: "Closure",
          },
        },
        speciality: {
          label: "Speciality",
          blocks: {
            quality: {
              heading: "Our Speciality",
              body: "Consistent fabric weight and weave density, batch after batch — the difference between a bag that holds and one that fails at the seam. Every roll is checked for GSM, tensile strength and print registration before conversion.",
            },
            capacity: {
              heading: "Production Capacity",
              body: "With a flagship capacity of 84 million tailored bags a year, we serve high-volume programmes with dependable lead times and the flexibility to scale with your demand.",
            },
            chooseUs: {
              heading: "Why Choose Us",
              body: "In-house extrusion, weaving, lamination and printing under one roof means tighter quality control, faster turnaround, and a single accountable partner from tape to finished bag.",
            },
          },
        },
      },
    },

    "multilayer-pouches": {
      name: "Multilayer Pouches",
      tagline: "Barrier laminate pouches for food, FMCG and industrial fills",
      introduction:
        "Multilayer pouches laminate two to four films into a single flexible structure, each layer adding a property — printability, stiffness, sealability or barrier. The result is a lightweight, high-barrier pack that keeps food fresh, resists punctures, and showcases your brand with rotogravure-quality print, available as stand-up, three-side-seal and centre-seal formats.",
      features: {
        barrier: "High moisture & oxygen barrier",
        hermetic: "Reliable hermetic sealing",
        printHd: "Rotogravure HD print, up to 9 colours",
        structures: "2–4 layer structures to suit the fill",
        custom: "Zippers, spouts & tear-notches available",
      },
      benefits: {
        freshness: "Extends shelf life & freshness",
        branding: "Premium, full-surface branding",
        convenience: "Lightweight & consumer-friendly",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "By combining films such as PET, metallised PET and PE, a multilayer pouch delivers barrier and strength that no single film can. It protects sensitive contents while weighing a fraction of rigid packaging.",
            },
            structure: {
              heading: "Laminate Structure",
              body: "Structures are engineered to the product: a printable outer layer, an optional barrier middle layer for oxygen-sensitive goods, and a sealant inner layer for a strong, contamination-free seal.",
            },
            applications: {
              heading: "Applications",
              body: "Ideal for spices, snacks, coffee, dairy powders, detergents, agrochemicals and pet treats — anywhere freshness, barrier and branding need to travel together.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: {
            structure: "Laminate Structure",
            thickness: "Thickness",
            format: "Pouch Format",
            print: "Printing",
            feature: "Add-on Features",
            barrier: "Barrier",
          },
        },
        speciality: {
          label: "Speciality",
          blocks: {
            quality: {
              heading: "Barrier & Seal Integrity",
              body: "A pouch is only as good as its weakest seal. Controlled solventless lamination and inspected sealing ensure barrier performance and leak-free packs across every run.",
            },
            chooseUs: {
              heading: "Why Choose Us",
              body: "Our Velcon Flexible division brings rotogravure printing, solventless lamination and pouch conversion together — giving you one partner for the whole flexible-packaging journey.",
            },
          },
        },
      },
    },

    "zipper-closures": {
      name: "Zipper Closures",
      tagline: "Reclosable zippers for fresh, premium, consumer-friendly packs",
      introduction:
        "A zipper closure turns a single-use pack into a reusable one — letting consumers open, pour and reseal while keeping the contents fresh. A small add-on with an outsized impact on perceived value, it is increasingly expected on food, pet-food and retail packaging.",
      features: {
        reclose: "Airtight, multi-cycle reclose",
        freshness: "Keeps contents fresh after opening",
        tamper: "Tamper-evident options",
        easyOpen: "Easy-open, consumer-friendly action",
      },
      benefits: {
        consumerValue: "Adds clear value for the end consumer",
        premium: "Lifts the pack into a premium tier",
        lessWaste: "Less product waste, fewer secondary containers",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Zipper closures are applied to woven bags and flexible pouches as a reclosable opening. From press-to-close profiles to slider zippers, they balance a secure seal with effortless everyday use.",
            },
            options: {
              heading: "Options",
              body: "Choose press-to-close for economy, a slider for premium ease of use, or a pocket-zipper for a clean front-of-pack look. All integrate with our woven and flexible formats.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: {
            type: "Zipper Type",
            material: "Material",
            application: "Application",
            reusability: "Reusability",
          },
        },
      },
    },

    "d-cut-handles": {
      name: "D-Cut Handles",
      tagline: "Built-in carry handles for convenient, retail-ready woven bags",
      introduction:
        "A D-cut handle is punched directly into the bag's own woven material, giving shoppers a comfortable, integrated grip without a separate component. It turns a plain sack into a carry-friendly retail pack — popular for flour, rice, pet food and promotional bags.",
      features: {
        carry: "Comfortable, integrated carry grip",
        strength: "Reinforced to resist tearing",
        clean: "Clean built-in look, no add-on parts",
        custom: "Custom handle shape & position",
      },
      benefits: {
        convenience: "Effortless carrying for the end user",
        retail: "Retail-ready, shelf-friendly format",
        branding: "Keeps the full print surface for branding",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "D-cut handles are die-cut into the bag wall, usually with a reinforcing patch for strength — a sturdy, ergonomic opening that carries the pack without compromising the woven structure.",
            },
            options: {
              heading: "Options",
              body: "Choose a simple die-cut for economy or a patch-reinforced handle for heavier loads. Handle size and placement are tailored to the pack and the weight it carries.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: {
            type: "Handle Type",
            material: "Material",
            application: "Application",
            load: "Load Support",
          },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // WOVEN BAGS — new pages (placeholder copy, ready for data entry)
    // ═══════════════════════════════════════════════════════════════════
    "coated-uncoated-fabrics": {
      name: "Coated / Uncoated Fabrics",
      tagline: "Woven PP/BOPP fabric rolls, ready for your own conversion line",
      introduction:
        "Beyond finished bags, we supply woven PP and BOPP fabric as roll stock — coated or uncoated — for converters and manufacturers who print, laminate or stitch in-house. Fabric weight, weave density and coating are matched to the end use, from cement valve sacks to retail carry bags.",
      features: {
        moistureBarrier: "PE / acrylic coating for moisture resistance",
        uvStable: "UV-stabilised option for outdoor storage",
        customWidth: "Slit to any roll width on request",
        converterReady: "Consistent GSM and weave for reliable conversion",
      },
      benefits: {
        flexibility: "Convert to your own bag style and specification",
        costEfficient: "Buy fabric only, skip finished-bag overheads",
        consistentQuality: "Batch-to-batch consistency for long production runs",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Our woven fabric rolls are the same tape-grade PP used in our finished bags, supplied as uncoated fabric or coated with PE or acrylic for moisture and dust resistance. Rolls are slit to your required width and wound for direct feed into your conversion line.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "PP tapes are woven on circular or flat looms to the specified mesh and GSM, then optionally passed through an extrusion coating line before slitting and rewinding into rolls ready for dispatch.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { material: "Material", gsm: "Fabric Weight", width: "Roll Width", coating: "Coating" },
        },
      },
    },

    "bopp-ez-open-bags": {
      name: "BOPP EZ-Open Bags",
      tagline: "Easy-tear BOPP bags for fast, clean dispensing",
      introduction:
        "BOPP EZ-Open bags build a controlled tear feature into a laminated woven bag, so the pack opens cleanly along a defined line without scissors or knives. They keep the strength and print quality of a standard BOPP bag while speeding up opening at the point of use.",
      features: {
        easyTear: "Built-in tear line for clean, tool-free opening",
        cleanDispense: "Precise opening supports fast, tidy dispensing",
        tensile: "Full woven-core tensile strength retained",
        printReady: "Reverse-printed BOPP surface for vivid branding",
      },
      benefits: {
        consumerConvenience: "Faster, easier opening for the end user",
        lessSpillage: "Controlled tear reduces mess and product loss",
        fastLineSpeed: "Speeds up opening on high-throughput fill lines",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "An EZ-Open bag is a standard BOPP-laminated woven bag with a pre-weakened tear line engineered into the seam or panel, positioned so the bag opens along a predictable path.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "The tear line is scored or perforated during finishing, after lamination and printing, so it does not compromise print quality or bag strength before the point of use.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { material: "Material", gsm: "Fabric Weight", size: "Bag Size (W × L)", print: "Printing" },
        },
      },
    },

    "bopp-pinch-bottom-bags": {
      name: "BOPP Pinch Bottom Bags",
      tagline: "Flat, glued-base BOPP bags for a stackable retail pack",
      introduction:
        "Pinch bottom bags fold and glue the base into a flat seam, giving a pack that sits flush and stacks cleanly on a pallet or shelf. Paired with BOPP lamination, they combine retail-grade graphics with the flat-pack efficiency valued in flour, rice and feed categories.",
      features: {
        flatBase: "Flat, folded base for a stable stacked pack",
        gluedSeam: "Strong adhesive seam, no exposed stitching",
        stackable: "Uniform flat profile for efficient palletising",
        printHd: "HD reverse-printed BOPP graphics",
      },
      benefits: {
        warehouseEfficiency: "Denser, more stable pallet stacking",
        shelfStability: "Stands upright and square on shelf or floor",
        premiumLook: "Clean, seam-free appearance for retail packs",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "The bag base is folded into a pinch (satchel-style) seam and sealed with a high-strength adhesive, producing a flat bottom that stands and stacks better than a stitched or heat-cut base.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Woven fabric is laminated and printed, then the base is folded and glued on precision finishing lines that control seam strength and squareness across the run.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { material: "Material", gsm: "Fabric Weight", size: "Bag Size (W × L)", print: "Printing", closure: "Closure" },
        },
      },
    },

    "plwpp-block-bottom-bags": {
      name: "PLWPP Block Bottom Bags",
      tagline: "Square-based woven bags that stand and stack like a carton",
      introduction:
        "PLWPP block bottom bags use a square, carton-like base so the filled pack stands upright and stacks in tight, stable columns — ideal for cement, chemical granules and other dense fills moved through automated packing lines.",
      features: {
        squareBase: "Square block base for carton-like stability",
        cartonLike: "Stands upright even under heavy fill weight",
        highLoad: "Engineered for higher unit loads",
        dustProof: "Tight seams reduce dust leakage",
      },
      benefits: {
        palletEfficiency: "Square footprint maximises pallet density",
        retailReady: "Clean, structured look for branded bulk packs",
        durable: "Holds shape and strength through handling",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "The block bottom construction folds the base into a rectangular block, similar to a paper sack, so the filled bag stands square and resists toppling — a key requirement on automated valve-packing lines.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "PLWPP fabric is laminated for strength and print clarity, then block-bottom formed and sealed on dedicated finishing equipment calibrated to the target fill weight.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { material: "Material", gsm: "Fabric Weight", size: "Bag Size (W × L)", print: "Printing", load: "Loading Capacity" },
        },
      },
    },

    "plwpp-carry-bags": {
      name: "PLWPP Carry Bags",
      tagline: "Reusable woven carry bags with printed branding",
      introduction:
        "PLWPP carry bags are lightweight, reusable woven bags finished with an integrated handle and full-surface print — a durable alternative to single-use plastic for retail, grocery and promotional carrying.",
      features: {
        reusable: "Built for repeated everyday use",
        printedBranding: "Full-surface print for strong shelf branding",
        comfortHandle: "Reinforced handle for a comfortable carry",
        lightweight: "Light, foldable format for easy storage",
      },
      benefits: {
        brandVisibility: "Walking billboard for the brand at point of sale",
        sustainability: "Reusable format reduces single-use waste",
        consumerAppeal: "Practical, well-finished bag consumers keep and reuse",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Carry bags are cut and finished from PLWPP fabric with a reinforced handle, sized for retail or promotional use, and printed edge-to-edge for maximum brand visibility.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Laminated PLWPP fabric is printed, cut to size, and the handle is stitched or heat-sealed with reinforcement patches at the stress points to extend reusable life.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { material: "Material", gsm: "Fabric Weight", size: "Bag Size (W × L)", print: "Printing", load: "Loading Capacity" },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // FLEXIBLE PACKAGING — new pages
    // ═══════════════════════════════════════════════════════════════════
    "multilayer-rolls": {
      name: "Multilayer Rolls",
      tagline: "Printed laminate rollstock for form-fill-seal lines",
      introduction:
        "Multilayer rolls supply the same barrier laminates used in our pouches as rollstock, printed and slit to width for form-fill-seal (FFS) equipment. They give converters and packers a ready-to-run film without the tooling or minimums of pre-formed pouches.",
      features: {
        printQuality: "Rotogravure print quality carried through to rollstock",
        sealIntegrity: "Sealant layer tuned to your FFS equipment",
        customStructure: "2–4 layer structures matched to the product",
        rollFormat: "Slit and wound to your machine's web width",
      },
      benefits: {
        lineCompatibility: "Runs directly on standard FFS lines",
        wasteReduction: "Precision slitting minimises trim waste",
        consistentRuns: "Stable thickness and print registration across the roll",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Rollstock is built from the same barrier film combinations as our pouches — PET, metallised PET, BOPP and PE — so packers get pouch-grade protection in a format their own equipment can form, fill and seal.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Films are laminated and rotogravure printed to the finished structure, then slit to the specified web width and rewound onto cores sized for the customer's FFS machine.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", width: "Roll Width", print: "Printing" },
        },
      },
    },

    "liquid-packaging-pouches": {
      name: "Liquid Packaging Pouches",
      tagline: "Leak-resistant pouches for liquids and pastes",
      introduction:
        "Liquid packaging pouches use a high seal-strength laminate to hold liquids, pastes and gels securely through transport and shelf life — a lighter, lower-cost alternative to bottles and jars for detergents, sauces and liquid concentrates.",
      features: {
        leakResistant: "High seal-strength laminate for secure containment",
        punctureResistant: "Robust film resists transit punctures",
        hermeticSeal: "Fully hermetic seal on all edges",
        custom: "Gusset, spout and sachet formats available",
      },
      benefits: {
        transportSafety: "Reduced risk of leakage in transit and storage",
        shelfLife: "Barrier film protects product quality over time",
        lightweight: "Lower shipping weight than rigid containers",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Built from PET/PE or nylon/PE laminates chosen for seal strength and chemical compatibility, these pouches are engineered specifically to contain flowable liquids without leakage.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Laminated film is converted into the chosen format — gusseted, spouted or sachet — with reinforced seals at stress points to withstand the weight and movement of liquid fills.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", print: "Printing" },
        },
      },
    },

    "spout-pouches": {
      name: "Spout Pouches",
      tagline: "Resealable spout for pourable, on-the-go products",
      introduction:
        "Spout pouches add a moulded spout and tamper-evident cap to a stand-up pouch, giving consumers a clean pour and a reliable reseal. Popular for liquid detergents, sauces and beverages where portion control and convenience matter.",
      features: {
        reseal: "Tamper-evident cap allows repeated resealing",
        easyPour: "Spout placement engineered for clean, drip-free pouring",
        standUp: "Gusseted base stands upright on shelf",
        tamperEvidentCap: "Cap seal signals first use to the consumer",
      },
      benefits: {
        onTheGo: "Convenient, portable format for on-the-go use",
        portionControl: "Spout size supports controlled dispensing",
        premiumShelf: "Stands out next to bottled alternatives",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A moulded plastic spout is fitted into a stand-up pouch during forming and sealed for leak-free performance, with the spout positioned at a corner or the centre depending on the fill and dispensing need.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "PET/PE or BOPP/PE laminate is formed into a stand-up pouch, the spout is inserted and heat-sealed into the seam, and a tamper-evident cap is applied before filling.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", spout: "Spout Type", print: "Printing" },
        },
      },
    },

    "side-seal-pouches": {
      name: "Side-Seal Pouches",
      tagline: "Lightweight two-side-seal pouches for fast fill lines",
      introduction:
        "Side-seal (pillow) pouches are sealed along two edges, giving the simplest, most economical flexible pack for products that don't need a stand-up base — well suited to high-speed fill lines and lightweight fills.",
      features: {
        lightweightSeal: "Minimal film use for a lightweight pack",
        fastFill: "Simple geometry suits high-speed filling",
        clearWindow: "Optional clear panel to show the product",
        costEfficient: "Lower film and tooling cost than formed pouches",
      },
      benefits: {
        highSpeedLines: "Fits fast, high-volume packing lines",
        economical: "Cost-effective for everyday, high-run products",
        versatileFill: "Suits powders, granules and small solid items",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "The film is folded and sealed along two side edges to form a simple pillow pack — the fastest and most economical pouch format to produce and fill at volume.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "BOPP/CPP or PET/PE laminate is fed through a horizontal or vertical form-fill-seal line, folded, filled and side-sealed in a single continuous pass.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", print: "Printing" },
        },
      },
    },

    "4-side-seal-pouches": {
      name: "4-Side-Seal Pouches",
      tagline: "Flat sachets sealed on all four edges",
      introduction:
        "4-side-seal pouches are sealed on every edge to form a flat, tamper-resistant sachet — the standard format for single-serve spices, condiments and sample-size products where a compact, hygienic pack is the priority.",
      features: {
        flatSachet: "Flat, compact sachet profile",
        portionPack: "Ideal size range for single-serve portions",
        tearNotch: "Tear-notch option for easy opening",
        hermeticSeal: "Fully sealed on all four edges",
      },
      benefits: {
        singleServe: "Purpose-built for single-serve and sample packs",
        hygienic: "Fully enclosed pack protects contents until use",
        costEffective: "Low film usage keeps unit cost competitive",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Two film webs (or a single web folded) are sealed along all four edges, producing a flat sachet that fully encloses the product with no exposed film edge.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "PET/PE or foil laminate is fed through a horizontal form-fill-seal line where the pack is formed, filled and sealed on all sides, with an optional tear-notch added in the same pass.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", print: "Printing" },
        },
      },
    },

    "d-cut-pouches": {
      name: "D-Cut Pouches",
      tagline: "Built-in die-cut handle for easy carrying",
      introduction:
        "D-Cut pouches punch a handle directly into the pouch film, giving a comfortable integrated grip without a separate handle component — a practical upgrade for heavier or bulkier flexible packs sold at retail.",
      features: {
        integratedHandle: "Handle die-cut directly into the pouch film",
        easyCarry: "Comfortable grip for heavier or bulkier packs",
        reinforced: "Reinforced handle area to resist tearing",
        printSurface: "Full print surface preserved around the handle",
      },
      benefits: {
        consumerConvenience: "Easier to carry off the shelf and home",
        retailAppeal: "Retail-ready format with no add-on parts",
        noAddOnParts: "One-piece construction keeps cost and complexity down",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A handle shape is die-cut into the pouch wall near the top seal, usually with a reinforced border, giving a sturdy carry point without adding a separate handle component.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "BOPP/PE or PET/PE laminate is printed and converted into a centre- or side-seal pouch, with the handle die-cut and reinforced during the finishing stage.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", print: "Printing" },
        },
      },
    },

    "stand-up-pouches": {
      name: "Stand-Up Pouches",
      tagline: "Gusseted base that stands upright on shelf",
      introduction:
        "Stand-up pouches use a bottom gusset so the filled pack stands upright on shelf, presenting the full front panel to the shopper — the go-to format for snacks, pet food and household products that need shelf presence and optional reclose.",
      features: {
        selfStanding: "Bottom gusset lets the pack stand unsupported",
        gussetedBase: "Wider base improves shelf and case stability",
        shelfPresence: "Full front-panel print for maximum shelf impact",
        custom: "Zipper, spout or tear-notch add-ons available",
      },
      benefits: {
        shelfImpact: "Stronger stand-out versus flat pouches or bags",
        spaceEfficient: "Stable footprint for dense shelf and case packing",
        resealableOption: "Can be combined with a zipper for reclosing",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A folded bottom gusset expands under fill weight so the pouch stands upright without external support, while the flat front and back panels carry full-bleed print.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "PET/PE or BOPP/CPP laminate is printed, then formed with a bottom gusset and side or centre seals, with zipper, spout or tear-notch options added during the same finishing pass.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", print: "Printing" },
        },
      },
    },

    "zipper-pouches": {
      name: "Zipper Pouches",
      tagline: "Press-to-close zip for repeated reclosing",
      introduction:
        "Zipper pouches integrate a reclosable zip track into the pack, letting consumers open, use part of the contents, and reseal to keep the rest fresh — a standard expectation on food, pet food and household refill packs.",
      features: {
        recloseZip: "Press-to-close or slider zip for repeated use",
        freshness: "Reseal keeps unused contents fresh",
        easyOpenTear: "Tear-notch above the zip for first opening",
        custom: "Available on stand-up and 3-side-seal formats",
      },
      benefits: {
        repeatUse: "Supports multi-use packs, not just single-serve",
        consumerValue: "Adds visible, tangible value to the pack",
        lessWaste: "Reduces product waste from spoilage after opening",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A plastic zip track is heat-sealed across the pouch below the top seal, with a tear-notch positioned above it so the first opening is separate from the reusable reclose.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "The zipper film is fed and sealed in-line during pouch forming on PET/PE or BOPP/PE laminate, positioned to leave a clean tear strip above and a secure reclose below.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", format: "Pouch Format", zipper: "Zipper Type", print: "Printing" },
        },
      },
    },

    "up-to-4-layer": {
      name: "Up to 4-Layer",
      tagline: "Laminates engineered up to four bonded layers",
      introduction:
        "When a single barrier property isn't enough, we build laminates of two to four bonded films — combining printability, strength, barrier and sealability into one structure engineered for the specific product and shelf-life target.",
      features: {
        barrierCustom: "Barrier layer selected for oxygen or moisture sensitivity",
        layerFlex: "2, 3 or 4-layer builds to match the requirement",
        printOuter: "Printable outer layer for high-definition graphics",
        sealInner: "Sealant inner layer for a strong, clean seal",
      },
      benefits: {
        tailoredBarrier: "Barrier performance matched to shelf-life needs",
        costOptimised: "Add layers only where they earn their cost",
        productProtection: "Layered structure guards against oxygen, moisture and light",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Each layer in the laminate does a specific job — an outer layer for print and stiffness, an optional middle layer for barrier, and an inner sealant layer for a reliable seal — combined to the level the product needs.",
            },
            process: {
              heading: "Manufacturing Process",
              body: "Films such as PET, metallised PET, nylon and PE are bonded through solventless lamination in the required layer combination, then printed and slit or converted to the final format.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { structure: "Laminate Structure", thickness: "Thickness", layers: "Number of Layers", print: "Printing" },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // ADD-ONS & CUSTOMISATIONS — new pages
    // ═══════════════════════════════════════════════════════════════════
    "perforation": {
      name: "Perforation",
      tagline: "Micro-perforation for ventilation and freshness control",
      introduction:
        "Perforation adds precisely placed micro-holes or tear-perforated lines to a woven bag or pouch, letting trapped moisture or gas escape, or making a panel easy to tear away — added at the finishing stage without weakening the overall pack.",
      features: {
        ventilation: "Micro-perforation vents trapped moisture and gas",
        microPerforation: "Hole size and density controlled precisely",
        freshnessControl: "Reduces condensation build-up inside the pack",
        customPattern: "Pattern and placement engineered to the product",
      },
      benefits: {
        reducedCondensation: "Less moisture build-up during storage and transit",
        extendedFreshness: "Supports freshness for produce and field inputs",
        safeHandling: "Tear-perforation option for controlled, easy opening",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Perforation is applied as a controlled pattern of micro-holes, or as a tear line, added to the woven bag or pouch surface at a density calculated for the required breathability without compromising strength.",
            },
            options: {
              heading: "Options",
              body: "Choose micro-perforation for ventilation on breathable produce and seed packs, or tear-perforation for an easy-open panel on bags and pouches that don't need airflow.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Perforation Type", application: "Application" },
        },
      },
    },

    "liner": {
      name: "Liner",
      tagline: "Inner liner for moisture and product protection",
      introduction:
        "A liner adds a separate inner film layer inside a woven bag, sealing out moisture, dust and contamination for fine powders, hygroscopic chemicals and other fills that the outer woven fabric alone cannot fully contain.",
      features: {
        moistureBarrier: "Seals out ambient moisture and dust",
        contamProtection: "Protects contents from contamination in transit",
        easyFit: "Fitted to match the bag's exact dimensions",
        custom: "Loose-fit, form-fit or valve-liner options",
      },
      benefits: {
        productProtection: "Keeps fine or sensitive fills clean and dry",
        shelfLife: "Extends usable shelf life of hygroscopic products",
        cleanHandling: "Reduces dusting and residue during filling",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "The liner is a PE or PP film insert fitted inside the woven outer bag, providing a moisture and dust barrier that the woven fabric alone does not offer, without changing the external handling or stacking of the bag.",
            },
            options: {
              heading: "Options",
              body: "A loose-fit liner suits general moisture protection, a form-fit liner matches the exact bag shape for a snug fit, and a valve liner supports automated valve-filling lines.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Liner Type", material: "Material", application: "Application" },
        },
      },
    },

    "window-view": {
      name: "Window View",
      tagline: "Clear panel to show the product inside",
      introduction:
        "A window view inserts a clear film panel into the bag or pouch wall so shoppers and quality inspectors can see the product without opening the pack — a simple, effective way to build trust at the point of sale.",
      features: {
        clearPanel: "High-clarity film panel for product visibility",
        productVisibility: "Lets shoppers see colour, size and quality",
        customShape: "Die-cut to any shape or position on the pack",
        secureSeal: "Sealed edge-to-edge, no loss of pack integrity",
      },
      benefits: {
        consumerTrust: "Builds confidence by showing the real product",
        shelfAppeal: "Adds visual interest alongside printed graphics",
        qualityCheck: "Supports quick visual inspection before opening",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A section of the printed film is replaced with a clear BOPP or PET panel, die-cut to the desired shape and heat-sealed into the pack wall so the seal integrity of the bag is unaffected.",
            },
            options: {
              heading: "Options",
              body: "Windows can be a small die-cut cut-out or a full front panel, positioned to showcase the product while still leaving room for branding and mandatory label information.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Window Type", material: "Material", application: "Application" },
        },
      },
    },

    "holography": {
      name: "Holography",
      tagline: "Holographic finishes for shelf appeal and security",
      introduction:
        "Holography applies a metallised, light-refracting finish to the pack surface — used both to catch the eye on shelf and as a visible security cue that helps consumers distinguish genuine product from counterfeits.",
      features: {
        shelfShine: "Light-refracting finish stands out on shelf",
        brandDifferentiation: "Distinctive look versus flat-printed competitors",
        antiCounterfeit: "Visible cue that supports anti-counterfeit efforts",
        customDesign: "Registered or all-over holographic patterns available",
      },
      benefits: {
        premiumPerception: "Lifts perceived quality and shelf standout",
        brandProtection: "Adds a visible layer of counterfeit deterrence",
        standOut: "Differentiates the pack in a crowded category",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A metallised holographic film is laminated onto the pack surface, either as a registered pattern aligned to the print or as an all-over foil effect, adding shine and a security dimension in one step.",
            },
            options: {
              heading: "Options",
              body: "Choose a registered hologram for brand marks and logos, or an all-over metallised holographic film for maximum shelf shine across the full pack surface.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Holography Type", application: "Application" },
        },
      },
    },

    "gusset": {
      name: "Gusset",
      tagline: "Side or bottom gussets for added capacity",
      introduction:
        "A gusset folds extra fabric or film into the side or base of a bag or pouch, expanding as it fills so the pack holds more volume for the same footprint — used across both woven bags and flexible pouches wherever extra capacity is needed.",
      features: {
        sideGusset: "Side gussets expand pack width under fill",
        bottomGusset: "Bottom gussets create a stable, standing base",
        capacityBoost: "Increases usable volume without a larger footprint",
        customSize: "Gusset depth engineered to the target fill volume",
      },
      benefits: {
        moreVolume: "More product per pack at the same base size",
        stability: "Improved balance and stacking once filled",
        flexibleFormat: "Applies across woven bags and flexible pouches",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Extra fabric or film is folded into the side seams or the base during forming, lying flat when empty and expanding outward as the pack fills, to accommodate bulkier or heavier product volumes.",
            },
            options: {
              heading: "Options",
              body: "A side gusset adds width capacity to bags and pouches; a bottom gusset adds a standing base, most often combined with stand-up pouches or block-bottom bags.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Gusset Type", size: "Gusset Size", application: "Application" },
        },
      },
    },

    "pallet-packaging": {
      name: "Pallet Packaging",
      tagline: "Heavy-duty formats built for palletised loads",
      introduction:
        "Pallet packaging covers pallet covers and wrap-style bags engineered to protect and stabilise a fully loaded pallet through transport and storage — a heavy-duty complement to our unit-level woven bags and sacks.",
      features: {
        heavyDuty: "Built to the weight and abrasion of pallet-level loads",
        palletWrap: "Sized to fit standard pallet footprints",
        loadStability: "Helps keep stacked units secure in transit",
        custom: "Sizes and materials engineered to the load profile",
      },
      benefits: {
        transportSafety: "Reduces load shift and damage in transit",
        warehouseEfficiency: "Keeps palletised stock tidy and secure in storage",
        damageReduction: "Protects unit packs from dust, moisture and abrasion",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Pallet-level packaging is built from heavier-gauge PP woven fabric or PE film, sized to cover or wrap a fully stacked pallet and rated for the combined weight and handling stresses of bulk transport.",
            },
            options: {
              heading: "Options",
              body: "A pallet cover shields stacked units from dust and moisture during storage; a pallet wrap bag fully encloses the load for transport, with material and gauge selected to the load weight.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Packaging Type", material: "Material", application: "Application" },
        },
      },
    },

    "backseam": {
      name: "Backseam",
      tagline: "Centre back seam for a clean tubular pack",
      introduction:
        "A backseam closes a flat sheet of film or fabric into a tube along a single centre seam, giving a clean, strong closure with minimal material overlap — used across woven bags and flexible rollstock converted into tubular packs.",
      features: {
        cleanTube: "Forms a neat, seamless-looking tubular pack",
        seamStrength: "Sealed or stitched for consistent seam strength",
        minimalOverlap: "Narrow overlap keeps material use efficient",
        custom: "Centre-fold or lap-seam construction available",
      },
      benefits: {
        tidyAppearance: "Clean finish supports strong shelf presentation",
        structuralIntegrity: "Reliable seam strength across the full run",
        printClarity: "Minimal seam interruption to printed graphics",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "The flat web is folded into a tube and closed along a single back seam — either a centre-fold seam or a lap seam — chosen based on the material, strength requirement and finishing equipment used.",
            },
            options: {
              heading: "Options",
              body: "A centre-fold back seam gives the cleanest visual finish for printed packs; a lap seam offers a wider bonding area for higher seam strength on heavier-duty bags.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Seam Type", application: "Application" },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════
    // SECURITY FEATURES — new pages
    // ═══════════════════════════════════════════════════════════════════
    "holographic-film": {
      name: "Holographic Film",
      tagline: "Tamper-evident holographic layers for brand security",
      introduction:
        "Holographic film laminates a metallised, light-refracting layer onto packaging as a visible, hard-to-replicate security cue — reassuring buyers that the pack is genuine while adding a distinctive shine on shelf.",
      features: {
        tamperEvident: "Visible marker that discourages tampering",
        antiCounterfeit: "Difficult-to-replicate holographic pattern",
        brandShine: "Distinctive light-refracting shelf presence",
        customHologram: "Custom registered designs available",
      },
      benefits: {
        brandProtection: "Adds a recognisable layer of authenticity",
        consumerConfidence: "Reassures buyers the product is genuine",
        premiumShelf: "Elevates shelf presentation alongside plain competitors",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "A metallised BOPP or PET holographic film is laminated onto the pack, either as a full-surface effect or a registered pattern aligned to specific brand marks, so genuine packs are visually distinct at a glance.",
            },
            options: {
              heading: "Options",
              body: "Choose an overt, all-over holographic finish for maximum shelf shine, or a registered hologram tied to logos and specific security marks for tighter brand control.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Film Type", material: "Material", application: "Application" },
        },
      },
    },

    "qr-codes": {
      name: "QR Codes",
      tagline: "Scannable codes for tracking and engagement",
      introduction:
        "QR codes printed on the pack link each unit to a digital record — supporting batch traceability, consumer engagement campaigns, and authentication checks from a simple smartphone scan.",
      features: {
        scanTrack: "Instant scan-to-verify from any smartphone",
        batchTraceability: "Links each pack to batch and production data",
        consumerEngagement: "Opens a channel to consumer-facing content",
        custom: "Static or dynamic codes to suit the programme",
      },
      benefits: {
        supplyChainVisibility: "Improves traceability across the supply chain",
        marketingReach: "Connects packaging to digital brand engagement",
        authenticationSupport: "Adds a scannable layer to anti-counterfeit efforts",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Each QR code is generated and printed in-line during production, encoding a unique or batch-level reference that links the physical pack to a digital record accessible with any smartphone camera.",
            },
            options: {
              heading: "Options",
              body: "A static QR code suits fixed information such as product details; a dynamic QR code allows the linked content to be updated after printing, useful for campaigns and traceability systems.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "QR Code Type", application: "Application" },
        },
      },
    },

    "barcodes": {
      name: "Barcodes",
      tagline: "Standard barcoding for retail and logistics",
      introduction:
        "Standard 1D and 2D barcodes are printed directly onto the pack for compatibility with retail point-of-sale and warehouse scanning systems, keeping products moving smoothly through the supply chain.",
      features: {
        standardCompliant: "Printed to standard retail barcode symbologies",
        fastScan: "High-contrast print for reliable first-scan reads",
        inventoryReady: "Compatible with standard warehouse scanning systems",
        custom: "1D or 2D formats to match the application",
      },
      benefits: {
        retailCompatibility: "Scans cleanly at retail checkout",
        logisticsEfficiency: "Speeds up receiving, picking and dispatch",
        accuracy: "Reduces manual entry errors across the supply chain",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Barcodes are generated to the required symbology and printed inline during bag or pouch production, positioned and sized to meet standard retail and logistics scanning requirements.",
            },
            options: {
              heading: "Options",
              body: "Choose a standard 1D barcode (EAN/UPC) for retail checkout compatibility, or a 2D barcode where more data density is needed for logistics or traceability.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Barcode Type", format: "Format", application: "Application" },
        },
      },
    },

    "product-authentication": {
      name: "Product Authentication",
      tagline: "Covert and overt anti-counterfeit marks",
      introduction:
        "Product authentication combines visible and hidden security features into the pack, giving brands a layered way to verify genuine product and deter counterfeiters — tailored to the risk level of the product line.",
      features: {
        covertMarks: "Hidden markers visible only under verification",
        overtMarks: "Visible security features for at-a-glance checks",
        trackTrace: "Supports track-and-trace verification programmes",
        custom: "Feature combination selected per risk profile",
      },
      benefits: {
        counterfeitDeterrence: "Raises the cost and difficulty of counterfeiting",
        brandTrust: "Gives buyers a way to verify genuine product",
        complianceReady: "Supports regulatory and industry authentication needs",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Authentication features combine overt elements — visible to any buyer — with covert elements checkable only by the brand or an authorised inspector, layered onto the pack during production.",
            },
            options: {
              heading: "Options",
              body: "Options include security ink, micro-text, holographic marks and QR-linked verification, combined according to how much protection the product line requires.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Authentication Type", method: "Method", application: "Application" },
        },
      },
    },

    "brand-protection": {
      name: "Brand Protection",
      tagline: "Layered features that safeguard your brand",
      introduction:
        "Brand protection brings holography, coded traceability and authentication marks together into a single, coordinated package — giving brand owners end-to-end coverage against counterfeiting and grey-market diversion.",
      features: {
        layeredSecurity: "Combines multiple security features in one package",
        forensicMarking: "Optional forensic-level marking for investigations",
        exclusiveDesign: "Brand-exclusive security designs, not shared stock patterns",
        custom: "Package configured to the brand's risk and budget",
      },
      benefits: {
        revenueProtection: "Reduces revenue lost to counterfeit product",
        reputationSafeguard: "Protects brand reputation from fake goods",
        customerTrust: "Reinforces buyer confidence in every pack",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Overview",
              body: "Rather than a single feature, brand protection packages combine holographic film, QR or barcode traceability, and covert or overt authentication marks into one coordinated specification for the pack.",
            },
            options: {
              heading: "Options",
              body: "Packages are scoped to the brand's specific counterfeiting risk — from a single visible deterrent for lower-risk lines to a full covert-and-overt combination for high-value or frequently copied products.",
            },
          },
        },
        spec: {
          label: "Specification",
          rows: { type: "Protection Type", method: "Method", application: "Application" },
        },
      },
    },
  },

  industries: {
    "food-agriculture": {
      name: "Food & Agricultural Commodities",
      tagline: "Hygienic, strong packaging for staple foods and farm produce.",
      introduction:
        "Food-grade, pest-resistant woven bags for rice, flour, sugar, pulses, and other staples — engineered for hygiene, strength, and clean branding.",
      challenges: {},
      features: {
        hygienic: "Food-grade materials suited to direct contact",
        pestResistant: "Tight weave and seams resist pest ingress",
        printedBranding: "HD print for retail-facing staple brands",
        bulkAndRetail: "Formats for both bulk trade and retail packs",
      },
      benefits: {
        freshness: "Protects staples from moisture and contamination",
        compliance: "Meets food-contact expectations for staple goods",
        shelfAppeal: "Print quality that supports retail brand recognition",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Rice, flour, sugar and pulses move in enormous volumes between farms, mills and retail shelves, and every touchpoint puts the bag at risk of moisture, pests and rough handling. We supply hygienic, food-grade woven and laminated bags sized for both bulk trade lots and retail-ready packs.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "Fabric weight and weave density are set to resist tearing under bulk handling, while BOPP lamination is used wherever retail shelf presentation and print clarity matter more than raw bulk economy.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { rice: "Rice", flour: "Wheat Flour", sugar: "Refined Sugar", pulses: "Pulses & Grains" },
        },
      },
    },
    "animal-pet": {
      name: "Animal & Pet Nutrition",
      tagline: "Odour-neutral, retail-ready packs for feed and nutrition.",
      introduction:
        "Compliant, odour-neutral packaging for animal feed, aqua feed, and pet nutrition, with high-definition print for shelf appeal.",
      challenges: {},
      features: {
        odourNeutral: "Materials selected to avoid odour transfer",
        moistureControl: "Barrier options to protect feed from moisture",
        printReady: "HD print for competitive pet-food shelf presence",
        bulkOrRetail: "Bulk feed sacks and retail pet-food pouches alike",
      },
      benefits: {
        freshness: "Keeps feed and pet food fresh through storage",
        brandAppeal: "Retail-grade print supports premium pet brands",
        handlingEase: "Practical formats for farms and retail alike",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Feed and pet nutrition products span bulk cattle and aqua feed through to premium retail pet food, each with different packaging priorities — from rugged bulk sacks to shelf-ready barrier pouches.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "Bulk feed favours robust, cost-efficient PP woven bags, while retail pet food benefits from multilayer barrier pouches that lock in freshness and aroma and carry high-definition brand graphics.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { petFood: "Pet Food", cattleFeed: "Cattle & Poultry Feed", aquaFeed: "Aqua Feed" },
        },
      },
    },
    "agri-crop": {
      name: "Agriculture & Crop Protection",
      tagline: "UV-stable, chemical-resistant bags for inputs.",
      introduction:
        "Durable, UV-stabilised bags for fertilisers, seeds, and crop-protection products that hold up in field and storage conditions.",
      challenges: {},
      features: {
        uvStable: "UV-stabilised fabric for open-air field storage",
        chemicalResistant: "Materials selected for agrochemical compatibility",
        tamperEvident: "Sealed formats support safe handling of inputs",
        bulkSizes: "Sizes matched to fertiliser, seed and agrochemical fills",
      },
      benefits: {
        fieldDurability: "Holds up to sun, dust and rough field handling",
        storageLife: "Protects inputs through extended storage periods",
        safeHandling: "Reduces spillage and exposure risk during use",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Fertilisers, seeds and crop-protection products are stored in the open and handled repeatedly between distributor, dealer and farm, so packaging needs to withstand sun, moisture and rough field conditions without failing.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "UV-stabilised PP woven fabric resists degradation in open storage, while high-barrier multilayer pouches protect moisture- and light-sensitive crop-protection formulations through their full shelf life.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { fertiliser: "Fertilisers", seeds: "Seeds", agrochemicals: "Agrochemicals" },
        },
      },
    },
    "chemicals-industrial": {
      name: "Chemicals & Industrial Products",
      tagline: "Safe containment for powders and granules.",
      introduction:
        "Moisture-proof, robust packaging engineered for the safe transport of powders, granules, and industrial chemicals.",
      challenges: {},
      features: {
        dustProof: "Sealed liners and seams contain fine powders",
        chemicalGrade: "Materials selected for chemical compatibility",
        highLoad: "Reinforced formats for dense industrial fills",
        custom: "Liner, gusset and closure options engineered to the fill",
      },
      benefits: {
        containmentIntegrity: "Keeps powders and granules securely contained",
        regulatoryReady: "Supports safe handling of industrial materials",
        safeTransport: "Robust construction reduces in-transit failure",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Industrial chemicals, resins and additives are typically fine, dense or moisture-sensitive, so the packaging has to contain the product securely from filling through to end use, often across multiple handling stages.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "PE liners inside woven bags stop fine powders from sifting through the fabric, while block-bottom formats give dense granules and resins a stable, stackable footprint for warehouse and transport handling.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { powders: "Fine Powders", granules: "Granules", resins: "Industrial Resins", additives: "Chemical Additives" },
        },
      },
    },
    "home-care": {
      name: "Home Care Products",
      tagline: "Vivid, high-barrier packs for household goods.",
      introduction:
        "Brand-forward, high-barrier packaging for detergents and household products, with vibrant multi-colour printing.",
      challenges: {},
      features: {
        highBarrier: "Barrier film protects fragrance and active ingredients",
        vividPrint: "Vibrant multi-colour print for shelf standout",
        spillResistant: "Reliable seals for powders and liquids alike",
        custom: "Spout, zipper and stand-up options available",
      },
      benefits: {
        shelfStandout: "Vivid graphics compete strongly at retail",
        productProtection: "Keeps actives and fragrance stable over shelf life",
        consumerConvenience: "Pour, dose and reclose formats for everyday use",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Detergents and household products compete heavily on shelf appeal while needing packaging that reliably contains powders, liquids and gels without leakage or loss of fragrance and active ingredients.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "Woven bags with vivid flexo print suit powder detergents at value price points, while high-barrier stand-up and spout pouches give liquid and gel formats a premium, resealable retail presentation.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { detergentPowder: "Detergent Powder", liquidCleaner: "Liquid Cleaners", fabricCare: "Fabric Care" },
        },
      },
    },
    "construction-building": {
      name: "Construction & Building Materials",
      tagline: "Heavy-duty bags built for rough handling.",
      introduction:
        "Tough woven sacks for cement, tile adhesives, wall finishes, and aggregates — engineered for load and rough handling.",
      challenges: {},
      features: {
        highGsm: "High-GSM fabric built for dense construction fills",
        dustProof: "Tight weave and seams reduce dust leakage",
        packerCompatible: "Valve formats suited to automated packing lines",
        heavyLoad: "Reinforced for rough site and yard handling",
      },
      benefits: {
        reducedLoss: "Less dust leakage and product loss in transit",
        stackable: "Square, stable formats for tight pallet stacking",
        roughHandling: "Holds up to hooks, drops and site handling",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Cement, tile adhesives and aggregates are heavy, abrasive fills moved through automated packing lines and rough site handling, so bag strength and dust containment are the priority over shelf presentation.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "High-GSM block-bottom bags with valve closures run efficiently on automated cement packing lines, while heavier woven PP sacks with coating options handle dust-prone aggregates and adhesive powders.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { cement: "Portland Cement", tileAdhesive: "Tile Adhesives", aggregates: "Dry Aggregates" },
        },
      },
    },
    "mining-energy": {
      name: "Mining & Energy",
      tagline: "Industrial-strength bulk packaging.",
      introduction:
        "Puncture- and tear-resistant bulk packaging for minerals, ores, and energy by-products.",
      challenges: {},
      features: {
        punctureResistant: "Heavy-duty fabric resists sharp, abrasive fills",
        highLoad: "Built for dense mineral and ore loads",
        weatherResistant: "Holds up to open-air stockpile conditions",
        custom: "Sizes and coatings engineered to the material",
      },
      benefits: {
        bulkEfficiency: "Efficient bulk handling of heavy raw materials",
        durability: "Withstands abrasive, high-load contents",
        safeStacking: "Stable footprint for yard and warehouse stacking",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Minerals, ores and energy by-products are abrasive, dense and often stored outdoors, demanding bags that resist puncture and weathering while remaining efficient to fill, stack and transport in bulk.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "Heavy-duty woven PP sacks handle the weight and abrasion of raw minerals, while coated fabric options add moisture resistance for by-products stored in exposed stockpile conditions.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { minerals: "Minerals & Ores", ores: "Processed Ore", byProducts: "Energy By-Products" },
        },
      },
    },
    "retail-packaging": {
      name: "Retail & Packaging Solutions",
      tagline: "Premium woven carry bags and retail packs.",
      introduction:
        "Custom-printed woven carry bags and promotional packaging with premium finishes for brand differentiation at the point of sale.",
      challenges: {},
      features: {
        premiumPrint: "High-definition print for strong brand presence",
        customHandles: "D-cut and patch handles for retail carry formats",
        reusable: "Durable, reusable formats over single-use plastic",
        brandDifferentiation: "Finishes engineered to stand out at point of sale",
      },
      benefits: {
        pointOfSale: "Strong shelf and counter presentation",
        brandRecall: "Reusable bags extend brand visibility beyond the store",
        consumerConvenience: "Practical carry formats shoppers keep and reuse",
      },
      tabs: {
        details: {
          label: "Details",
          blocks: {
            overview: {
              heading: "Sector Overview",
              body: "Retail and promotional packaging is judged on first impression — print quality, finish and handling all shape how a brand is perceived at the point of sale and every time the bag is reused.",
            },
            considerations: {
              heading: "Packaging Considerations",
              body: "Reinforced D-cut handles and HD reverse-printed BOPP surfaces give carry bags and promotional packs the durability and shelf appeal retail brands need, with reclosable zipper options for premium retail packs.",
            },
          },
        },
        matrix: {
          label: "Recommended Formats",
          rows: { carryBags: "Carry Bags", promoBags: "Promotional Bags", retailPacks: "Retail Packs" },
        },
      },
    },
  },
};
