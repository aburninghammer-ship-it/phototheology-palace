import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// PWA Cache Version: 2026-02-07-v1 (force rebuild)
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  // Reduce build output noise (helps surface the actual error in CI logs)
  logLevel: "warn",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
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
      workbox: {
        // Workbox won't precache assets > 2 MiB by default.
        // Some of our images can exceed 3 MiB, so allow a larger headroom.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources'
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
