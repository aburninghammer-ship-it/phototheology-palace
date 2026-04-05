import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PanelLeftClose, PanelLeftOpen, LayoutGrid, Pin } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePinnedDock } from "@/hooks/usePinnedDock";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
import { isFeatureAccessible } from "@/config/featureRegistry";

export function OSDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const { pinnedItems, togglePin } = usePinnedDock();
  const { mode, isBasic } = useExperienceMode();
  const currentPath = location.pathname;

  const publicPaths = ["/", "/landing", "/auth", "/interactive-demo", "/comparison", "/privacy-policy", "/terms-of-service", "/level-select"];
  const isPublicPage = publicPaths.some(p => currentPath === p) || currentPath.startsWith("/auth");
  if (isMobile || isPublicPage || isBasic) return null;

  // Filter pinned items to only show accessible ones for current mode
  const accessiblePinned = pinnedItems.filter(item => isFeatureAccessible(mode, item.path));

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");

  if (!visible) {
    return (
      <div className="shrink-0 relative z-40">
        <button
          onClick={() => setVisible(true)}
          className="absolute top-3 left-2 p-1.5 rounded-lg bg-sidebar/80 backdrop-blur-md border border-white/10 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Show Dock"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ width: 64 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="h-full flex flex-col bg-sidebar/70 backdrop-blur-2xl border-r border-white/[0.04] shrink-0 relative z-40"
    >
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.04] p-2 flex justify-center">
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 transition-colors"
          title="Hide Dock"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Back to Spaces */}
      {currentPath !== "/" && currentPath !== "/welcome" && currentPath !== "/palace" && (
        <div className="shrink-0 px-2 pt-2 flex justify-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(mode === "explorer" ? "/palace" : "/")}
                className="p-2.5 rounded-xl transition-all backdrop-blur-md border border-white/10 bg-primary/10 hover:bg-primary/20 text-primary hover:border-primary/30"
                title={mode === "explorer" ? "Back to Palace" : "Back to Spaces"}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="font-medium backdrop-blur-xl bg-popover/90 border-white/10 z-50">
              {mode === "explorer" ? "Back to Palace" : "Back to Spaces"}
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Pinned Favorites */}
      <div className="flex-1 flex flex-col items-center gap-1 py-3 px-1 overflow-visible">
        {accessiblePinned.length === 0 && (
          <div className="text-[9px] text-muted-foreground/40 text-center px-1 mt-4">
            Pin tools from Spaces
          </div>
        )}
        {accessiblePinned.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const itemColor = `hsl(${item.glow})`;

          return (
            <div key={item.path} className="relative w-full group overflow-visible">
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "relative flex items-center p-2.5 justify-center rounded-xl transition-all duration-200 w-full",
                      "backdrop-blur-md border border-transparent",
                      active && "border-white/10"
                    )}
                    style={{
                      backgroundColor: active ? `hsl(${item.glow} / 0.15)` : undefined,
                      boxShadow: active ? `0 0 12px hsl(${item.glow} / 0.2)` : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.12)`;
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                      }
                    }}
                  >
                    {active && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
                        style={{ backgroundColor: itemColor, height: "24px" }}
                      />
                    )}
                    <Icon className="h-5 w-5 shrink-0" style={{ color: itemColor }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  sideOffset={8}
                  avoidCollisions
                  collisionPadding={{ left: 12, right: 12, top: 8, bottom: 8 }}
                  className="font-medium backdrop-blur-xl bg-popover/90 border-white/10 max-w-[min(280px,calc(100vw-24px))] z-50"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.label}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(item.path);
                      }}
                      className="ml-1 p-1 rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Unpin from dock"
                    >
                      <Pin className="h-3 w-3" />
                    </button>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
