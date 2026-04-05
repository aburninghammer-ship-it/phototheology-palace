/**
 * BasicModeSidebar — Left sidebar for Level 1 (Basic) mode
 * ChatGPT-style vertical tab navigation
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
}

const TABS: TabItem[] = [
  { id: "chat", label: "Ask Jeeves", icon: MessageCircle, description: "Ask anything about the Bible" },
  { id: "bible", label: "Study Bible", icon: BookOpen, description: "Read with commentary" },
  { id: "audio", label: "Audio", icon: Headphones, description: "Listen to commentary" },
  { id: "plans", label: "Reading Plans", icon: CalendarDays, description: "Daily Bible reading" },
  { id: "morning", label: "Morning Watch", icon: Sun, description: "Start your day with God" },
  { id: "night", label: "Night Watch", icon: Moon, description: "Evening meditation" },
  { id: "devotional", label: "Daily Word", icon: Sparkles, description: "Today's devotional" },
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
        "flex flex-col h-full border-r border-[hsl(220,10%,18%)] bg-[hsl(220,13%,8%)] transition-all duration-200",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Sidebar Header */}
      <div className="h-12 flex items-center px-3 border-b border-[hsl(220,10%,18%)]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-[hsl(220,10%,15%)] text-[hsl(220,10%,60%)]"
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
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg transition-colors text-left",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                isActive
                  ? "bg-[hsl(220,10%,18%)] text-white"
                  : "text-[hsl(220,10%,55%)] hover:bg-[hsl(220,10%,14%)] hover:text-[hsl(220,10%,80%)]"
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
      <div className="px-2 pb-3 border-t border-[hsl(220,10%,18%)] pt-2">
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-[hsl(220,10%,45%)] hover:bg-[hsl(220,10%,14%)] hover:text-[hsl(220,10%,70%)] transition-colors",
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
