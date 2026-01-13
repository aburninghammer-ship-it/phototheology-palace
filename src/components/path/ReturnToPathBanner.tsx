/**
 * Banner component that appears when a user on an active path navigates away
 * Provides quick navigation back to their current path training
 */

import { usePath, PATH_INFO, PathType } from "@/hooks/usePath";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className={`fixed z-30 pointer-events-auto
          bottom-24 right-4
          md:bottom-6 md:right-6
          ${className}`}
      >
        <Button
          onClick={() => navigate("/path/week")}
          size="sm"
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full 
            shadow-lg border
            ${pathData.bgColor} ${pathData.borderColor}
            hover:scale-105 transition-transform
          `}
          variant="secondary"
        >
          <span className="text-sm">{pathData.icon}</span>
          <span className="text-xs font-medium hidden sm:inline">
            Return to Path
          </span>
          <ArrowLeft className="h-3 w-3" />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
