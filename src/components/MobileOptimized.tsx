import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MobileOptimizedTabsProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper for TabsList that ensures proper scrolling on mobile
 * Usage: Wrap TabsList in this component
 */
export const MobileOptimizedTabs = ({ children, className }: MobileOptimizedTabsProps) => {
  return (
    <div className={cn("overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0", className)}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: 2 | 3 | 4;
  className?: string;
}

/**
 * Responsive grid that works well on all screen sizes
 */
export const ResponsiveGrid = ({ children, cols = 3, className }: ResponsiveGridProps) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[cols], className)}>
      {children}
    </div>
  );
};