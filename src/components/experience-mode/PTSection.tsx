/**
 * PTSection — Conditionally renders content based on experience mode
 * 
 * Use this to wrap architectural UI that should only appear in certain modes.
 */
import { useExperienceMode, type ExperienceMode } from "@/contexts/ExperienceModeContext";
import type { ReactNode } from "react";

interface PTSectionProps {
  /** Show content only in these modes */
  showIn: ExperienceMode | ExperienceMode[];
  /** Content to render */
  children: ReactNode;
  /** Optional fallback for other modes */
  fallback?: ReactNode;
}

export function PTSection({ showIn, children, fallback = null }: PTSectionProps) {
  const { mode } = useExperienceMode();
  
  const modes = Array.isArray(showIn) ? showIn : [showIn];
  
  if (modes.includes(mode)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
