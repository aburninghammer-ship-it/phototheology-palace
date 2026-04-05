/**
 * BasicModeSidebar — Left sidebar for Level 1 (Basic) mode
 * Uses the same dark theme as Level 3 via Tailwind tokens
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
}

const TABS: TabItem[] = [
  { id: "chat", label: "Ask Jeeves", icon: MessageCircle, tourId: "tab-chat" },
  { id: "bible", label: "Study Bible", icon: BookOpen, tourId: "tab-bible" },
  { id: "chapel", label: "Chapel", icon: Church, tourId: "tab-chapel" },
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
        "flex flex-col h-full border-r border-border transition-all duration-200 bg-card",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center px-3 border-b border-border">
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
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-tour={tab.tourId}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg transition-colors text-left",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              title={collapsed ? tab.label : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{tab.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-2 pb-3 pt-2 border-t border-border">
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-2.5"
          )}
        >
          <Settings className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
