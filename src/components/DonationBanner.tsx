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
          0% { box-shadow: 0 0 15px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.1); }
          100% { box-shadow: 0 0 25px hsl(var(--primary) / 0.5), 0 0 50px hsl(var(--primary) / 0.2); }
        }
      `}</style>
      <div
        ref={bannerRef}
        className="fixed top-0 left-0 right-0 z-[60] pt-[env(safe-area-inset-top,0px)] pb-2 px-4 backdrop-blur-md bg-primary/60 border-b border-primary-foreground/20"
        style={{
          animation: "banner-glow 2s ease-in-out infinite alternate",
        }}
      >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Heart className="h-4 w-4 text-primary-foreground animate-pulse flex-shrink-0" />
          <p className="text-sm text-primary-foreground font-medium hidden sm:block">
            Help us make this app better!{" "}
            <Link to="/donate" className="underline hover:no-underline">
              Learn more
            </Link>
          </p>
          <p className="text-xs text-primary-foreground font-medium sm:hidden truncate">
            <Link to="/donate" className="underline">
              Support us!
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

