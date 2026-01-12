import { SimmerSession } from "@/hooks/useSimmerSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, Lock, CheckCircle2, Loader2, ChevronRight, Gem } from "lucide-react";
import { motion } from "framer-motion";

interface SimmerDayPanelProps {
  session: SimmerSession;
  isProcessing: boolean;
  onProcessDay: (day: number) => Promise<any>;
  onLockGem: (gemId: string) => void;
}

const DAYS = [
  { num: 1, name: "Ignition & Core Claim", icon: "🔥", desc: "Claim, outline, pressure verses, raw gems" },
  { num: 2, name: "Flavor Explosion", icon: "💎", desc: "10-15 new gems, stack flavor aggressively" },
  { num: 3, name: "Structural Compression", icon: "🗜️", desc: "Sort gems, flag issues, map emotions" },
  { num: 4, name: "Christ-Centered Overcharge", icon: "✝️", desc: "Re-anchor every movement to Christ" },
  { num: 5, name: "Delivery Weaponization", icon: "🎯", desc: "Slides, quotes, visual force" },
  { num: 6, name: "Final Seasoning", icon: "👨‍🍳", desc: "Sharpen, remove fat, power check" },
];

export function SimmerDayPanel({ session, isProcessing, onProcessDay, onLockGem }: SimmerDayPanelProps) {
  const currentDay = session.current_day;
  const gems = (session.gems || []) as any[];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card className="bg-black/30 border-orange-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-orange-200 text-sm font-medium">Progress:</span>
            <span className="text-white font-bold">Day {currentDay} of 6</span>
          </div>
          <div className="flex gap-1">
            {DAYS.map((day) => (
              <div
                key={day.num}
                className={`flex-1 h-3 rounded-full transition-all ${
                  day.num < currentDay
                    ? "bg-green-500"
                    : day.num === currentDay
                    ? "bg-orange-500 animate-pulse"
                    : "bg-orange-500/20"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Cards */}
      <div className="grid gap-4">
        {DAYS.map((day) => {
          const isComplete = day.num < currentDay;
          const isCurrent = day.num === currentDay;
          const isLocked = day.num > currentDay;

          return (
            <motion.div
              key={day.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: day.num * 0.1 }}
            >
              <Card className={`border transition-all ${
                isComplete ? "bg-green-500/10 border-green-500/30" :
                isCurrent ? "bg-orange-500/20 border-orange-500/50 shadow-lg shadow-orange-500/20" :
                "bg-black/20 border-orange-500/10 opacity-60"
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{day.icon}</span>
                      <div>
                        <h3 className={`font-bold ${isComplete ? "text-green-400" : isCurrent ? "text-white" : "text-orange-200/60"}`}>
                          Day {day.num}: {day.name}
                        </h3>
                        <p className="text-sm text-orange-200/60">{day.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isComplete && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                      {isLocked && <Lock className="w-5 h-5 text-orange-200/40" />}
                      {isCurrent && (
                        <Button
                          onClick={() => onProcessDay(day.num)}
                          disabled={isProcessing}
                          className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                        >
                          {isProcessing ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Forging...</>
                          ) : (
                            <><Flame className="w-4 h-4 mr-2" /> Process Day {day.num}</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Core Claim Display */}
      {session.core_claim && (
        <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-200 text-sm">Core Claim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white text-lg font-medium italic">"{session.core_claim}"</p>
          </CardContent>
        </Card>
      )}

      {/* Gems Display */}
      {gems.length > 0 && (
        <Card className="bg-black/30 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-300 flex items-center gap-2">
              <Gem className="w-5 h-5" />
              Accumulated Gems ({gems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                {gems.map((gem: any, i: number) => (
                  <div
                    key={gem.id || i}
                    className={`p-3 rounded-lg border ${
                      gem.status === "locked"
                        ? "bg-amber-500/20 border-amber-500/40"
                        : "bg-black/20 border-orange-500/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-white text-sm">{gem.text}</p>
                        {gem.verse && <p className="text-xs text-orange-200/60 mt-1">{gem.verse}</p>}
                        {gem.ptCodes && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {gem.ptCodes.map((code: string) => (
                              <Badge key={code} variant="outline" className="text-xs border-orange-500/40 text-orange-300">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {gem.status !== "locked" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onLockGem(gem.id)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}
                      {gem.status === "locked" && (
                        <Lock className="w-4 h-4 text-amber-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
