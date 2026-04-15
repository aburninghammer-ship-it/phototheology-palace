// Initialize i18n first, before any React imports
import "./i18n";

import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { VoiceChatProvider } from "./contexts/VoiceChatContext";
import { MANUAL_UPDATE_REQUIRED_EVENT } from "./components/PWAUpdatePrompt";
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
const isQuestBrowser = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
const isMetaWebView =
  /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(navigator.userAgent) &&
  !isQuestBrowser;
const previewFreshnessKey = "__preview_sw_freshened_v3__";
const chunkReloadKey = "__chunk_reload_once__";
const metaForceReloadKey = "__meta_force_reload_v3__";
async function hardRefresh(cacheBusterKey: string) {
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));

    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    }
  } finally {
    const target = new URL(window.location.href);
    target.searchParams.set(cacheBusterKey, Date.now().toString());
    window.location.replace(target.toString());
  }
}

function requestManualUpdate() {
  window.dispatchEvent(new Event(MANUAL_UPDATE_REQUIRED_EVENT));
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
      message.includes("Failed to fetch dynamically imported module") ||
      message.includes("Importing a module script failed")
    );
  };

  window.addEventListener("unhandledrejection", (event) => {
    if (shouldReloadForReason(event.reason)) {
      if (sessionStorage.getItem(chunkReloadKey) === "1") return;
      sessionStorage.setItem(chunkReloadKey, "1");
      requestManualUpdate();
    }
  });

  window.addEventListener("error", (event) => {
    if (shouldReloadForReason(event.error ?? event.message)) {
      if (sessionStorage.getItem(chunkReloadKey) === "1") return;
      sessionStorage.setItem(chunkReloadKey, "1");
      requestManualUpdate();
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
  } else if (isMetaWebView) {
    // FB/IG webviews often ignore normal reloads and keep serving stale index.html.
    // Clear SW + caches once per session, then force a brand-new URL.
    void (async () => {
      if (sessionStorage.getItem(metaForceReloadKey) === "1") {
        await navigator.serviceWorker
          .getRegistration()
          .then((registration) => registration?.update())
          .catch(() => undefined);
        return;
      }

      sessionStorage.setItem(metaForceReloadKey, "1");

      await hardRefresh("__meta_refresh");
    })();
  } else if (isQuestBrowser) {
    // Quest browser can cling to an older shell after deploys.
    // Poll for updates but let the user choose when to reload via PWAUpdatePrompt.
    void (async () => {
      const checkForQuestUpdate = () => {
        void navigator.serviceWorker
          .getRegistration()
          .then((registration) => registration?.update())
          .catch(() => undefined);
        // Do NOT auto-refresh — let PWAUpdatePrompt handle it
      };

      checkForQuestUpdate();

      const intervalId = window.setInterval(checkForQuestUpdate, 20_000);
      window.addEventListener(
        "beforeunload",
        () => {
          window.clearInterval(intervalId);
        },
        { once: true },
      );
    })();
  } else {
    // Production desktop/mobile web: check for SW updates periodically.
    // Auto-reload when a new service worker takes control.
    void (async () => {
      // When a new SW activates (via skipWaiting), reload to load fresh assets.
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;
        reloading = true;
        window.location.reload();
      });

      const checkForStandardUpdate = () => {
        void navigator.serviceWorker
          .getRegistration()
          .then((registration) => registration?.update())
          .catch(() => undefined);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          checkForStandardUpdate();
        }
      };

      checkForStandardUpdate();

      const intervalId = window.setInterval(checkForStandardUpdate, 60_000);
      window.addEventListener("focus", checkForStandardUpdate);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener(
        "beforeunload",
        () => {
          window.clearInterval(intervalId);
          window.removeEventListener("focus", checkForStandardUpdate);
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        },
        { once: true },
      );
    })();
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
