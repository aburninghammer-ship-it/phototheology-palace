import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Check, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6 border-2 shadow-2xl">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Install Phototheology
          </h1>
          <p className="text-lg text-muted-foreground">
            Get the full app experience on your device
          </p>
        </div>

        {isInstalled ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span className="font-medium">App installed successfully!</span>
            </div>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to App
            </Button>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-4">
            <ul className="text-left space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-primary" />
                <span>Works offline</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-primary" />
                <span>Fast loading times</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-primary" />
                <span>Home screen icon</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-primary" />
                <span>Full screen experience</span>
              </li>
            </ul>

            <Button onClick={handleInstall} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>

            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="w-full"
            >
              Continue in Browser
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Manual Installation:</p>
              <div className="text-left space-y-1">
                <p className="font-semibold">iPhone/iPad:</p>
                <p>Tap Share → Add to Home Screen</p>
                <p className="font-semibold mt-2">Android:</p>
                <p>Tap Menu (⋮) → Add to Home Screen</p>
              </div>
            </div>

            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Continue in Browser
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
