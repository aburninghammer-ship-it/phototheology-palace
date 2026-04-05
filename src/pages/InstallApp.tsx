import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Smartphone, Monitor, Apple, Chrome, Globe, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type BrowserType = "chrome" | "edge" | "safari" | "firefox" | "samsung" | "opera" | "other";
type PlatformType = "ios" | "android" | "macos" | "windows" | "other";

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

function detectPlatform(): PlatformType {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  if (/Macintosh/.test(ua)) return "macos";
  if (/Windows/.test(ua)) return "windows";
  return "other";
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const browserLabels: Record<BrowserType, string> = {
  chrome: "Chrome",
  edge: "Edge",
  safari: "Safari",
  firefox: "Firefox",
  samsung: "Samsung Internet",
  opera: "Opera",
  other: "your browser",
};

const InstallApp = () => {
  const [browser] = useState<BrowserType>(detectBrowser);
  const [platform] = useState<PlatformType>(detectPlatform);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    );

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const supportsInstall = browser === "chrome" || browser === "edge" || browser === "samsung" || browser === "opera";
  const isMobile = platform === "ios" || platform === "android";

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container max-w-2xl mx-auto px-4 py-12 text-center">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Already Installed!</h1>
          <p className="text-muted-foreground">You're already using Phototheology as an app. Enjoy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-3xl mx-auto px-4 py-8 pb-24 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary to-accent mb-2">
            <Download className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Install Phototheology</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Get the full app experience — works offline, loads instantly, and lives right on your home screen.
          </p>
        </motion.div>

        {/* Native install button if supported */}
        {deferredPrompt && (
          <Card className="border-2 border-primary/40 bg-primary/5">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-xl font-bold">Quick Install</h2>
              <p className="text-sm text-muted-foreground">
                Your browser supports one-tap installation!
              </p>
              <Button size="lg" onClick={handleInstall} className="gap-2">
                <Download className="h-5 w-5" />
                Install Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Browser-specific unsupported warning */}
        {!supportsInstall && (
          <Card className="border-destructive/40 bg-destructive/5">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-lg">
                    {browserLabels[browser]} doesn't support app installation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {browser === "firefox" ? (
                      <>Firefox removed PWA support. Please open this page in <strong>Chrome</strong> or <strong>Edge</strong> to install Phototheology as an app.</>
                    ) : browser === "safari" ? (
                      <>On Safari, use the <strong>Share</strong> button → <strong>Add to Home Screen</strong> instead. See instructions below.</>
                    ) : (
                      <>Please open this page in <strong>Chrome</strong> or <strong>Edge</strong> to install.</>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step-by-step instructions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Step-by-Step Instructions</h2>

          {/* iPhone / iPad */}
          <InstructionCard
            icon={<Apple className="h-6 w-6" />}
            title="iPhone & iPad (Safari)"
            highlight={platform === "ios"}
            steps={[
              "Open phototheology-palace.lovable.app in Safari",
              "Tap the Share button (square with arrow) at the bottom of the screen",
              "Scroll down and tap \"Add to Home Screen\"",
              "Tap \"Add\" in the top right corner",
              "The app icon will appear on your home screen!",
            ]}
          />

          {/* Android */}
          <InstructionCard
            icon={<Smartphone className="h-6 w-6" />}
            title="Android (Chrome)"
            highlight={platform === "android"}
            steps={[
              "Open phototheology-palace.lovable.app in Chrome",
              "Tap the three-dot menu (⋮) in the top-right corner",
              "Tap \"Install app\" or \"Add to Home screen\"",
              "Tap \"Install\" to confirm",
              "The app will install and appear on your home screen!",
            ]}
          />

          {/* Desktop Chrome / Edge */}
          <InstructionCard
            icon={<Monitor className="h-6 w-6" />}
            title="Desktop (Chrome or Edge)"
            highlight={(platform === "windows" || platform === "macos") && (browser === "chrome" || browser === "edge")}
            steps={[
              "Open phototheology-palace.lovable.app in Chrome or Edge",
              "Look for the install icon (⊕) in the address bar on the right",
              "Click it and then click \"Install\"",
              "The app will open in its own window — you can find it in your apps!",
            ]}
          />

          {/* Firefox fallback */}
          <InstructionCard
            icon={<Globe className="h-6 w-6" />}
            title="Firefox Users"
            highlight={browser === "firefox"}
            steps={[
              "Firefox does not support installing web apps",
              "Copy this URL: phototheology-palace.lovable.app",
              "Open it in Chrome or Edge instead",
              "Then follow the Chrome/Edge instructions above",
            ]}
          />
        </div>
      </div>
    </div>
  );
};

function InstructionCard({
  icon,
  title,
  steps,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  steps: string[];
  highlight: boolean;
}) {
  return (
    <Card className={highlight ? "border-2 border-primary/40 bg-primary/5" : ""}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
            {icon}
          </div>
          <h3 className="font-bold text-lg">{title}</h3>
          {highlight && (
            <span className="ml-auto text-xs font-medium bg-primary/20 text-primary px-2 py-1 rounded-full">
              Recommended for you
            </span>
          )}
        </div>
        <ol className="space-y-2 ml-1">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-foreground/90 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

export default InstallApp;
