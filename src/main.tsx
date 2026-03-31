// Initialize i18n first, before any React imports
import "./i18n";

import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { VoiceChatProvider } from "./contexts/VoiceChatContext";
import App from "./App.tsx";
import "./index.css";

// --- Service Worker freshness guard ---
// In preview/iframe contexts, nuke any cached SW so hot updates always land.
// On production mobile, ensure the waiting SW activates immediately on reload.
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();
const isPreviewHost =
  window.location.hostname.includes("id-preview--") ||
  window.location.hostname.includes("lovableproject.com");

if ("serviceWorker" in navigator) {
  if (isPreviewHost || isInIframe) {
    // Preview: unregister all SWs so stale cache never blocks updates
    navigator.serviceWorker.getRegistrations().then((regs) =>
      regs.forEach((r) => r.unregister())
    );
  } else {
    // Production: if a new SW is waiting, tell it to activate NOW
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      // Listen for future waiting workers
      reg?.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    });
    // Reload once the new SW takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <VoiceChatProvider>
        <App />
      </VoiceChatProvider>
    </HelmetProvider>
  </React.StrictMode>
);
// Build trigger Sat Jan 17 17:05:37 CST 2026
