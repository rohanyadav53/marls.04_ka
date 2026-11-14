import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LANGUAGES, getActiveLanguage, setLanguage, type LangCode } from "../i18n/translate";

/* Our own language picker, driving Google Website Translator underneath (see
 * i18n/translate.ts). `translate="no"` keeps the translator from rewriting the
 * language names themselves — "Deutsch" must stay "Deutsch" once the page is
 * in German. */
export default function LanguageMenu() {
  // The choice lives in a cookie, so read it once on mount — switching
  // language reloads or re-translates the page rather than re-rendering us.
  const [lang] = useState<LangCode>(getActiveLanguage);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" translate="no">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/80 transition-colors hover:border-blue hover:text-blue"
      >
        <Globe className="h-4 w-4" />
        <span className="min-w-[1.5rem] text-center">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-line bg-white shadow-xl">
          <ul role="listbox" className="max-h-80 overflow-y-auto py-1">
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <li key={l.code} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      if (!active) setLanguage(l.code);
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-surface ${
                      active ? "font-semibold text-blue" : "text-ink/75"
                    }`}
                  >
                    <span>{l.name}</span>
                    {active && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-line bg-surface px-4 py-2 text-[0.7rem] leading-snug text-muted">
            Automatic translation by Google. English is the authoritative version.
          </p>
        </div>
      )}
    </div>
  );
}
