import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useT } from "../i18n/text";
import { useFocusTrap } from "../hooks/useFocusTrap";
import EnquiryForm from "./EnquiryForm";

type LeadCtx = { openQuote: () => void };
const Ctx = createContext<LeadCtx | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useLeadPopup(): LeadCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLeadPopup must be used within LeadPopupProvider");
  return ctx;
}

export function LeadPopupProvider({ children }: { children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const openQuote = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open, close);

  return (
    <Ctx.Provider value={{ openQuote }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={t.contact.form.heading}
              className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-ink">{t.contact.form.heading}</h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.common.close}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-ink"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <EnquiryForm onDone={close} source="Quote Popup" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
