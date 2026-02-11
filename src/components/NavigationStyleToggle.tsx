import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Menu } from "lucide-react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavigationStyleToggle = () => {
  const { t } = useTranslation();
  const { preferences, updatePreference } = useUserPreferences();

  const handleStyleChange = (style: "full" | "simplified") => {
    console.log("Navigation style changing to:", style);
    updatePreference("navigation_style", style);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {preferences.navigation_style === "full" ? (
            <LayoutGrid className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{t('navStyle.label')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStyleChange("full")}
          className={preferences.navigation_style === "full" ? "bg-accent" : ""}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          {t('navStyle.fullNavigation')}
          {preferences.navigation_style === "full" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStyleChange("simplified")}
          className={preferences.navigation_style === "simplified" ? "bg-accent" : ""}
        >
          <Menu className="h-4 w-4 mr-2" />
          {t('navStyle.simplifiedNavigation')}
          {preferences.navigation_style === "simplified" && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
