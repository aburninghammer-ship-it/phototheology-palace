/**
 * BasicModeGate — Redirects Level 1 (Basic) users to /welcome.
 * Level 2 and Level 3 users pass through normally.
 * Wrap advanced routes that should be hidden from Basic mode.
 */
import { Navigate } from "react-router-dom";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

export function BasicModeGate({ children }: { children: React.ReactNode }) {
  const { isBasic } = useExperienceMode();

  if (isBasic) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
