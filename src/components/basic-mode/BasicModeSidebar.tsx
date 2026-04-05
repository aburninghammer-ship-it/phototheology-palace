/**
 * BasicModeSidebar — Left sidebar for Level 1 (Basic) mode
 * Teal/green themed — distinct from Level 3's purple palette
 * Includes data-tour attributes for guided tour highlighting
 */
import { cn } from "@/lib/utils";
import { MessageCircle, BookOpen, Headphones, CalendarDays, Sun, Moon, Sparkles, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export type BasicTab = "chat" | "bible" | "audio" | "plans" | "morning" | "night" | "devotional";

interface TabItem {
  id: BasicTab;
  label: string;
  icon: typeof MessageCircle;
  description: string;
  tourId: string;
}

const TABS: TabItem[] = [
  { id: "chat", label: "Ask Jeeves", icon: MessageCircle, description: "Ask anything about the Bible", tourId: "tab-chat" },
  { id: "bible", label: "Study Bible", icon: BookOpen, description: "Read with commentary", tourId: "tab-bible" },
  { id: "audio", label: "Audio", icon: Headphones, description: "Listen to commentary", tourId: "tab-audio" },
  { id: "plans", label: "Reading Plans", icon: CalendarDays, description: "Daily Bible reading", tourId: "tab-plans" },
  { id: "morning", label: "Morning Watch", icon: Sun, description: "Start your day with God", tourId: "tab-morning" },
  { id: "night", label: "Night Watch", icon: Moon, description: "Evening meditation", tourId: "tab-night" },
  { id: "devotional", label: "Daily Word", icon: Sparkles, description: "Today's devotional", tourId: "tab-devotional" },
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
        "flex flex-col h-full border-r transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
      style={{
        borderColor: "hsl(170 20% 18%)",
        background: "linear-gradient(180deg, hsl(170 25% 8%), hsl(170 20% 5%))",
      }}
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center px-3" style={{ borderBottom: "1px solid hsl(170 20% 18%)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "hsl(170 30% 50%)" }}
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
              )}
              style={{
                background: isActive ? "hsl(170 30% 16%)" : "transparent",
                color: isActive ? "hsl(170 50% 80%)" : "hsl(170 15% 50%)",
              }}
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
      <div className="px-2 pb-3 pt-2" style={{ borderTop: "1px solid hsl(170 20% 18%)" }}>
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
            collapsed && "justify-center px-2.5"
          )}
          style={{ color: "hsl(170 15% 42%)" }}
        >
          <Settings className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span className="text-sm">Settings</span>}
        </button>
      </div>
    </aside>
  );
}
