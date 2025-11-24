import { Sword } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserMasterySwordProps {
  masterTitle?: string | null;
  currentFloor?: number;
  size?: "sm" | "md" | "lg";
  isOwner?: boolean;
}

const MASTERY_COLORS: Record<string, { color: string; label: string }> = {
  "none": { color: "text-green-500", label: "Apprentice (Green Sword)" },
  "blue": { color: "text-blue-500", label: "Blue Master" },
  "red": { color: "text-red-500", label: "Red Master" },
  "gold": { color: "text-yellow-600", label: "Gold Master" },
  "purple": { color: "text-purple-500", label: "Purple Master" },
  "white": { color: "text-gray-400", label: "White Master" },
  "black_candidate": { color: "text-gray-600", label: "Black Candidate" },
  "black": { color: "text-black dark:text-white", label: "Black Master" },
};

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const UserMasterySword: React.FC<UserMasterySwordProps> = ({ 
  masterTitle, 
  currentFloor = 0,
  size = "md",
  isOwner = false
}) => {
  // Determine sword color based on master title or current floor
  let swordConfig = MASTERY_COLORS["none"]; // Default green for apprentices
  
  // Palace Owner gets special treatment
  if (isOwner) {
    swordConfig = { ...MASTERY_COLORS["black"], label: "Palace Founder (Black Sword)" };
  } else if (masterTitle === "black") {
    swordConfig = MASTERY_COLORS["black"];
  } else if (currentFloor >= 7) {
    swordConfig = MASTERY_COLORS["black_candidate"];
  } else if (currentFloor >= 5) {
    swordConfig = MASTERY_COLORS["white"];
  } else if (currentFloor >= 4) {
    swordConfig = MASTERY_COLORS["purple"];
  } else if (currentFloor >= 3) {
    swordConfig = MASTERY_COLORS["gold"];
  } else if (currentFloor >= 2) {
    swordConfig = MASTERY_COLORS["red"];
  } else if (currentFloor >= 1) {
    swordConfig = MASTERY_COLORS["blue"];
  }

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <button className="focus:outline-none relative">
                <Sword className={`${swordConfig.color} ${SIZE_CLASSES[size]} cursor-pointer hover:opacity-80 transition-opacity ${isOwner ? 'animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : ''}`} />
              </button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>{swordConfig.label} - Click for details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Mastery Sword Progression</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            Your sword color represents your mastery level through the 8 floors of the Phototheology Palace.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Sword className="text-green-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Green Sword - Apprentice</p>
                <p className="text-sm text-muted-foreground">Starting your journey (Floor 0)</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-blue-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Blue Sword - Blue Master</p>
                <p className="text-sm text-muted-foreground">Floor 1 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-red-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Red Sword - Red Master</p>
                <p className="text-sm text-muted-foreground">Floor 2 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-yellow-600 h-6 w-6" />
              <div>
                <p className="font-semibold">Gold Sword - Gold Master</p>
                <p className="text-sm text-muted-foreground">Floor 3 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-purple-500 h-6 w-6" />
              <div>
                <p className="font-semibold">Purple Sword - Purple Master</p>
                <p className="text-sm text-muted-foreground">Floor 4 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-gray-400 h-6 w-6" />
              <div>
                <p className="font-semibold">White Sword - White Master</p>
                <p className="text-sm text-muted-foreground">Floor 5 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Sword className="text-gray-600 h-6 w-6" />
              <div>
                <p className="font-semibold">Gray Sword - Black Candidate</p>
                <p className="text-sm text-muted-foreground">Floor 7 completed</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border-2 border-primary/20">
              <Sword className="text-black dark:text-white h-6 w-6" />
              <div>
                <p className="font-bold text-lg">Black Sword - Black Master</p>
                <p className="text-sm">Complete all 8 floors to achieve the highest mastery level</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-lg border-2 border-yellow-500/50 mt-2">
              <Sword className="text-black dark:text-white h-6 w-6 animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
              <div>
                <p className="font-bold text-lg">Palace Founder - Special Black Sword</p>
                <p className="text-sm">Reserved for the founder of the Phototheology Palace with a distinctive golden glow</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <p className="font-semibold mb-2">How to Advance:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Complete rooms within each floor by finishing exercises and drills</li>
              <li>Meet the XP requirements for each floor</li>
              <li>Maintain your study streak</li>
              <li>Pass floor assessments when required</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
