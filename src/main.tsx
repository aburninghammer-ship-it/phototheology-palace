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
const isQuestBrowser = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
const isMetaWebView =
  /FBAN|FBAV|FB_IAB|FBIOS|Instagram/i.test(navigator.userAgent) &&
  !isQuestBrowser;
const previewFreshnessKey = "__preview_sw_freshened_v2__";
const chunkReloadKey = "__chunk_reload_once__";
const metaForceReloadKey = "__meta_force_reload_v2__";
const questBuildRefreshKeyPrefix = "__quest_build_refresh__:";

function readCurrentBuildTag() {
  return document.querySelector('meta[name="app-build"]')?.getAttribute("content") ?? null;
}

async function fetchLatestBuildTag() {
  const url = `${window.location.origin}/?__buildcheck=${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const html = await fetch(url, {
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
      Pragma: "no-cache",
    },
  }).then((response) => response.text());

  const match = html.match(/<meta\s+name=["']app-build["']\s+content=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

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

async function maybeRefreshQuestBuild() {
  const currentBuild = readCurrentBuildTag();
  if (!currentBuild) return;

  const nextBuild = await fetchLatestBuildTag().catch(() => null);
  if (!nextBuild || nextBuild === currentBuild) return;

  const refreshKey = `${questBuildRefreshKeyPrefix}${nextBuild}`;
  if (sessionStorage.getItem(refreshKey) === "1") return;

  sessionStorage.setItem(refreshKey, "1");
  await hardRefresh("__quest_refresh");
}

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
    // Poll the live app-build tag and force a one-time hard refresh when it changes.
    void (async () => {
      const checkForQuestUpdate = () => {
        void navigator.serviceWorker
          .getRegistration()
          .then((registration) => registration?.update())
          .catch(() => undefined);
        void maybeRefreshQuestBuild();
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
