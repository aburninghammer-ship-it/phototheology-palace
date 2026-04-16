import { useState, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pin, PinOff, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { DEFAULT_NAV_TABS, getOrderedTabs, type NavTab } from "@/data/navTabs";
import { toast } from "sonner";

interface SortableTabProps {
  tab: NavTab;
  isActive: boolean;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  isDragging?: boolean;
  isAnyDragging?: boolean;
  wasDragging?: boolean;
}

function SortableTab({ tab, isActive, isPinned, onPin, onUnpin, isDragging, isAnyDragging, wasDragging }: SortableTabProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tab.id, disabled: isPinned });

  // Prevent navigation if ANY drag is happening or just finished
  const handleClick = (e: React.MouseEvent) => {
    if (isAnyDragging || wasDragging) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // Also prevent on mousedown/mouseup during drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnyDragging || wasDragging) {
      e.preventDefault();
    }
  };

  // Wrapper style for sortable container transform
  const wrapperStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const glowColor = tab.gradient.glow.replace("rgba(", "rgb(").replace(",0.5)", ")");
  const glowSoft = tab.gradient.glow.replace(",0.5)", ",0.12)");
  const glowMid = tab.gradient.glow.replace(",0.5)", ",0.2)");
  const glowBorder = tab.gradient.glow.replace(",0.5)", ",0.32)");
  const glowStrong = tab.gradient.glow.replace(",0.5)", ",0.48)");

  const tabContent = (
    <div
      className={cn(
        "relative overflow-hidden px-4 py-2 text-sm font-medium rounded-2xl transition-all duration-300 whitespace-nowrap flex items-center gap-2.5 border backdrop-blur-xl hover:-translate-y-0.5",
        isDragging && "opacity-50 scale-105 shadow-lg z-50"
      )}
      style={{
        background: `linear-gradient(135deg, ${glowMid}, ${glowSoft})`,
        borderColor: isActive ? glowStrong : glowBorder,
        boxShadow: isActive
          ? `0 0 0 1px ${glowBorder}, 0 0 30px ${glowStrong}, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 18px ${glowSoft}`
          : `0 0 0 1px ${glowBorder}, 0 0 18px ${glowSoft}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {!isPinned && (
        <span {...listeners} className="cursor-grab active:cursor-grabbing opacity-55 hover:opacity-100 transition-opacity">
          <GripVertical className="h-3 w-3" style={{ color: glowColor }} />
        </span>
      )}
      {isPinned && <Pin className="h-3 w-3" style={{ color: glowColor }} />}
      {tab.logoUrl ? (
        <img src={tab.logoUrl} alt="" className="h-4 w-4 rounded-sm object-contain" />
      ) : (
        <tab.icon className="h-3.5 w-3.5 shrink-0" style={{ color: glowColor, filter: `drop-shadow(0 0 8px ${glowSoft})` }} />
      )}
      <span className="font-semibold tracking-tight" style={{ color: glowColor, textShadow: `0 0 14px ${glowSoft}` }}>
        {t('navTabs.' + tab.id, { defaultValue: tab.shortLabel || tab.label })}
      </span>
    </div>
  );

  if (tab.isDropdown && tab.dropdownItems) {
    return (
      <div ref={setNodeRef} style={wrapperStyle} {...attributes}>
        <ContextMenu>
          <ContextMenuTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="focus:outline-none"
                  style={{ pointerEvents: (isAnyDragging || wasDragging) ? 'none' : 'auto' }}
                >
                  {tabContent}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-card border-border z-50">
                {tab.dropdownItems.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link to={item.to}>
                      {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                      {t('navDropdown.' + item.to.replace(/\//g, '').replace(/-/g, ''), { defaultValue: item.label })}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {isPinned ? (
              <ContextMenuItem onClick={onUnpin}>
                <PinOff className="h-4 w-4 mr-2" />
                {t('nav.unpinTab')}
              </ContextMenuItem>
            ) : (
              <ContextMenuItem onClick={onPin}>
                <Pin className="h-4 w-4 mr-2" />
                {t('nav.pinToStart')}
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={wrapperStyle} {...attributes}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Link
            to={tab.to}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            style={{ pointerEvents: (isAnyDragging || wasDragging) ? 'none' : 'auto' }}
          >
            {tabContent}
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {isPinned ? (
            <ContextMenuItem onClick={onUnpin}>
              <PinOff className="h-4 w-4 mr-2" />
              {t('nav.unpinTab')}
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={onPin}>
              <Pin className="h-4 w-4 mr-2" />
              {t('nav.pinToStart')}
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

export function DraggableNavTabs() {
  const { t } = useTranslation();
  const location = useLocation();
  const { preferences, updatePreference } = useUserPreferences();
  const { isMember: isChurchMember, churchId, churchLogoUrl } = useChurchMembership();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [wasDragging, setWasDragging] = useState(false);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Increase distance to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get ordered tabs based on user preferences
  const orderedTabs = useMemo(() => {
    return getOrderedTabs(
      preferences.pinned_nav_tabs || [],
      preferences.nav_tab_order || [],
      isChurchMember
    ).map(tab => {
      // Handle church space tab with churchId and logo
      if (tab.id === "church-space" && churchId) {
        return {
          ...tab,
          to: `/living-manna?church=${churchId}`,
          ...(churchLogoUrl ? { logoUrl: churchLogoUrl } : {}),
        };
      }
      return tab;
    });
  }, [preferences.pinned_nav_tabs, preferences.nav_tab_order, isChurchMember, churchId, churchLogoUrl]);

  const pinnedTabIds = preferences.pinned_nav_tabs || [];

  // Check if a path is active
  const isActiveTab = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleDragStart = (event: DragStartEvent) => {
    // Clear any pending timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    setActiveId(event.active.id as string);
    setWasDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Keep wasDragging true for longer to prevent accidental navigation
    // Clear any existing timeout first
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(() => {
      setWasDragging(false);
    }, 300); // Increased from 100ms to 300ms

    if (!over || active.id === over.id) return;

    const draggedId = active.id as string;
    const targetId = over.id as string;

    // Don't allow dragging pinned tabs
    if (pinnedTabIds.includes(draggedId)) return;

    // Can't drop into the pinned section
    if (pinnedTabIds.includes(targetId)) return;

    // Get just the unpinned tabs in their current order
    const unpinnedTabs = orderedTabs.filter(tab => !pinnedTabIds.includes(tab.id));

    const oldIndex = unpinnedTabs.findIndex(tab => tab.id === draggedId);
    const newIndex = unpinnedTabs.findIndex(tab => tab.id === targetId);

    // Validate indices
    if (oldIndex === -1 || newIndex === -1) return;
    if (oldIndex === newIndex) return;

    // Perform the reorder on unpinned tabs
    const reorderedTabs = arrayMove(unpinnedTabs, oldIndex, newIndex);
    const newOrder = reorderedTabs.map(tab => tab.id);

    updatePreference("nav_tab_order", newOrder);
    toast.success(t('nav.tabOrderUpdated'));
  };

  const handleDragCancel = () => {
    setActiveId(null);
    // Keep wasDragging true briefly to prevent navigation
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }
    dragTimeoutRef.current = setTimeout(() => {
      setWasDragging(false);
    }, 300);
  };

  const handlePin = (tabId: string) => {
    const newPinned = [...pinnedTabIds, tabId];
    updatePreference("pinned_nav_tabs", newPinned);
    toast.success(t('nav.tabPinned'));
  };

  const handleUnpin = (tabId: string) => {
    const newPinned = pinnedTabIds.filter(id => id !== tabId);
    updatePreference("pinned_nav_tabs", newPinned);
    toast.success(t('nav.tabUnpinned'));
  };

  return (
    <div className="border-t border-border/40 hidden md:block">
      <div className="max-w-7xl mx-auto overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60" style={{ scrollbarWidth: 'thin' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={orderedTabs.map(tab => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-center gap-1 py-2 px-2 flex-nowrap min-w-max">
              {orderedTabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  isActive={isActiveTab(tab.to)}
                  isPinned={pinnedTabIds.includes(tab.id)}
                  onPin={() => handlePin(tab.id)}
                  onUnpin={() => handleUnpin(tab.id)}
                  isDragging={activeId === tab.id}
                  isAnyDragging={activeId !== null}
                  wasDragging={wasDragging}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <p className="text-[10px] text-muted-foreground text-center pb-1 hidden lg:block">
        {t('nav.tabReorderHint')}
      </p>
    </div>
  );
}
