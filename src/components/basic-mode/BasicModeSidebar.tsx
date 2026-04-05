/**
 * BasicModeSidebar — Left sidebar for Level 1 (Basic) mode
 * Glassified, color-coded tabs with glow effects
 */
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, Church, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export type BasicTab = "chat" | "bible" | "chapel";

interface TabItem {
  id: BasicTab;
  label: string;
  icon: typeof MessageCircle;
  tourId: string;
  activeGradient: string;
  activeBorder: string;
  activeGlow: string;
  activeText: string;
  hoverBg: string;
  iconGlow: string;
}

const TABS: TabItem[] = [
  {
    id: "chat",
    label: "Ask Jeeves",
    icon: MessageCircle,
    tourId: "tab-chat",
    activeGradient: "bg-gradient-to-r from-blue-500/20 via-blue-400/10 to-transparent",
    activeBorder: "border border-blue-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(96,165,250,0.25)]",
    activeText: "text-blue-300",
    hoverBg: "hover:bg-blue-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]",
  },
  {
    id: "bible",
    label: "Study Bible",
    icon: BookOpen,
    tourId: "tab-bible",
    activeGradient: "bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent",
    activeBorder: "border border-amber-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
    activeText: "text-amber-300",
    hoverBg: "hover:bg-amber-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]",
  },
  {
    id: "chapel",
    label: "Chapel",
    icon: Church,
    tourId: "tab-chapel",
    activeGradient: "bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent",
    activeBorder: "border border-purple-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(192,132,252,0.25)]",
    activeText: "text-purple-300",
    hoverBg: "hover:bg-purple-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]",
  },
];

interface BasicModeSidebarProps {
  activeTab: BasicTab;
  onTabChange: (tab: BasicTab) => void;
}

export function BasicModeSidebar({ activeTab, onTabChange }: BasicModeSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border/50 transition-all duration-200 bg-card/80 backdrop-blur-xl",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center px-3 border-b border-border/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Tab List */}
      <nav className="flex-1 py-3 px-2 space-y-2 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-tour={tab.tourId}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl transition-all duration-300 text-left backdrop-blur-md",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                isActive
                  ? cn(tab.activeGradient, tab.activeBorder, tab.activeGlow, tab.activeText)
                  : cn("text-muted-foreground hover:text-foreground border border-transparent", tab.hoverBg)
              )}
              title={collapsed ? tab.label : undefined}
            >
              <Icon className={cn("h-[18px] w-[18px] shrink-0 transition-all duration-300", isActive && tab.iconGlow)} />
              {!collapsed && (
                <span className={cn("text-sm font-medium truncate", isActive && "font-semibold")}>{tab.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-3 pt-2 border-t border-border/50">
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 text-muted-foreground hover:text-foreground hover:bg-muted/30 backdrop-blur-md border border-transparent hover:border-muted-foreground/10",
            collapsed && "justify-center px-2.5"
          )}
        >
          <Settings className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
