import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDisplaySettings } from "@/hooks/useDisplaySettings";

export function FocusModeToggle() {
  const { focusMode, setFocusMode } = useDisplaySettings();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFocusMode(!focusMode)}
          className={focusMode ? "text-primary bg-primary/10" : ""}
          aria-label={focusMode ? "Disable Focus Mode" : "Enable Focus Mode"}
        >
          {focusMode ? <EyeOff className="h-[1.2rem] w-[1.2rem]" /> : <Eye className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{focusMode ? "Focus Mode ON — click to disable" : "Focus Mode — hide distractions"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
