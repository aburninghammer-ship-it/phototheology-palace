import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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
    console.log('Install button clicked', { isIOS, hasDeferredPrompt: !!deferredPrompt });
    
    // If we have the native prompt, use it
    if (deferredPrompt && !isIOS) {
      try {
        console.log('Triggering install prompt');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstallable(false);
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
      }
      return;
    }

    // Otherwise show instructions dialog
    setShowInstructions(true);
  };

  if (!isInstallable) return null;

  return (
    <>
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

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Install Phototheology App</DialogTitle>
            <DialogDescription>
              Follow these steps to install the app on your device
            </DialogDescription>
          </DialogHeader>
          
          {isIOS ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <p>Tap the <strong>Share</strong> button (square with arrow) at the bottom of Safari</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <p>Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <p>Tap <strong>"Add"</strong> in the top right corner</p>
              </div>
              <p className="text-muted-foreground text-xs mt-4">The app will appear on your home screen like a native app!</p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                <p>Tap the <strong>menu</strong> button (three dots) in your browser</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                <p>Look for <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                <p>Follow the prompts to install</p>
              </div>
              <p className="text-muted-foreground text-xs mt-4">The app will work offline and load faster once installed!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
