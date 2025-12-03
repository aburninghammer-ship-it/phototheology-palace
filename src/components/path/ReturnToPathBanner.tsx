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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`fixed top-16 left-1/2 -translate-x-1/2 z-40 ${className}`}
      >
        <div 
          className={`
            flex items-center gap-3 px-4 py-2 rounded-full 
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
