import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  define: {
    // Build day, frozen at compile time. TopBar starts from this on BOTH the
    // server render and the first client render, so hydration matches exactly;
    // only then does the visitor's real date replace it (see TopBar.tsx).
    __BUILD_DAY__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  plugins: [
    // Dev-only: injects code-path attributes for the editor inspector.
    // Must not run during `vite build` — it bloats prerendered HTML (~35KB/page).
    ...(command === 'serve' ? [inspectAttr()] : []),
    react(),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (
            /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler|cookie|set-cookie-parser)[\\/]/.test(
              id,
            )
          ) {
            // React core + router (cookie/set-cookie-parser are react-router deps).
            return 'react-vendor';
          }
          if (id.includes('@radix-ui')) return 'radix-vendor';
          return 'vendor';
        },
      },
    },
  },
}));
