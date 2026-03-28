import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DOCK_SECTIONS, type DockItem, type DockSubItem } from "./dockData";
import { useIsMobile } from "@/hooks/use-mobile";

export function OSDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const currentPath = location.pathname;

  // Hide dock on mobile (MobileBottomNav handles mobile), and on public/auth pages
  const publicPaths = ["/", "/landing", "/auth", "/pricing", "/interactive-demo", "/comparison", "/privacy-policy", "/terms-of-service"];
  const isPublicPage = publicPaths.some(p => currentPath === p) || currentPath.startsWith("/auth");
  if (isMobile || isPublicPage) return null;

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  const isParentActive = (item: DockItem) =>
    isActive(item.path) || item.children?.some((c) => isActive(c.path));

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = (item: DockItem) => {
    const active = isActive(item.path);
    const parentActive = isParentActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = expandedItems.has(item.id);
    const Icon = item.icon;
    const itemColor = `hsl(${item.glow})`;
    const itemColorFaint = `hsl(${item.glow} / 0.15)`;

    // Collapsed mode
    if (!expanded) {
      return (
        <div key={item.id}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className="relative flex items-center p-2.5 justify-center rounded-xl transition-all duration-200 w-full"
                style={{ backgroundColor: (active || parentActive) ? itemColorFaint : undefined }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = itemColorFaint; }}
                onMouseLeave={(e) => { if (!active && !parentActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {(active || parentActive) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
                    style={{ backgroundColor: itemColor, height: active ? "24px" : "16px", opacity: active ? 1 : 0.5 }} />
                )}
                <Icon className="h-5 w-5 shrink-0" style={{ color: itemColor }} />
                {hasChildren && (
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `hsl(${item.glow} / 0.5)` }} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <p className="font-semibold">{item.label}</p>
              {hasChildren && (
                <div className="mt-1.5 space-y-0.5 border-t border-border pt-1.5">
                  {item.children!.map((sub) => (
                    <button key={sub.id} onClick={() => navigate(sub.path)}
                      className={cn("block text-xs w-full text-left px-1 py-0.5 rounded hover:bg-muted",
                        isActive(sub.path) && "text-primary font-medium"
                      )}>{sub.label}</button>
                  ))}
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }

    // Expanded mode
    return (
      <div key={item.id}>
        <button
          onClick={() => hasChildren ? toggleExpand(item.id) : navigate(item.path)}
          className="relative flex items-center gap-3 rounded-xl transition-all duration-200 group w-full px-3 py-2.5"
          style={{
            backgroundColor: active ? itemColorFaint : undefined,
            color: (active || parentActive) ? itemColor : undefined,
          }}
          onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = itemColorFaint; e.currentTarget.style.color = itemColor; } }}
          onMouseLeave={(e) => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = parentActive ? itemColor : ""; } }}
        >
          {(active || parentActive) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
              style={{ backgroundColor: itemColor, height: active ? "24px" : "16px", opacity: active ? 1 : 0.5 }} />
          )}
          <Icon className="h-5 w-5 shrink-0" style={{ color: itemColor }} />
          <span className="text-sm font-medium truncate flex-1 text-left">{item.label}</span>
          {hasChildren && (
            <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-180")}
              style={{ color: `hsl(${item.glow} / 0.5)` }} />
          )}
          {active && (
            <div className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle at center, hsl(${item.glow} / 0.4), transparent)` }} />
          )}
        </button>

        <AnimatePresence>
          {hasChildren && isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="ml-4 pl-3 py-1 flex flex-col gap-0.5" style={{ borderLeft: `2px solid hsl(${item.glow} / 0.25)` }}>
                <button onClick={() => navigate(item.path)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full hover:bg-muted"
                  style={{ color: active ? itemColor : undefined }}>
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: itemColor }} />
                  <span className="truncate">{item.label} Home</span>
                </button>
                {item.children!.map((sub) => {
                  const subActive = isActive(sub.path);
                  const SubIcon = sub.icon || ChevronRight;
                  return (
                    <button key={sub.id} onClick={() => navigate(sub.path)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full"
                      style={{
                        color: subActive ? itemColor : `hsl(${item.glow} / 0.75)`,
                        backgroundColor: subActive ? `hsl(${item.glow} / 0.15)` : undefined,
                        fontWeight: subActive ? 600 : 400,
                      }}
                      onMouseEnter={(e) => { if (!subActive) { e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.08)`; e.currentTarget.style.color = itemColor; }}}
                      onMouseLeave={(e) => { if (!subActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = `hsl(${item.glow} / 0.75)`; }}}
                    >
                      <SubIcon className="h-3.5 w-3.5 shrink-0" style={{ color: itemColor }} />
                      <span className="truncate">{sub.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: expanded ? 240 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full flex flex-col bg-sidebar border-r border-sidebar-border shrink-0 relative z-40"
    >
      {/* Brand */}
      <div className={cn("flex items-center shrink-0 border-b border-sidebar-border", expanded ? "h-12 px-4 gap-3" : "h-12 justify-center")}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, hsl(32 95% 53%), hsl(210 85% 50%))" }}>
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        {expanded && (
          <span className="text-xs font-bold truncate"
            style={{ background: "linear-gradient(135deg, hsl(32 95% 53%), hsl(210 85% 50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PhototheologyOS
          </span>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 py-2", expanded ? "px-3" : "px-2")}>
          {DOCK_SECTIONS.map((section, sIdx) => (
            <div key={section.id}>
              {sIdx > 0 && <div className="border-t border-sidebar-border my-2 mx-1" />}
              {expanded && (
                <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider px-3 pt-2 pb-1 block">
                  {section.label}
                </span>
              )}
              {section.items.map(renderItem)}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Toggle */}
      <div className={cn("shrink-0 border-t border-sidebar-border p-2", !expanded && "flex justify-center")}>
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
          {expanded ? (
            <><ChevronLeft className="h-4 w-4" /><span className="text-xs font-medium">Collapse</span></>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
