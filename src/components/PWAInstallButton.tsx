import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Button } from '@/components/ui/button';
import { Download, Chrome, Globe, Apple } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [browserType, setBrowserType] = useState<'chrome' | 'edge' | 'firefox' | 'safari' | 'other'>('other');

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

    // Detect browser type
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('edg/')) {
      setBrowserType('edge');
    } else if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
      setBrowserType('chrome');
    } else if (userAgent.includes('firefox')) {
      setBrowserType('firefox');
    } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
      setBrowserType('safari');
    }

    // Check if mobile (any mobile device)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    console.log('PWA Install Button - Device detection:', {
      isIOSDevice,
      isMobile,
      isStandalone,
      browserType,
      userAgent: navigator.userAgent
    });

    // Show on all devices unless already installed - PWAs work on desktop too!
    if (!isStandalone) {
      console.log('Showing install button - app not yet installed');
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

    // If we have the native prompt (Chrome/Edge desktop & Android), trigger it automatically
    if (deferredPrompt) {
      try {
        console.log('Triggering native browser install prompt');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          setDeferredPrompt(null);
          setIsInstallable(false);
        } else {
          console.log('User dismissed the install prompt');
        }
      } catch (error) {
        console.error('Error showing install prompt:', error);
        // If native prompt fails, show instructions as fallback
        setShowInstructions(true);
      }
      return;
    }

    // Fallback: show manual instructions for browsers that don't support automatic install
    console.log('No native install prompt available, showing manual instructions');
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
        <span className="hidden sm:inline">{t('pwa.installApp')}</span>
        <Badge
          variant="secondary"
          className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground"
        >
          ✓
        </Badge>
      </Button>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{t('pwa.installTitle')}</DialogTitle>
            <DialogDescription>
              {t('pwa.chooseBrowser')}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={isIOS ? 'safari' : browserType} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="chrome" className="flex items-center gap-2">
                <Chrome className="h-4 w-4" />
                <span className="hidden sm:inline">Chrome</span>
              </TabsTrigger>
              <TabsTrigger value="edge" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Edge</span>
              </TabsTrigger>
              <TabsTrigger value="firefox" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">Firefox</span>
              </TabsTrigger>
              <TabsTrigger value="safari" className="flex items-center gap-2">
                <Apple className="h-4 w-4" />
                <span className="hidden sm:inline">Safari</span>
              </TabsTrigger>
            </TabsList>

            {/* Chrome Instructions */}
            <TabsContent value="chrome" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Chrome className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t('pwa.chromeTitle')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.chromeStep1')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.chromeStep1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.chromeStep2')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.chromeStep2Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.chromeStep3')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.chromeStep3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">✨ {t('pwa.chromeNote')}</p>
            </TabsContent>

            {/* Edge Instructions */}
            <TabsContent value="edge" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t('pwa.edgeTitle')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.edgeStep1')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.edgeStep1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.edgeStep2')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.edgeStep2Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.edgeStep3')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.edgeStep3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">✨ {t('pwa.edgeNote')}</p>
            </TabsContent>

            {/* Firefox Instructions */}
            <TabsContent value="firefox" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t('pwa.firefoxTitle')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.firefoxStep1')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.firefoxStep1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.firefoxStep2')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.firefoxStep2Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.firefoxStep3')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.firefoxStep3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">{t('pwa.firefoxNote')}</p>
            </TabsContent>

            {/* Safari Instructions */}
            <TabsContent value="safari" className="space-y-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Apple className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">{t('pwa.safariTitle')}</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.safariStep1')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.safariStep1Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.safariStep2')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.safariStep2Desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
                    <div>
                      <p className="font-medium mb-1">{t('pwa.safariStep3')}</p>
                      <p className="text-muted-foreground text-xs">{t('pwa.safariStep3Desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-xs">{t('pwa.safariNote')}</p>
            </TabsContent>
          </Tabs>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-center">
              <strong>{t('pwa.benefits')}</strong> {t('pwa.benefitsDesc')}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
