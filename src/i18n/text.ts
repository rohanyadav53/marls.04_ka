import { en } from "./locales/en";

export type { Dict } from "./locales/en";

/* The site's copy. English is the only authored language; every other
 * language is produced in the browser by Google Website Translator (see
 * `translate.ts`). `useT` stays a hook-shaped function so components read
 * `const t = useT()` exactly as before — it simply returns the one
 * dictionary now, with no provider or state behind it. */
// eslint-disable-next-line react-refresh/only-export-components
export function useT() {
  return en;
}
