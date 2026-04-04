import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Download,
  X,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, lazy, Suspense } from "react";
import { PWAInstallButton } from "@/components/PWAInstallButton";
import { PunchyHero } from "@/components/PunchyHero";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { QuickTestimonialBanner } from "@/components/landing/QuickTestimonialBanner";
import { LandingPageSkeleton, TestimonialsSkeleton } from "@/components/landing/LandingPageSkeleton";
import { useSyncEarlyTracking } from "@/hooks/useSyncEarlyTracking";
import { useDisplaySettings } from "@/hooks/useDisplaySettings";


// Lazy load heavy below-the-fold components
const StreamlinedTestimonials = lazy(() => 
  import("@/components/StreamlinedTestimonials").then(m => ({ default: m.StreamlinedTestimonials }))
);
const FinalCTA = lazy(() => 
  import("@/components/FinalCTA").then(m => ({ default: m.FinalCTA }))
);
const ExplainerVideo = lazy(() => 
  import("@/components/ExplainerVideo").then(m => ({ default: m.ExplainerVideo }))
);
const InteractiveWalkthrough = lazy(() => 
  import("@/components/InteractiveWalkthrough").then(m => ({ default: m.InteractiveWalkthrough }))
);
const StudyBibleWalkthrough = lazy(() =>
  import("@/components/StudyBibleWalkthrough").then(m => ({ default: m.StudyBibleWalkthrough }))
);
const TransparencySection = lazy(() =>
  import("@/components/TransparencySection").then(m => ({ default: m.TransparencySection }))
);
const FourPathsShowcase = lazy(() => 
  import("@/components/FourPathsShowcase").then(m => ({ default: m.FourPathsShowcase }))
);
const LandingPathFilter = lazy(() => 
  import("@/components/landing/LandingPathFilter").then(m => ({ default: m.LandingPathFilter }))
);
const MobileStickyCtaBar = lazy(() => 
  import("@/components/MobileStickyCtaBar").then(m => ({ default: m.MobileStickyCtaBar }))
);

// Defer non-critical analytics until after load
const SessionTracker = lazy(() => 
  import("@/components/analytics/SessionTracker").then(m => ({ default: m.SessionTracker }))
);
const ExitIntentPopup = lazy(() => 
  import("@/components/retention/ExitIntentPopup").then(m => ({ default: m.ExitIntentPopup }))
);

// Simple section skeleton
const SectionSkeleton = () => (
  <div className="py-16 px-4">
    <div className="max-w-6xl mx-auto animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4" />
      <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8" />
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-muted rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  
  // Sync early tracking data captured before React mounted
  useSyncEarlyTracking();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const { focusMode } = useDisplaySettings();
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (window.navigator as any).standalone === true
      || document.referrer.includes('android-app://');
    
    const bannerDismissed = localStorage.getItem('installBannerDismissed');
    
    if (!isStandalone && !bannerDismissed) {
      setShowInstallBanner(true);
    }
  }, []);

  const dismissBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem('installBannerDismissed', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="The Phototheology Digital Bible"
        description="Master Bible study through the 8-floor Palace method. Store Scripture as images, patterns, and structures with Christ-centered interpretation."
      />
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}
      
      {/* Deferred analytics - load after paint */}
      <Suspense fallback={null}>
        <SessionTracker />
        {!focusMode && <ExitIntentPopup />}
      </Suspense>
      
      {/* Install Banner */}
      {showInstallBanner && !focusMode && (
        <div className="sticky top-16 z-40 bg-gradient-to-r from-primary via-primary/95 to-accent text-primary-foreground shadow-lg border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs sm:text-sm">📱 Install Phototheology</p>
                  <p className="text-[10px] sm:text-xs opacity-90 hidden sm:block">Access offline anytime</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <PWAInstallButton />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={dismissBanner}
                  className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick testimonial banner - immediate social proof */}
      {!focusMode && <QuickTestimonialBanner />}


      {/* 1. Hero - The 10-second hook - NOT lazy loaded */}
      <PunchyHero />

      {/* Below-the-fold: Lazy loaded with suspense */}
      <Suspense fallback={<SectionSkeleton />}>
        {/* 1.5 Path Filter - "Is This for Me?" - BEFORE auth */}
        <LandingPathFilter />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 2. Explainer Video */}
        <ExplainerVideo />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 3. Interactive Demo - Try it yourself */}
        <InteractiveWalkthrough />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 3.5. Study Bible Interactive Demo */}
        <StudyBibleWalkthrough />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 4. Four Paths - What you can do */}
        <FourPathsShowcase />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 5. Transparency - Pricing + FAQ */}
        <TransparencySection />
      </Suspense>

      <Suspense fallback={<TestimonialsSkeleton />}>
        {/* 6. Social Proof */}
        <StreamlinedTestimonials />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {/* 7. Final CTA */}
        <FinalCTA />
      </Suspense>

      {/* Language Selector for public visitors */}
      {!focusMode && (
        <div className="fixed bottom-20 right-3 z-50 md:bottom-6 md:right-4 zen-hideable">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full shadow-lg bg-background/95 backdrop-blur-sm h-10 w-10">
                <Globe className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end" side="top">
              <LanguageSelector showLabel={false} />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Footer />
      
      {/* Mobile Sticky CTA Bar - deferred */}
      {!focusMode && (
        <Suspense fallback={null}>
          <MobileStickyCtaBar />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
