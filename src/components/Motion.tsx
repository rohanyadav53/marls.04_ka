import type { ReactNode } from "react";

/** Fade + rise into view, once. Disabled under prefers-reduced-motion. */
export function FadeIn({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
