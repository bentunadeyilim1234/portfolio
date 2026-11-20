import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  // Inline (empty) PostCSS config: stops Vite loading postcss.config.mjs -> tailwind, which warns on Node 26.
  css: { postcss: {} },
  test: {
    environment: "node",
  },
});
