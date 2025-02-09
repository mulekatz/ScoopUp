import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    nodePolyfills({
      include: ['buffer', 'process', 'util'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "vite-plugin-node-polyfills/shims/buffer",
      "global": "vite-plugin-node-polyfills/shims/global"
    }
  },
  build: {
    outDir: "public",
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [
        'vite-plugin-node-polyfills/shims/buffer',
        'vite-plugin-node-polyfills/shims/global'
      ]
    }
  },
  optimizeDeps: {
    include: ['@vechain/dapp-kit-react', '@vechain/sdk-core']
  }
});