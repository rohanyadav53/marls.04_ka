/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the PHP API. Leave unset in production — the app and the API
   * share an origin, so the default relative "/api" is what you want.
   * Set it in .env.local for local development (see .env.example).
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
