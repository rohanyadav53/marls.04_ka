import { forwardRef } from "react";
import { Icon } from "lucide-react";
import type { IconNode, LucideIcon, LucideProps } from "lucide-react";

/* Each node carries a `key`: lucide's `Icon` maps the node list straight into
 * React children, and its built-in icons all include one. Without it React
 * logs a unique-key warning on every render.
 *
 * Woven-bag sack — the one icon for the woven category, site-wide (Products
 * page headers, homepage category cards, mega-menu, I AM RECYCLABLE).
 *
 * Built on lucide's own `Icon` primitive and typed as `LucideIcon`, so it drops
 * into every slot that takes a lucide icon (`icon: LucideIcon` in
 * navigation.ts) and honours `className`, `size`, `strokeWidth` and `color` the
 * same way. Same 24×24 stroke grid as the rest of the set — don't hand-roll a
 * second copy of this per page; that is how the generic `Package` box ended up
 * on some surfaces and the sack on others. */
const WOVEN_SACK: IconNode = [
  // glued and folded top seam
  ["path", { d: "M8 3.4h8a1 1 0 0 1 1 1V6H7V4.4a1 1 0 0 1 1-1z", key: "seam" }],
  // sack body, widening towards the filled base
  ["path", { d: "M6.2 6h11.6l.9 12.6a2 2 0 0 1-2 2.15H7.3a2 2 0 0 1-2-2.15z", key: "body" }],
  // the mesh weave
  ["path", { d: "M9.6 6v14.75M14.4 6v14.75M5.85 11h12.3M5.5 15.9h13", key: "weave" }],
];

export const WovenSackIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
  <Icon ref={ref} iconNode={WOVEN_SACK} {...props} />
));
WovenSackIcon.displayName = "WovenSackIcon";
