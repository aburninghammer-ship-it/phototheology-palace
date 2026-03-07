import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown, Shield, Swords, AlertTriangle, CheckCircle2,
  Target, BookOpen, Zap
} from "lucide-react";

interface Claim {
  claim: string;
  textual_basis: string[];
  logical_move: string;
  possible_objections: string[];
  counterarguments: string[];
  weak_spots: string;
  strength_rating: number;
}

interface DebatePrep {
  thesis_statement: string;
  strongest_arguments: string[];
  anticipated_attacks: string[];
  defense_weapons: string[];
  checkmate_question: string;
}

interface ClaimLadderViewProps {
  claims: Claim[];
  debatePrep: DebatePrep | null;
}

export function ClaimLadderView({ claims, debatePrep }: ClaimLadderViewProps) {
  const [expandedClaim, setExpandedClaim] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {/* Debate Prep Overview */}
      {debatePrep && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Swords className="h-4 w-4 text-primary" />
              Debate Prep Sheet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {debatePrep.thesis_statement && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Thesis Statement</p>
                <p className="text-sm font-medium mt-0.5">{debatePrep.thesis_statement}</p>
              </div>
            )}

            {debatePrep.strongest_arguments?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">💪 Strongest Arguments</p>
                <div className="space-y-1">
                  {debatePrep.strongest_arguments.map((arg, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      <p>{arg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debatePrep.anticipated_attacks?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">⚔️ Anticipated Attacks</p>
                <div className="space-y-1">
                  {debatePrep.anticipated_attacks.map((att, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <p>{att}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debatePrep.defense_weapons?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">🛡️ Defense Weapons</p>
                <div className="space-y-1">
                  {debatePrep.defense_weapons.map((w, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <Shield className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <p>{w}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {debatePrep.checkmate_question && (
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-xs font-medium text-primary mb-1">♟️ Checkmate Question</p>
                <p className="text-sm font-medium italic">"{debatePrep.checkmate_question}"</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Claim Ladder */}
      {claims.length > 0 && (
        <div>
          <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
            <Target className="h-4 w-4 text-primary" />
            Claim Ladder ({claims.length} claims)
          </h3>
          <div className="space-y-2">
            {claims.map((claim, idx) => (
              <Collapsible
                key={idx}
                open={expandedClaim === idx}
                onOpenChange={() => setExpandedClaim(expandedClaim === idx ? null : idx)}
              >
                <Card className="transition-all">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-3 px-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-muted-foreground">#{idx + 1}</span>
                            <div className="w-8 mt-1">
                              <Progress 
                                value={(claim.strength_rating || 5) * 10} 
                                className="h-1.5"
                              />
                            </div>
                          </div>
                          <p className="text-sm font-medium truncate">{claim.claim}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] ${
                              (claim.strength_rating || 5) >= 8 ? "text-green-600 border-green-500/30" :
                              (claim.strength_rating || 5) >= 5 ? "text-amber-600 border-amber-500/30" :
                              "text-red-600 border-red-500/30"
                            }`}
                          >
                            {claim.strength_rating || "?"}/10
                          </Badge>
                          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expandedClaim === idx ? "rotate-180" : ""}`} />
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3 text-sm">
                      {/* Textual Basis */}
                      {claim.textual_basis?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            <BookOpen className="h-3 w-3 inline mr-1" />
                            Textual Basis
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {claim.textual_basis.map((v, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{v}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Logical Move */}
                      {claim.logical_move && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">🧠 Logical Move</p>
                          <p className="text-xs mt-0.5">{claim.logical_move}</p>
                        </div>
                      )}

                      {/* Objections */}
                      {claim.possible_objections?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-amber-600">⚠️ Possible Objections</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {claim.possible_objections.map((obj, i) => (
                              <li key={i} className="flex gap-1.5">
                                <span className="text-amber-500">•</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Counterarguments */}
                      {claim.counterarguments?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-600">🛡️ Counterarguments</p>
                          <ul className="text-xs space-y-1 mt-1">
                            {claim.counterarguments.map((ca, i) => (
                              <li key={i} className="flex gap-1.5">
                                <span className="text-green-500">•</span>
                                <span>{ca}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Weak Spots */}
                      {claim.weak_spots && (
                        <div className="bg-amber-500/5 rounded p-2 border border-amber-500/10">
                          <p className="text-xs font-medium text-amber-600">🔍 Weak Spot</p>
                          <p className="text-xs mt-0.5">{claim.weak_spots}</p>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
