import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import type { CharacterProfile } from "@/data/biblicalCharacterProfiles";
import { cn } from "@/lib/utils";

interface CharacterProfileCardProps {
  character: CharacterProfile;
  imageUrl?: string;
  onClick: () => void;
}

const archetypeColors: Record<string, string> = {
  Shepherd: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Warrior: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Prophet: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Strategist: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Survivor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Redeemed: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  Seeker: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
  Manipulator: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Oppressor: "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  "Tragic Hero": "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  Servant: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  Matriarch: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
  Patriarch: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  Judge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  King: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Priest: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Missionary: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  Builder: "bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300",
  Exile: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300",
  Martyr: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300",
};

export function CharacterProfileCard({ character, imageUrl, onClick }: CharacterProfileCardProps) {
  const { quickCard, emoji, name, archetypes, situations } = character;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="relative shrink-0">
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <span className="absolute -bottom-1 -right-1 text-sm">{emoji}</span>
              </div>
            ) : (
              <span className="text-4xl">{emoji}</span>
            )}
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {archetypes.map((a) => (
                  <Badge
                    key={a}
                    variant="secondary"
                    className={cn("text-xs", archetypeColors[a] || "")}
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-sm">
          <div>
            <span className="text-muted-foreground">Strength: </span>
            <span className="font-medium">{quickCard.strength}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Weakness: </span>
            <span className="font-medium">{quickCard.weakness}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Mindset: </span>
            <span className="font-medium">{quickCard.mindset}</span>
          </div>
        </div>

        <p className="text-sm italic text-muted-foreground border-l-2 border-primary/30 pl-3">
          "{quickCard.keyLesson}"
        </p>

        {situations.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{situations.length} situation{situations.length !== 1 ? "s" : ""} to explore</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-primary group-hover:bg-primary/5"
        >
          View Full Profile
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
