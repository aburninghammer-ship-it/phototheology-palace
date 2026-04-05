import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type BrowserType = "chrome" | "edge" | "safari" | "firefox" | "samsung" | "opera" | "other";

function detectBrowser(): BrowserType {
  const ua = navigator.userAgent;
  if (/SamsungBrowser/i.test(ua)) return "samsung";
  if (/Edg\//i.test(ua)) return "edge";
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return "opera";
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return "chrome";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "safari";
  if (/Firefox/i.test(ua)) return "firefox";
  return "other";
}

/**
 * Smart banner that detects unsupported browsers and guides users to install properly.
 * Shows after 10 seconds for Firefox/unsupported browsers, or as a gentle nudge for all.
 */
export const InstallBanner = () => {
  const [browser] = useState<BrowserType>(detectBrowser);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true);

  const supportsInstall = browser === "chrome" || browser === "edge" || browser === "samsung" || browser === "opera";

  useEffect(() => {
    if (isStandalone) return;
    if (localStorage.getItem("install-banner-dismissed")) {
      setDismissed(true);
      return;
    }

    // Show sooner for unsupported browsers, later for supported ones
    const delay = supportsInstall ? 60_000 : 15_000;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [isStandalone, supportsInstall]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("install-banner-dismissed", "true");
  };

  if (isStandalone || dismissed || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground shadow-lg"
      >
        <div className="container max-w-4xl mx-auto flex items-center gap-3 px-4 py-2.5 text-sm">
          {!supportsInstall ? (
            <>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span className="flex-1">
                {browser === "firefox"
                  ? "Firefox doesn't support app install. Use Chrome or Edge."
                  : "Your browser may not support app install."}
              </span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4 shrink-0" />
              <span className="flex-1">Install Phototheology for the best experience!</span>
            </>
          )}
          <Link to="/install">
            <Button size="sm" variant="secondary" className="text-xs h-7 px-3">
              How to Install
            </Button>
          </Link>
          <button onClick={handleDismiss} className="p-1 hover:opacity-80">
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
