import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playSound } from "@/hooks/useSoundEffects";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const checkScroll = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    
    const resizeObserver = new ResizeObserver(checkScroll);
    resizeObserver.observe(container);

    container.addEventListener('scroll', checkScroll);
    
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('scroll', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative flex items-center gap-1 w-full min-w-0">
      {showLeftArrow && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 h-8 w-8 rounded-full bg-background shadow-md hover:bg-muted z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scroll('left');
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto flex-1 min-w-0 scrollbar-hide touch-pan-x overscroll-x-contain"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <TabsPrimitive.List
          ref={ref}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full",
            className,
          )}
          {...props}
        />
      </div>

      {showRightArrow && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 h-8 w-8 rounded-full bg-background shadow-md hover:bg-muted z-20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            scroll('right');
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, onClick, ...props }, ref) => {
  const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    playSound("tab");
    onClick?.(e);
  }, [onClick]);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-shrink-0 min-h-[44px] touch-manipulation",
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
