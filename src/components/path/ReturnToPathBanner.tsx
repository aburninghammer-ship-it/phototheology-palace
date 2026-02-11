/**
 * Banner component that appears when a user on an active path navigates away
 * Provides quick navigation back to their current path training
 */

import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ReturnToPathBannerProps {
  className?: string;
}

export function ReturnToPathBanner({ className = "" }: ReturnToPathBannerProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { activePath, isLoading } = usePath();

  // Don't show on path-related pages
  const isOnPathPage = location.pathname.includes("/path");
  
  // Don't show while loading or if no active path
  if (isLoading || !activePath || isOnPathPage) {
    return null;
  }

  const pathType = activePath.path_type as PathType;
  const pathData = PATH_INFO[pathType];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed z-30 pointer-events-auto
          bottom-4 left-1/2 -translate-x-1/2
          ${className}`}
      >
        {/* Compact transparent version for all screens */}
        <div 
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full 
            bg-background/40 backdrop-blur-sm border border-border/30 
            shadow-sm cursor-pointer hover:bg-background/60 transition-colors
          `}
          onClick={() => navigate("/path/week")}
        >
          <Sparkles className="h-3 w-3 text-primary/70 animate-pulse" />
          <span className="text-xs text-muted-foreground">
            {pathData.icon} {t('path.pathActive', 'Path Active')}
          </span>
          <ArrowLeft className="h-3 w-3 text-muted-foreground" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
