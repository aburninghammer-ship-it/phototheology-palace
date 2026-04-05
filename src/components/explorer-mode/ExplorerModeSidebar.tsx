/**
 * ExplorerModeSidebar — Left sidebar for Level 2 (Explorer) mode
 * Includes Level 1 tabs (Ask Jeeves, Study Bible, Chapel) + 4 Space tabs
 */
import { cn } from "@/lib/utils";
import {
  MessageCircle, BookOpen, Church, Settings,
  BookOpenCheck, Gamepad2, GraduationCap, Building2, Layers,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export type ExplorerTab =
  | "chat" | "bible" | "chapel"
  | "palace" | "games-space" | "university-space";

interface TabItem {
  id: ExplorerTab;
  label: string;
  icon: typeof MessageCircle;
  section: "core" | "spaces";
  activeGradient: string;
  activeBorder: string;
  activeGlow: string;
  activeText: string;
  hoverBg: string;
  iconGlow: string;
}

const TABS: TabItem[] = [
  // === CORE (Level 1) ===
  {
    id: "chat",
    label: "Ask Jeeves",
    icon: MessageCircle,
    section: "core",
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
    section: "core",
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
    section: "core",
    activeGradient: "bg-gradient-to-r from-purple-500/20 via-purple-400/10 to-transparent",
    activeBorder: "border border-purple-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(192,132,252,0.25)]",
    activeText: "text-purple-300",
    hoverBg: "hover:bg-purple-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]",
  },
  // === PALACE ===
  {
    id: "palace",
    label: "The Palace",
    icon: Layers,
    section: "spaces",
    activeGradient: "bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-transparent",
    activeBorder: "border border-cyan-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(34,211,238,0.25)]",
    activeText: "text-cyan-300",
    hoverBg: "hover:bg-cyan-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]",
  },
  // === SPACES (Level 2) ===
  {
    id: "games-space",
    label: "Games",
    icon: Gamepad2,
    section: "spaces",
    activeGradient: "bg-gradient-to-r from-red-500/20 via-red-400/10 to-transparent",
    activeBorder: "border border-red-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(248,113,113,0.25)]",
    activeText: "text-red-300",
    hoverBg: "hover:bg-red-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(248,113,113,0.6)]",
  },
  {
    id: "university-space",
    label: "University",
    icon: GraduationCap,
    section: "spaces",
    activeGradient: "bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-transparent",
    activeBorder: "border border-yellow-400/30",
    activeGlow: "shadow-[0_0_15px_rgba(250,204,21,0.25)]",
    activeText: "text-yellow-300",
    hoverBg: "hover:bg-yellow-500/10",
    iconGlow: "drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]",
  },
];

interface ExplorerModeSidebarProps {
  activeTab: ExplorerTab;
  onTabChange: (tab: ExplorerTab) => void;
}

export function ExplorerModeSidebar({ activeTab, onTabChange }: ExplorerModeSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const coreTabs = TABS.filter(t => t.section === "core");
  const spaceTabs = TABS.filter(t => t.section === "spaces");

  const renderTab = (tab: TabItem) => {
    const isActive = activeTab === tab.id;
    const Icon = tab.icon;
    return (
      <button
        key={tab.id}
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
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border/50 transition-all duration-200 bg-card/80 backdrop-blur-xl",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Header */}
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

      {/* Core tabs */}
      <nav className="py-3 px-2 space-y-1.5">
        {coreTabs.map(renderTab)}
      </nav>

      {/* Divider + Spaces */}
      <div className="px-3">
        <div className="border-t border-border/40" />
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold mt-2 mb-1 px-1">
            Spaces
          </p>
        )}
      </div>
      <nav className="flex-1 py-1 px-2 space-y-1.5 overflow-y-auto">
        {spaceTabs.map(renderTab)}
      </nav>

      {/* Settings */}
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
