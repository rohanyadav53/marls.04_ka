import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

/* ---------------- Layout section ---------------- */
export function Section({
  id,
  children,
  className = "",
  bg = "white",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bg?: "white" | "surface" | "ink";
}) {
  const bgClass = bg === "surface" ? "bg-surface" : bg === "ink" ? "bg-ink text-white" : "bg-white";
  return (
    <section id={id} className={`py-16 sm:py-24 ${bgClass} ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/* ---------------- Eyebrow (signature mono label) ---------------- */
export function Eyebrow({
  children,
  light = false,
  center = false,
}: {
  children: ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <p
      className={`eyebrow flex items-center gap-2.5 ${center ? "justify-center" : ""} ${
        light ? "" : "text-red"
      }`}
      style={light ? { color: "#ff8a82" } : undefined}
    >
      <span className="h-px w-7" style={{ background: "currentColor" }} />
      {children}
    </p>
  );
}

/* ---------------- Section heading ---------------- */
export function SectionHeading({
  eyebrow,
  title,
  sub,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "start";
  light?: boolean;
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow light={light} center={centered}>{eyebrow}</Eyebrow>}
      <h2
        className={`mt-4 text-3xl font-extrabold tracking-tight sm:text-[2.5rem] sm:leading-[1.1] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {sub && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Button (Link / anchor / button) ---------------- */
type Variant = "primary" | "outline" | "light" | "lightOutline";
type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: LucideIcon;
  className?: string;
  download?: boolean;
};

function btnClass(variant: Variant, size: "sm" | "md", extra: string) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue";
  const sizing = size === "sm" ? "px-5 py-2.5 text-sm" : "px-7 py-3.5 text-sm";
  const variants: Record<Variant, string> = {
    primary: "bg-grad-cta text-white shadow-lg shadow-red/20 hover:-translate-y-0.5 hover:shadow-xl",
    outline: "border border-ink/15 text-ink hover:border-blue hover:text-blue",
    light: "bg-white text-ink hover:-translate-y-0.5 hover:shadow-lg",
    lightOutline: "border border-white/30 text-white hover:bg-white/10",
  };
  return `${base} ${sizing} ${variants[variant]} ${extra}`;
}

export function Button({
  children,
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  download = false,
}: ButtonProps) {
  const cls = btnClass(variant, size, className);
  const inner = (
    <>
      {children}
      {Icon && <Icon className="h-4 w-4" />}
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href)
    return (
      <a
        href={href}
        className={cls}
        {...(download ? { download: "" } : {})}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

/* ---------------- Image / placeholder frame ----------------
 * One framed slot for site imagery. Pass `src` to show a real photo; leave it
 * off (or undefined) to show the icon + caption placeholder. This means any
 * photo slot becomes a real image with a single prop — no layout change.
 *   <ImagePlaceholder icon={Factory} caption={t.common.photoCaption} />   // placeholder
 *   <ImagePlaceholder src="/assets/images/industries/chemicals.jpg" alt={name} />  // real photo
 */
export function ImagePlaceholder({
  ratio = "4/3",
  src,
  alt = "",
  caption,
  icon: Icon,
  className = "",
}: {
  ratio?: "16/9" | "4/3" | "1/1" | "3/2";
  /** Real image URL/path (e.g. a file in /public). When set, a photo renders instead of the placeholder. */
  src?: string;
  /** Alt text for the real image (required for accessibility once a photo is set). */
  alt?: string;
  caption?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  const ratios: Record<string, string> = {
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
    "3/2": "aspect-[3/2]",
  };
  const frame = `relative overflow-hidden rounded-2xl border border-line ${ratios[ratio]} ${className}`;

  if (src) {
    return (
      <div className={frame}>
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`weave-ink flex flex-col items-center justify-center bg-surface text-muted ${frame}`}>
      {Icon && <Icon className="h-10 w-10 opacity-40" strokeWidth={1.4} />}
      {caption && <span className="mt-2 px-4 text-center text-xs font-medium opacity-70">{caption}</span>}
    </div>
  );
}

/* ---------------- Peak accent (from the logo's mountain mark) ---------------- */
export function Peak({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 22" className={className} fill="none" aria-hidden="true">
      <path d="M2 20 L18 4 L28 14 L40 4 L62 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
