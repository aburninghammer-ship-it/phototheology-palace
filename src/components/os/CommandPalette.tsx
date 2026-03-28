import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getAllDockItems } from "./dockData";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const allItems = useMemo(() => getAllDockItems(), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = useCallback((path: string) => {
    setOpen(false);
    navigate(path);
  }, [navigate]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search PhototheologyOS… (⌘K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {allItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.path + item.label}
                onSelect={() => handleSelect(item.path)}
                className="gap-3 cursor-pointer"
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: `hsl(${item.glow})` }} />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm truncate">{item.label}</span>
                  {item.parent && (
                    <span className="text-[10px] text-muted-foreground">{item.parent}</span>
                  )}
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

/** Tiny button to open the palette from the header or dock */
export function CommandPaletteTrigger({ className }: { className?: string }) {
  return (
    <button
      onClick={() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
      }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-muted-foreground",
        "border border-border/50 bg-muted/30 hover:bg-muted hover:text-foreground transition-colors",
        className
      )}
    >
      <span>Search…</span>
      <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  );
}
