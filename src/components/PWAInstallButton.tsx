import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    // If already installed, don't show the button
    if (isStandalone) {
      console.log('App already installed');
      setIsInstallable(false);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);
    
    // Check if mobile (any mobile device)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    console.log('PWA Install Button - Device detection:', { 
      isIOSDevice, 
      isMobile, 
      isStandalone,
      userAgent: navigator.userAgent 
    });
    
    // Always show on mobile devices (iOS or Android) unless already installed
    if (isMobile && !isStandalone) {
      console.log('Showing install button for mobile device');
      setIsInstallable(true);
    }

    // Listen for install prompt event (Android/Desktop Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt event fired');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS install instructions
      alert('To install this app on iOS:\n\n1. Tap the Share button (box with arrow) at the bottom\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right');
      return;
    }

    if (!deferredPrompt) {
      // For browsers that don't support the install prompt
      alert('To install this app:\n\n1. Open your browser menu (3 dots)\n2. Look for "Install app" or "Add to Home Screen"\n3. Follow the prompts to install');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  if (!isInstallable) return null;

  return (
    <Button
      onClick={handleInstall}
      size="sm"
      className="relative gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex-shrink-0"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
      <Badge 
        variant="secondary" 
        className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground animate-pulse"
      >
        !
      </Badge>
    </Button>
  );
}
