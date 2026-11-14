import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Plus, X } from "lucide-react";
import { useT } from "../i18n/text";
import { useLeadPopup } from "./LeadPopup";
import { useFocusTrap } from "../hooks/useFocusTrap";
import Logo from "./Logo";
import LanguageMenu from "./LanguageMenu";
import { MegaPanel, type MegaType } from "./MegaMenu";
import { PATHS, PRIMARY_NAV } from "../i18n/navigation";

export default function Header() {
  const t = useT();
  const { openQuote } = useLeadPopup();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [openMega, setOpenMega] = useState<MegaType | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [acc, setAcc] = useState<MegaType | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(drawerRef, drawer, () => setDrawer(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change.
  useEffect(() => {
    setOpenMega(null);
    setDrawer(false);
    setAcc(null);
  }, [location.pathname]);

  // Escape closes the desktop mega panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMega(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scheduleOpen = (type: MegaType) => {
    window.clearTimeout(closeTimer.current);
    openTimer.current = window.setTimeout(() => setOpenMega(type), 120);
  };
  const scheduleClose = () => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMega(null), 200);
  };
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  const isActive = (to: string) =>
    to === PATHS.home ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white transition-shadow ${
        scrolled ? "border-line shadow-sm" : "border-transparent"
      }`}
    >
      <div
        className={`wrap flex items-center justify-between gap-4 transition-[height] duration-300 ${
          scrolled ? "h-[4.75rem]" : "h-[5.5rem]"
        }`}
      >
        <Link
          to={PATHS.home}
          aria-label="MARLSBORO Group home"
          className="shrink-0 origin-left transition-transform duration-300"
          style={{ transform: scrolled ? "scale(0.86)" : "scale(1)" }}
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {PRIMARY_NAV.map((item) =>
            item.mega ? (
              <div
                key={item.to}
                onMouseEnter={() => scheduleOpen(item.mega!)}
                onMouseLeave={scheduleClose}
              >
                <Link
                  to={item.to}
                  onFocus={() => setOpenMega(item.mega!)}
                  aria-haspopup="true"
                  aria-expanded={openMega === item.mega}
                  className={`relative flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive(item.to) ? "text-blue" : "text-ink/75 hover:text-blue"
                  }`}
                >
                  {item.label(t)}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${openMega === item.mega ? "rotate-180" : ""}`}
                  />
                  {isActive(item.to) && <span className="absolute -bottom-px left-3 right-3 h-0.5 rounded bg-red" />}
                </Link>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive: a }) =>
                  item.accent === "green"
                    ? `relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
                        a ? "text-emerald-700" : "text-emerald-600 hover:text-emerald-700"
                      }`
                    : item.accent === "red"
                      ? `relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold transition-colors ${
                          a ? "text-red-700" : "text-red hover:text-red-700"
                        }`
                      : `relative whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                          a ? "text-blue" : "text-ink/75 hover:text-blue"
                        }`
                }
              >
                {({ isActive: a }) => (
                  <>
                    {item.label(t)}
                    {a && (
                      <span
                        className={`absolute -bottom-px left-3 right-3 h-0.5 rounded ${
                          item.accent === "green" ? "bg-emerald-600" : "bg-red"
                        }`}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageMenu />
          <button
            type="button"
            onClick={openQuote}
            className="rounded-full bg-grad-cta px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red/20 transition-transform hover:-translate-y-0.5"
          >
            {t.cta.quote}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageMenu />
          <button
            type="button"
            onClick={() => setDrawer(true)}
            aria-label={t.common.menu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-surface"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Desktop mega panel */}
      <AnimatePresence>
        {openMega && (
          <motion.div
            className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-lg xl:block"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="wrap relative py-8">
              <MegaPanel type={openMega} onNav={() => setOpenMega(null)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/50 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(false)}
          >
            <motion.div
              ref={drawerRef}
              className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <Logo variant="compact" />
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label={t.common.close}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-surface"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                {PRIMARY_NAV.map((item) =>
                  item.mega ? (
                    <div key={item.to} className="border-b border-line/70">
                      <button
                        type="button"
                        onClick={() => setAcc((a) => (a === item.mega ? null : item.mega!))}
                        aria-expanded={acc === item.mega}
                        className="flex w-full items-center justify-between px-2 py-3.5 text-base font-semibold text-ink"
                      >
                        {item.label(t)}
                        <Plus
                          className={`h-5 w-5 text-muted transition-transform ${acc === item.mega ? "rotate-45" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {acc === item.mega && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-2 pb-4">
                              <MegaPanel type={item.mega} onNav={() => setDrawer(false)} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setDrawer(false)}
                      className={`block border-b border-line/70 px-2 py-3.5 text-base font-semibold ${
                        item.accent === "green"
                          ? "font-bold uppercase tracking-wide text-emerald-600"
                          : item.accent === "red"
                            ? "font-bold text-red"
                            : "text-ink"
                      }`}
                    >
                      {item.label(t)}
                    </Link>
                  ),
                )}
              </div>

              <div className="border-t border-line px-5 py-4">
                <button
                  type="button"
                  onClick={() => {
                    setDrawer(false);
                    openQuote();
                  }}
                  className="w-full rounded-full bg-grad-cta px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  {t.cta.quote}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
