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
const previewFreshnessKey = "__preview_sw_freshened_v2__";
const chunkReloadKey = "__chunk_reload_once__";

function reloadOnce(key: string) {
  if (sessionStorage.getItem(key) === "1") return;
  sessionStorage.setItem(key, "1");
  window.location.reload();
}

function bindChunkLoadRecovery() {
  const shouldReloadForReason = (reason: unknown) => {
    const message =
      typeof reason === "string"
        ? reason
        : reason instanceof Error
          ? reason.message
          : "";

    return (
      message.includes("ChunkLoadError") ||
      message.includes("Failed to fetch dynamically imported module")
    );
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (shouldReloadForReason(event.reason)) {
      reloadOnce(chunkReloadKey);
    }
  });

  window.addEventListener("error", (event) => {
    if (shouldReloadForReason(event.error ?? event.message)) {
      reloadOnce(chunkReloadKey);
    }
  });
}

bindChunkLoadRecovery();

if ("serviceWorker" in navigator) {
  if (isPreviewHost || isInIframe) {
    // Preview: wipe stale service workers + caches, then refresh once.
    void (async () => {
      const alreadyFreshened = sessionStorage.getItem(previewFreshnessKey) === "1";
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));

      if ("caches" in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }

      if (!alreadyFreshened) {
        sessionStorage.setItem(previewFreshnessKey, "1");
        window.location.reload();
      }
    })();
  } else {
    // Production: let PWAUpdatePrompt (useRegisterSW) handle updates & prompt.
    // Still force an update check so Quest picks up the newest SW as soon as possible.
    void navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.update())
      .catch(() => undefined);
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
