import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'vite-plugin-node-polyfills/shims/buffer',
      process: 'vite-plugin-node-polyfills/shims/process',
      stream: 'stream-browserify'
    }
  },
  define: {
    'process.env': {},
    global: 'globalThis'
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      external: [
        'vite-plugin-node-polyfills/shims/buffer',
        'vite-plugin-node-polyfills/shims/process'
      ],
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router',
            'zustand'
          ],
          ui: [
            '@radix-ui/react-dialog',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ]
        }
      }
    }
  }
})