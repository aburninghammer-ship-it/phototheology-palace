import { useLayoutEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const DonationBanner = () => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem("donation-banner-dismissed") === "true";
  });

  const bannerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;

    const setHeight = (h: number) => {
      root.style.setProperty("--app-top-banner-height", `${h}px`);
      window.dispatchEvent(new Event("app:topBannerResize"));
    };

    if (isDismissed) {
      setHeight(0);
      return;
    }

    const el = bannerRef.current;
    if (!el) {
      setHeight(0);
      return;
    }

    const update = () => {
      const next = Math.ceil(el.getBoundingClientRect().height);
      setHeight(next);
    };

    update();

    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      ro.disconnect();
    };
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("donation-banner-dismissed", "true");
  };

  if (isDismissed) return null;

  return (
    <>
      <style>{`
        @keyframes banner-glow {
          0% { box-shadow: 0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2), inset 0 0 20px hsl(var(--primary) / 0.1); }
          100% { box-shadow: 0 0 35px hsl(var(--primary) / 0.6), 0 0 70px hsl(var(--primary) / 0.3), inset 0 0 30px hsl(var(--primary) / 0.15); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <div
        ref={bannerRef}
        className="fixed top-0 left-0 right-0 z-[60] pt-[env(safe-area-inset-top,0px)] pb-2 px-4 backdrop-blur-lg bg-gradient-to-r from-primary/80 via-primary/90 to-primary/80 border-b-2 border-primary-foreground/30"
        style={{
          animation: "banner-glow 1.5s ease-in-out infinite alternate",
        }}
      >
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-2 relative">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Heart className="h-5 w-5 text-primary-foreground animate-pulse flex-shrink-0" fill="currentColor" />
            <p className="text-sm text-primary-foreground font-semibold hidden sm:block drop-shadow-sm">
              Help keep PhototheologyOS running!{" "}
              <Link to="/donate" className="underline hover:no-underline font-bold">
                Learn more
              </Link>
            </p>
            <p className="text-xs text-primary-foreground font-semibold sm:hidden truncate">
              <Link to="/donate" className="underline">
                Support PhototheologyOS!
              </Link>
            </p>
          </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="whitespace-nowrap bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-7 px-2 text-xs"
          >
            <Link to="/donate">Donate</Link>
          </Button>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="p-0 h-8 w-8 min-w-[32px] hover:bg-primary-foreground/20 rounded-full"
            aria-label="Dismiss donation banner"
          >
            <X className="h-5 w-5 text-primary-foreground" />
          </Button>
        </div>
      </div>
      </div>
    </>
  );
};

