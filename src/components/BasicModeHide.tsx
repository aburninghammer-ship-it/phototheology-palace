/**
 * BasicModeHide — Renders children only when NOT in Basic (Level 1) mode.
 * Use to hide global chrome (dock, title bar, banners) from the simplified Level 1 shell.
 */
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

export function BasicModeHide({ children }: { children: React.ReactNode }) {
  const { isBasic } = useExperienceMode();
  if (isBasic) return null;
  return <>{children}</>;
}
