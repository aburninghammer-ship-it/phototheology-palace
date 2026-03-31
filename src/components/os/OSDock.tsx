import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, ChevronDown, PanelLeftClose, PanelLeftOpen, GripVertical, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DOCK_ITEMS, type DockItem } from "./dockData";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DOCK_ORDER_KEY = "phototheology-dock-order";
const SUB_ORDER_KEY_PREFIX = "phototheology-sub-order-";

function getStoredOrder(): string[] | null {
  try {
    const stored = localStorage.getItem(DOCK_ORDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function storeOrder(ids: string[]) {
  localStorage.setItem(DOCK_ORDER_KEY, JSON.stringify(ids));
}

function getStoredSubOrder(parentId: string): string[] | null {
  try {
    const stored = localStorage.getItem(SUB_ORDER_KEY_PREFIX + parentId);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

function storeSubOrder(parentId: string, ids: string[]) {
  localStorage.setItem(SUB_ORDER_KEY_PREFIX + parentId, JSON.stringify(ids));
}

function SortableDockItem({ item, children }: { item: DockItem; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group/sortable">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover/sortable:opacity-60 transition-opacity cursor-grab active:cursor-grabbing z-10" {...listeners}>
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

function SortableSubItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group/sub-sortable flex items-center">
      <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/sub-sortable:opacity-60 transition-opacity cursor-grab active:cursor-grabbing z-10" {...listeners}>
        <GripVertical className="h-3 w-3 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

export function OSDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [subOrders, setSubOrders] = useState<Record<string, string[]>>({});
  const [orderedItems, setOrderedItems] = useState<DockItem[]>(() => {
    const storedOrder = getStoredOrder();
    if (storedOrder) {
      const ordered: DockItem[] = [];
      for (const id of storedOrder) {
        const found = DOCK_ITEMS.find(i => i.id === id);
        if (found) ordered.push(found);
      }
      for (const item of DOCK_ITEMS) {
        if (!storedOrder.includes(item.id)) ordered.push(item);
      }
      return ordered;
    }
    return DOCK_ITEMS;
  });

  const getOrderedChildren = useCallback((item: DockItem) => {
    if (!item.children) return [];
    const stored = subOrders[item.id] || getStoredSubOrder(item.id);
    if (stored) {
      const ordered = stored.map(id => item.children!.find(c => c.id === id)).filter(Boolean) as typeof item.children;
      // Add any new children not in stored order
      for (const child of item.children) {
        if (!stored.includes(child.id)) ordered!.push(child);
      }
      return ordered!;
    }
    return item.children;
  }, [subOrders]);

  const handleSubDragEnd = useCallback((parentId: string, children: typeof DOCK_ITEMS[0]['children']) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !children) return;
    const oldIndex = children.findIndex(c => c.id === active.id);
    const newIndex = children.findIndex(c => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(children, oldIndex, newIndex);
    const newIds = reordered.map(c => c.id);
    storeSubOrder(parentId, newIds);
    setSubOrders(prev => ({ ...prev, [parentId]: newIds }));
  }, []);
  const currentPath = location.pathname;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const publicPaths = ["/", "/landing", "/auth", "/interactive-demo", "/comparison", "/privacy-policy", "/terms-of-service"];
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        storeOrder(newItems.map(i => i.id));
        return newItems;
      });
    }
  };

  // Fully hidden
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

  const renderItem = (item: DockItem) => {
    const active = isActive(item.path);
    const parentActive = isParentActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = expandedItems.has(item.id);
    const Icon = item.icon;
    const itemColor = `hsl(${item.glow})`;

    // Collapsed mode
    if (!expanded) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex items-center p-2.5 justify-center rounded-xl transition-all duration-200 w-full",
                "backdrop-blur-md border border-transparent",
                (active || parentActive) && "border-white/10"
              )}
              style={{
                backgroundColor: (active || parentActive) ? `hsl(${item.glow} / 0.15)` : undefined,
                boxShadow: active ? `0 0 12px hsl(${item.glow} / 0.2)` : undefined,
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.12)`; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; } }}
              onMouseLeave={(e) => { if (!active && !parentActive) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
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
          <TooltipContent side="right" className="font-medium backdrop-blur-xl bg-popover/90 border-white/10">
            <p className="font-semibold">{item.label}</p>
            {hasChildren && (
              <div className="mt-1.5 space-y-0.5 border-t border-border pt-1.5">
                {item.children!.map((sub) => (
                  <button key={sub.id} onClick={() => navigate(sub.path)}
                    className={cn("block text-xs w-full text-left px-1 py-0.5 rounded hover:bg-muted",
                      isActive(sub.path) && "font-medium"
                    )}
                    style={{ color: isActive(sub.path) ? `hsl(${sub.glow || item.glow})` : undefined }}
                  >{sub.label}</button>
                ))}
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      );
    }

    // Expanded mode
    return (
      <>
        <button
          onClick={() => { navigate(item.path); if (hasChildren) toggleExpand(item.id); }}
          className={cn(
            "relative flex items-center gap-3 transition-all duration-200 group w-[calc(100%-12px)] px-3 py-2 mx-1.5",
            "border overflow-hidden"
          )}
          style={{
            borderRadius: "14px",
            backgroundColor: active ? `hsl(${item.glow} / 0.2)` : `hsl(${item.glow} / 0.08)`,
            borderColor: active ? `hsl(${item.glow} / 0.4)` : `hsl(${item.glow} / 0.2)`,
            color: itemColor,
            boxShadow: active
              ? `0 0 20px hsl(${item.glow} / 0.2), inset 0 1px 0 hsl(${item.glow} / 0.1)`
              : `0 2px 8px hsl(${item.glow} / 0.06)`,
          }}
          onMouseEnter={(e) => {
            if (!active) {
              e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.15)`;
              e.currentTarget.style.borderColor = `hsl(${item.glow} / 0.35)`;
              e.currentTarget.style.boxShadow = `0 0 16px hsl(${item.glow} / 0.15)`;
              e.currentTarget.style.transform = "translateX(2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              e.currentTarget.style.backgroundColor = `hsl(${item.glow} / 0.08)`;
              e.currentTarget.style.borderColor = `hsl(${item.glow} / 0.2)`;
              e.currentTarget.style.boxShadow = `0 2px 8px hsl(${item.glow} / 0.06)`;
              e.currentTarget.style.transform = "translateX(0)";
            }
          }}
        >
          {(active || parentActive) && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px]"
              style={{ backgroundColor: itemColor, height: active ? "20px" : "12px", opacity: active ? 1 : 0.6, borderRadius: "0 4px 4px 0" }} />
          )}
          <Icon className="h-4 w-4 shrink-0" style={{ color: itemColor }} />
          <span className="text-[13px] font-semibold truncate flex-1 text-left">{item.label}</span>
          {hasChildren && (
            <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-200", isOpen && "rotate-180")}
              style={{ color: `hsl(${item.glow} / 0.5)` }} />
          )}
          {active && (
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ borderRadius: "14px", background: `radial-gradient(ellipse at 30% 50%, hsl(${item.glow} / 0.6), transparent 70%)` }} />
          )}
        </button>

        <AnimatePresence>
          {hasChildren && isOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSubDragEnd(item.id, getOrderedChildren(item))}>
                <SortableContext items={getOrderedChildren(item).map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="ml-7 pl-3 py-1 flex flex-col gap-0.5" style={{ borderLeft: `2px solid hsl(${item.glow} / 0.2)` }}>
                    {getOrderedChildren(item).map((sub) => {
                      const subActive = isActive(sub.path);
                      const SubIcon = sub.icon || ChevronRight;
                      const subGlow = sub.glow || item.glow;
                      const subColor = `hsl(${subGlow})`;
                      return (
                        <SortableSubItem key={sub.id} id={sub.id}>
                          <button onClick={() => navigate(sub.path)}
                            className={cn(
                              "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs transition-all w-full",
                              "backdrop-blur-sm border border-transparent",
                              subActive && "border-white/8"
                            )}
                            style={{
                              color: subActive ? subColor : `hsl(${subGlow} / 0.7)`,
                              backgroundColor: subActive ? `hsl(${subGlow} / 0.12)` : undefined,
                              fontWeight: subActive ? 600 : 400,
                              boxShadow: subActive ? `0 0 10px hsl(${subGlow} / 0.1)` : undefined,
                            }}
                            onMouseEnter={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.backgroundColor = `hsl(${subGlow} / 0.06)`;
                                e.currentTarget.style.color = subColor;
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!subActive) {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.color = `hsl(${subGlow} / 0.7)`;
                                e.currentTarget.style.borderColor = "transparent";
                              }
                            }}
                          >
                            <SubIcon className="h-3.5 w-3.5 shrink-0" style={{ color: subColor }} />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        </SortableSubItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: expanded ? 240 : 64 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full flex flex-col bg-sidebar/70 backdrop-blur-2xl border-r border-white/[0.04] shrink-0 relative z-40"
    >
      {/* Header with hide button */}
      <div className={cn("shrink-0 border-b border-white/[0.04] flex items-center", expanded ? "px-3 py-2.5 justify-between" : "p-2.5 justify-center")}>
        {expanded && <span className="text-[9px] uppercase font-bold text-muted-foreground/40 tracking-[0.2em]">Navigation</span>}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 transition-colors"
            title={expanded ? "Collapse Dock" : "Expand Dock"}
          >
            {expanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/30 transition-colors"
            title="Hide Dock"
          >
            <PanelLeftClose className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className={cn("flex flex-col gap-0.5 py-2", expanded ? "px-2" : "px-2")}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderedItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {orderedItems.map((item) => (
                <SortableDockItem key={item.id} item={item}>
                  {renderItem(item)}
                </SortableDockItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className={cn("shrink-0 border-t border-white/5 p-2", !expanded && "flex justify-center")}>
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors w-full backdrop-blur-sm">
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
