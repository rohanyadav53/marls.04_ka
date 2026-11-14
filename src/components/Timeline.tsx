import { FadeIn } from "./Motion";

export type TimelineItem = {
  year: string;
  title: string;
  desc: string;
  /** Short proof-point chip, e.g. "20M bags / year". */
  metric?: string;
};

/* Vertical company timeline.
 *
 * Desktop: a centre spine with milestones alternating left / right, so the eye
 * zig-zags down the page. Mobile: the spine moves to the left edge and every
 * milestone stacks on the right of it — same order, no alternation to untangle.
 *
 * The last item is treated as "now / next" and is drawn in the brand red so the
 * reader's eye lands where the story is going. Nothing here is date-computed:
 * years are plain strings, so "Today" and "Ahead" sit in the same list. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative mx-auto max-w-5xl">
      <span
        aria-hidden="true"
        className="absolute bottom-3 left-[1.125rem] top-3 w-px bg-gradient-to-b from-blue/10 via-blue/40 to-red/50 lg:left-1/2 lg:-translate-x-1/2"
      />

      {items.map((it, i) => {
        const right = i % 2 === 1;
        const last = i === items.length - 1;
        return (
          <li key={`${it.year}-${it.title}`} className="relative pb-10 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-x-20">
            {/* node */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full ring-[6px] ring-white lg:left-1/2 lg:-translate-x-1/2 ${
                last ? "bg-red" : "bg-blue"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>

            <FadeIn
              delay={0.05}
              className={`pl-14 lg:pl-0 ${right ? "lg:col-start-2" : "lg:col-start-1 lg:text-right"}`}
            >
              <article className="rounded-2xl border border-line bg-white p-6 transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(15,23,42,0.45)] sm:p-7">
                <div
                  className={`font-display text-4xl font-extrabold leading-none tracking-tight sm:text-5xl ${
                    last ? "text-red" : "text-blue"
                  }`}
                >
                  {it.year}
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-ink sm:text-xl">{it.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{it.desc}</p>
                {it.metric && (
                  <span
                    className={`mt-4 inline-block rounded-full px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider ${
                      last ? "bg-red-50 text-red" : "bg-blue-50 text-blue"
                    }`}
                  >
                    {it.metric}
                  </span>
                )}
              </article>
            </FadeIn>
          </li>
        );
      })}
    </ol>
  );
}
