import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "../i18n/text";
import { PATHS } from "../i18n/navigation";
import { PHOTOS } from "../data/photos";
import { Button, Peak } from "./ui";

const SLIDE_MS = 5000;

/** Photo + destination per slide; the words come from the dictionary. */
const SLIDES = [
  { image: PHOTOS.weavingHall, to: PATHS.products },
  { image: PHOTOS.circularLoom, to: PATHS.about },
  { image: PHOTOS.facilityExterior, to: PATHS.certifications },
] as const;

export default function HeroSlider() {
  const t = useT();
  const reduce = useReducedMotion();

  // [index, direction] — direction drives which way the photo travels.
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;
  const slides = t.home.slides;

  const go = useCallback(
    (next: number, direction: number) => setPage([(next + count) % count, direction]),
    [count],
  );
  const next = useCallback(() => go(index + 1, 1), [go, index]);
  const prev = useCallback(() => go(index - 1, -1), [go, index]);

  // Warm the other frames so a transition never shows an empty panel.
  useEffect(() => {
    SLIDES.forEach(({ image }) => {
      const img = new Image();
      img.src = image;
    });
  }, []);

  // Autoplay. Off under reduced motion, while a keyboard user is inside the
  // carousel, and while the tab is in the background.
  //
  // `index` is in the deps on purpose: every slide change — auto or manual —
  // tears the interval down and starts a fresh one, so a click always gets a
  // full SLIDE_MS before the next automatic advance rather than inheriting
  // whatever was left of the previous tick.
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (reduce || paused) return;
    const tick = () => {
      if (document.hidden) return;
      setPage(([i]) => [(i + 1) % count, 1]);
    };
    timer.current = window.setInterval(tick, SLIDE_MS);
    return () => window.clearInterval(timer.current);
  }, [reduce, paused, count, index]);

  /**
   * Pause only for keyboard users.
   *
   * React's onFocus is focusin, which bubbles — so clicking an arrow used to
   * latch `paused` to true. Focus then stays on that button, the matching
   * focusout never arrives, and autoplay was dead for the rest of the session.
   *
   * Two independent guards, because autoplay surviving a click must not hinge
   * on a browser heuristic: we record the pointer press ourselves (focus lands
   * during the same task, so the flag is still set when onFocusIn runs), and
   * `:focus-visible` is the backstop for focus arriving any other way.
   */
  const pointerFocus = useRef(false);
  const onPointerDown = () => {
    pointerFocus.current = true;
    window.setTimeout(() => {
      pointerFocus.current = false;
    }, 0);
  };

  const onFocusIn = (e: React.FocusEvent) => {
    if (pointerFocus.current) return; // clicked or tapped, not tabbed
    const el = e.target as Element | null;
    try {
      if (el?.matches(":focus-visible")) setPaused(true);
    } catch {
      /* selector unsupported — leave autoplay running */
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t.home.slider.label}
      onKeyDown={onKey}
      // No hover pause: the arrows sit inside the hero, so the cursor is always
      // over the section when navigating manually. Pausing on hover meant a
      // click stopped autoplay for as long as the cursor happened to rest there.
      onPointerDown={onPointerDown}
      onFocus={onFocusIn}
      onBlur={() => setPaused(false)}
      // min-h (not h) so a long headline on a narrow phone grows the section
      // instead of being clipped by overflow-hidden.
      className="relative flex min-h-[calc(100svh-5.5rem)] w-full overflow-hidden bg-ink"
    >
      {/* ---------- photo layer ---------- */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={index}
          custom={dir}
          className="absolute inset-0"
          variants={{
            enter: (d: number) => (reduce ? { opacity: 0 } : { x: d > 0 ? "100%" : "-100%", opacity: 1 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => (reduce ? { opacity: 0 } : { x: d > 0 ? "-25%" : "25%", opacity: 1 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0.4 : 0.9, ease: [0.65, 0, 0.35, 1] }}
          drag={reduce ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70) next();
            else if (info.offset.x > 70) prev();
          }}
        >
          {/* Plain <img>, not motion.img: the parent animates by variant
              *label*, and a nested motion child with object-form initial/animate
              can't resolve those labels — the propagation chain stalls, so enter
              and exit never complete and slides pile up in the DOM. The Ken
              Burns drift is CSS instead (see .hero-zoom). */}
          <img
            src={SLIDES[index].image}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="hero-zoom h-full w-full select-none object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* ---------- scrims: dark on the text side, vignette at the foot ---------- */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(8,26,50,0.94) 0%, rgba(8,26,50,0.86) 28%, rgba(8,26,50,0.55) 58%, rgba(8,26,50,0.22) 100%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-ink/85 to-transparent" />
      <div className="weave pointer-events-none absolute inset-0 opacity-40" />

      {/* ---------- words ---------- */}
      {/* pb clears the progress rail *and* the stats band that overlaps -4rem */}
      <div className="wrap relative z-10 flex w-full flex-col justify-center pb-40 pt-12 sm:pb-44">
        {/* All three slides' words are in the DOM at once, stacked in one grid
            cell, and cross-faded with opacity. Remounting the text on every
            change (the old keyed AnimatePresence) re-created the nodes every
            5 s, and the Google page translator — which only translates nodes
            it has had a moment to see — never caught up, so the hero stayed in
            English. Stable nodes get translated once and simply fade in/out.
            Inactive slides are aria-hidden + inert: one slide at a time for
            assistive tech and the tab order, exactly as before. */}
        <div className="grid">
          {slides.map((sl, i) => {
            const active = i === index;
            return (
              <div
                key={i}
                aria-hidden={!active}
                inert={!active}
                className={`col-start-1 row-start-1 max-w-3xl transition-all ease-out motion-reduce:transition-none ${
                  active
                    ? "translate-y-0 opacity-100 delay-150 duration-500"
                    : "pointer-events-none translate-y-3 opacity-0 duration-300"
                }`}
              >
                {/* Pill from sm up; on a phone the longest eyebrow wraps, and a
                    two-line lozenge looks broken — so drop the chrome there. */}
                <p className="eyebrow inline-flex items-center gap-2.5 rounded-full text-white/90 max-sm:text-[0.68rem] sm:border sm:border-white/20 sm:bg-white/10 sm:px-4 sm:py-1.5 sm:backdrop-blur">
                  <Peak className="h-3 w-8 text-[#ff8a82]" />
                  {sl.eyebrow}
                </p>

                <h1 className="mt-6 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-[3.75rem] lg:leading-[1.05]">
                  {sl.heading}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{sl.body}</p>

                <div className="mt-9">
                  <Button to={SLIDES[i].to} variant="primary" icon={ArrowRight}>
                    {sl.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- arrows ---------- */}
      <button
        type="button"
        onClick={prev}
        aria-label={t.home.slider.prev}
        className="group absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:left-5 sm:h-13 sm:w-13"
      >
        <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label={t.home.slider.next}
        className="group absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:right-5 sm:h-13 sm:w-13"
      >
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* ---------- progress rail ---------- */}
      <div className="wrap absolute inset-x-0 bottom-20 z-20 sm:bottom-24">
        <div className="flex items-end gap-5">
          <span className="font-mono text-xs font-semibold tracking-widest text-white/60">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-white/30">/</span>
            {String(count).padStart(2, "0")}
          </span>
          <div className="flex flex-1 gap-2.5 sm:max-w-xs">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i, i > index ? 1 : -1)}
                aria-label={`${t.home.slider.goTo} ${i + 1}`}
                aria-current={i === index}
                className="group relative h-6 flex-1 focus-visible:outline-none"
              >
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/25 transition-colors group-hover:bg-white/40 group-focus-visible:bg-white/60">
                  {i === index && (
                    <span
                      // Re-keyed per slide so the sweep restarts; pausing the
                      // CSS animation freezes it mid-way instead of snapping.
                      key={index}
                      className={`absolute inset-0 block origin-left bg-red ${reduce ? "" : "hero-progress"}`}
                      style={reduce ? undefined : { animationPlayState: paused ? "paused" : "running" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
