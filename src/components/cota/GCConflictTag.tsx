import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Swords, Target, Shield, AlertTriangle, Crown } from "lucide-react";
import { GCConflictTag as GCConflictTagType, getBattlefieldColor, getOutcomeIcon } from "@/types/gcConflictTag";

interface GCConflictTagProps {
  tag: GCConflictTagType;
  defaultExpanded?: boolean;
}

export function GCConflictTag({ tag, defaultExpanded = false }: GCConflictTagProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <Card className="border-2 border-red-500/30 bg-gradient-to-br from-red-950/20 via-purple-950/20 to-blue-950/20">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-red-400" />
            <h4 className="font-bold text-red-300">Great Controversy Analysis</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 px-2"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>

        {/* Compact View */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className="bg-red-900/40 text-red-200 border-red-500/50">
            {tag.axis}
          </Badge>
          <span className="text-xs text-muted-foreground">•</span>
          {tag.battlefield.slice(0, 2).map((field) => (
            <Badge
              key={field}
              variant="outline"
              className={`border-${getBattlefieldColor(field)}/50 text-${getBattlefieldColor(field)}`}
            >
              {field}
            </Badge>
          ))}
          {tag.battlefield.length > 2 && (
            <Badge variant="outline" className="text-xs opacity-60">
              +{tag.battlefield.length - 2} more
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">•</span>
          {tag.outcome.slice(0, 1).map((outcome) => (
            <span key={outcome} className="text-xs flex items-center gap-1">
              <span>{getOutcomeIcon(outcome)}</span>
              <span className="text-muted-foreground">{outcome}</span>
            </span>
          ))}
        </div>

        {/* Expanded View */}
        {expanded && (
          <div className="space-y-3 pt-2 border-t border-red-500/20">
            {/* Satan's Strategy */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                <Target className="h-3 w-3" />
                Satan's Strategy
              </div>
              <p className="text-sm text-muted-foreground pl-5">{tag.satanStrategy}</p>
            </div>

            {/* God's Counter-Strategy */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <Shield className="h-3 w-3" />
                God's Counter-Strategy
              </div>
              <p className="text-sm text-muted-foreground pl-5">{tag.godCounterStrategy}</p>
            </div>

            {/* Battlefields */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-purple-400">Battlefields</div>
              <div className="flex flex-wrap gap-1.5 pl-5">
                {tag.battlefield.map((field) => (
                  <Badge
                    key={field}
                    variant="outline"
                    className={`border-${getBattlefieldColor(field)}/50 text-${getBattlefieldColor(field)} text-xs`}
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Deception Types */}
            {tag.deceptionType && tag.deceptionType.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
                  <AlertTriangle className="h-3 w-3" />
                  Deception Types
                </div>
                <div className="flex flex-wrap gap-1.5 pl-5">
                  {tag.deceptionType.map((deception) => (
                    <Badge key={deception} variant="outline" className="border-orange-500/50 text-orange-300 text-xs">
                      {deception}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Outcomes */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-green-400">
                <Crown className="h-3 w-3" />
                Outcomes
              </div>
              <div className="space-y-1 pl-5">
                {tag.outcome.map((outcome) => (
                  <div key={outcome} className="flex items-center gap-2 text-xs">
                    <span>{getOutcomeIcon(outcome)}</span>
                    <span className="text-muted-foreground">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prophetic Weight */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-violet-400">Prophetic Significance</div>
              <div className="flex items-center gap-2 pl-5">
                <div className="flex-1 bg-black/30 rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full"
                    style={{ width: `${tag.propheticWeight * 10}%` }}
                  />
                </div>
                <span className="text-xs text-violet-300 font-semibold">{tag.propheticWeight}/10</span>
              </div>
            </div>

            {/* Historical Period */}
            {tag.historicalPeriod && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-amber-400">Historical Period</div>
                <p className="text-xs text-muted-foreground pl-5">{tag.historicalPeriod}</p>
              </div>
            )}

            {/* Prophecy Connection */}
            {tag.prophecyConnection && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-cyan-400">Prophecy Connection</div>
                <p className="text-xs text-muted-foreground pl-5">{tag.prophecyConnection}</p>
              </div>
            )}

            {/* Modern Parallel */}
            {tag.modernParallel && (
              <div className="space-y-1">
                <div className="text-xs font-semibold text-pink-400">Modern Parallel</div>
                <p className="text-xs text-muted-foreground pl-5">{tag.modernParallel}</p>
              </div>
            )}

            {/* Defense Mode Relevance */}
            {tag.defenseRelevance && tag.defenseRelevance.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-red-400">⚔️ Defense Mode Relevance</div>
                <div className="space-y-2 pl-5">
                  {tag.defenseRelevance.map((defense, idx) => (
                    <div key={idx} className="p-2 bg-black/20 rounded border border-red-500/20">
                      <div className="text-xs font-medium text-white capitalize mb-1">{defense.opponent}</div>
                      <div className="text-xs text-orange-300">
                        <span className="opacity-70">Attack:</span> {defense.attackVector}
                      </div>
                      <div className="text-xs text-green-300">
                        <span className="opacity-70">Weapon:</span> {defense.defenseWeapon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
