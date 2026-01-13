/**
 * Banner component that appears when a user on an active path navigates away
 * Provides quick navigation back to their current path training
 */

import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ReturnToPathBannerProps {
  className?: string;
}

export function ReturnToPathBanner({ className = "" }: ReturnToPathBannerProps) {
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`fixed z-30 pointer-events-auto
          bottom-20 left-1/2 -translate-x-1/2
          md:bottom-auto md:top-20 md:left-1/2 md:-translate-x-1/2
          ${className}`}
      >
        {/* Compact mobile version */}
        <div 
          className={`
            md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full 
            backdrop-blur-lg border shadow-lg cursor-pointer
            ${pathData.bgColor} ${pathData.borderColor}
          `}
          onClick={() => navigate("/path/week")}
        >
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          <span className="text-xs font-medium">
            {pathData.icon} Path Active
          </span>
          <ArrowLeft className="h-3 w-3" />
        </div>

        {/* Full desktop version */}
        <div 
          className={`
            hidden md:flex items-center gap-3 px-4 py-2 rounded-full 
            backdrop-blur-lg border shadow-lg
            ${pathData.bgColor} ${pathData.borderColor}
          `}
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium">
            {pathData.icon} {pathData.name} Training Active
          </span>
          <Button
            variant="secondary"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => navigate("/path/week")}
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Return to Path
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
