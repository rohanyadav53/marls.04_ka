import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LeadPopupProvider } from "./LeadPopup";
import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

/**
 * Route-change scrolling.
 *
 * React Router does not act on the URL hash, so `/packaging-security#barcode`
 * from the mega menu would otherwise land at the top of the page. When a hash
 * is present we scroll that element into view instead — `scrollIntoView`
 * honours `scroll-padding-top` (set in index.css), which keeps the target clear
 * of the fixed header. Without a hash, behave as before and go to the top.
 *
 * The target normally exists by the time this effect runs, so we look for it
 * synchronously and only retry if it does not — deliberately on a timer rather
 * than requestAnimationFrame, which never fires while a tab is in the
 * background and would drop the scroll for anyone opening the link in a new tab.
 */
const RETRY_MS = 50;
const MAX_ATTEMPTS = 10;

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let attempts = 0;
    let timer: number | undefined;

    const tryScroll = () => {
      const target = document.getElementById(id);
      if (target) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      } else if (++attempts < MAX_ATTEMPTS) {
        timer = window.setTimeout(tryScroll, RETRY_MS);
      } else {
        window.scrollTo(0, 0); // hash points at nothing on this page
      }
    };

    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}

export default function Layout() {
  return (
    <LeadPopupProvider>
      <ScrollManager />
      <Header />
      <main className="pt-[5.5rem]">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </LeadPopupProvider>
  );
}
