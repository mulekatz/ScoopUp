import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),  nodePolyfills({
    // Explizit angeben, welche Polyfills wir brauchen
    include: ['buffer', 'process', 'util'],
    globals: {
      Buffer: true, // Buffer global verfügbar machen
      process: true,
      global: true
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Buffer-Polyfill explizit mappen
      "buffer": "vite-plugin-node-polyfills/shims/buffer"
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Buffer als externes Modul behandeln
      external: ['vite-plugin-node-polyfills/shims/buffer']
    }
  },
});