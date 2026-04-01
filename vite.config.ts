import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// Inject a unique build hash into the app-build meta tag so Meta Quest
// browser can detect when a new version has been deployed.
function buildHashPlugin(): Plugin {
  const buildHash = `build-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: 'inject-build-hash',
    transformIndexHtml(html) {
      return html.replace(
        /<meta\s+name=["']app-build["']\s+content=["'][^"']*["']/i,
        `<meta name="app-build" content="${buildHash}"`,
      );
    },
  };
}

// https://vitejs.dev/config/
// PWA Cache Version: 2026-04-01-meta-fix
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: { 'Cache-Control': 'no-store' },
  },
  preview: {
    headers: { 'Cache-Control': 'no-store' },
  },
  // Reduce build output noise (helps surface the actual error in CI logs)
  logLevel: "warn",
  plugins: [
    react(),
    buildHashPlugin(),
    mode === "development" && componentTagger(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: 'auto',
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'The Phototheology Digital Bible',
        short_name: 'Phototheology',
        description: 'Master Bible study through the 8-floor Palace method',
        theme_color: '#1a1a2e',
        background_color: '#0f0f1e',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  optimizeDeps: {
    include: [
      'recharts', 
      'recharts-scale', 
      'd3-scale', 
      'd3-shape', 
      'd3-path',
      'd3-array',
      'd3-interpolate',
      'd3-color',
      'd3-format',
      'd3-time',
      'd3-time-format',
    ],
  },
  build: {
    cssCodeSplit: true,
    // Avoid spending time computing gzip sizes during CI publish builds.
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // NOTE: manualChunks intentionally omitted.
        // We rely on Rollup's default chunking to avoid TDZ issues from cross-chunk init ordering.
      },
    },
    chunkSizeWarningLimit: 1000,
    // FIX: Removed manual chunking for recharts/d3 to let Rollup handle dependency order
    // This avoids TDZ (Cannot access 'e' before initialization) errors
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
}));
