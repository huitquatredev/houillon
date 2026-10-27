// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "http://localhost:4321",
  devToolbar: { enabled: false },
  build: { inlineStylesheets: "auto" },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
