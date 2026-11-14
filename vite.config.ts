import { defineConfig, type Plugin } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

const root = fileURLToPath(new URL(".", import.meta.url));

/**
 * Dev-server fallback for the admin single-page app.
 *
 * Vite's history fallback only knows about the root entry, so `/admin/leads`
 * would be served the marketing site's index.html. In production Apache does
 * this (see deploy/public_html.htaccess, rule 3); this keeps local development
 * behaving the same way.
 */
function adminSpaFallback(): Plugin {
  return {
    name: "marlsboro-admin-spa-fallback",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? "";
        const path = url.split("?")[0];
        // Only bare routes — never asset requests, which have an extension.
        if (path.startsWith("/admin") && !/\.[a-z0-9]+$/i.test(path)) {
          req.url = "/admin/index.html";
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), adminSpaFallback()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      // Two independent apps, two bundles. The public site never ships a byte
      // of admin code, and the admin portal loads without the marketing site.
      input: {
        main: resolve(root, "index.html"),
        admin: resolve(root, "admin/index.html"),
      },
    },
  },
});
